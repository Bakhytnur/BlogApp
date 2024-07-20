<template>
  <div class="picture__post-container">
    <div class="picture__post">
      <div v-for="post in posts" :key="post.id" class="picture__post-item">
        <div class="picture__post-image">
          <label :for="'imageUpload-' + post.id" class="image__upload-label">
            <img
              :src="post.image_url"
              alt="Post Image"
              width="300"
              height="200"
            />
          </label>
          <input
            v-if="editingPostId === post.id"
            type="file"
            :id="'imageUpload-' + post.id"
            @change="handleImageUpload"
            style="display: none"
            accept="image/*"
          />
        </div>
        <div class="picture__post-actions">
          <button
            class="picture__post-actions-like"
            @click="toggleLike(post.id)"
          >
            <font-awesome-icon
              :icon="['fas', 'heart']"
              :class="{ liked: post.liked }"
            />
            <p class="picture__post-actions-like-quantity">
              {{ post.like_increment }}
            </p>
          </button>
          <font-awesome-icon
            class="post__actions__icon"
            :icon="['fas', 'star']"
            @click="toggleFavourite(post.id, !post.favourite)"
            :class="{
              favourite: post.favourite,
              not_favourite: !post.favourite,
            }"
          />
          <button @click="startEditing(post.id)">Edit</button>
          <button @click="deletePost(post.id)">Delete</button>
        </div>
        <div class="picture__post-description">
          <p>{{ post.description }}</p>
          <input v-if="editingPostId === post.id" v-model="editDescription" />
          <button v-if="editingPostId === post.id" @click="saveEdit(post.id)">
            Save
          </button>
          <button v-if="editingPostId === post.id" @click="cancelEdit">
            Cancel
          </button>
        </div>
      </div>
    </div>
    <button
      v-if="hasMorePosts && !loading"
      @click="loadMorePosts"
      class="picture__post-load-more-button"
    >
      Load More
    </button>
    <div v-if="loading" class="picture__post-loading-spinner">Loading...</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { PicturePost } from '@/store';

export default defineComponent({
  name: 'PicturePost',
  setup() {
    const store = useStore();
    const editingPostId = ref<string | null>(null);
    const editDescription = ref<string>('');
    const editPictureUrl = ref<string>('');
    const loading = ref(false);

    const hasMorePosts = computed(() => store.state.hasMorePicturePosts);

    const loadMorePosts = async () => {
      if (!loading.value) {
        loading.value = true;
        await store.dispatch('fetchMorePicturePosts');
        loading.value = false;
      }
    };

    onMounted(async () => {
      await store.dispatch('fetchPicturePosts');
    });

    //const posts = computed(() => store.state.picturePosts);
    const posts = computed(() => store.getters.filteredAndSortedPicturePosts);

    const currentUser = localStorage.getItem('userId') || '';
    console.log(currentUser);

    const toggleLike = async (id: string) => {
      const post = store.state.picturePosts.find(
        (post: PicturePost) => post.id === id,
      );
      console.log('post', post);

      if (post) {
        //const newLikeIncrement = post.like_increment + 1;
        //console.log(newLikeIncrement);
        await store.dispatch('setLikeIncrement', {
          id: post.id,
          currentLikeIncrement: post.like_increment,
        });
        await store.dispatch('fetchPicturePosts');
      }
    };

    const startEditing = (id: string) => {
      editingPostId.value = id;
      const post = store.state.picturePosts.find(
        (post: PicturePost) => post.id === id,
      );
      if (post) {
        editDescription.value = post.description;
        editPictureUrl.value = post.image_url;
      }
    };

    const handleImageUpload = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          editPictureUrl.value = e.target?.result as string;
          // Обновите изображение в текущем посте
          const post = store.state.picturePosts.find(
            (post: PicturePost) => post.id === editingPostId.value,
          );
          if (post) {
            post.image_url = editPictureUrl.value;
          }
        };
        reader.readAsDataURL(file);
      }
    };

    const saveEdit = (id: string) => {
      //console.log(editPictureUrl.value);
      store.dispatch('updatePicturePost', {
        id,
        image_url: editPictureUrl.value,
        description: editDescription.value,
      });
      editingPostId.value = null;
      editDescription.value = '';
      editPictureUrl.value = '';
    };

    const cancelEdit = () => {
      editingPostId.value = null;
      editDescription.value = '';
    };

    const deletePost = (id: string) => {
      store.dispatch('deletePicturePost', id);
    };

    const openImageUpload = (postId: string) => {
      const input = document.getElementById(
        `imageUpload-${postId}`,
      ) as HTMLInputElement;
      if (input) {
        input.click();
      }
      console.log(postId);
    };

    const toggleFavourite = async (id: string, favourite: boolean) => {
      console.log('id', id, 'favourite', favourite);
      await store.dispatch('setFavouritePicture', { id, favourite });
      await store.dispatch('fetchPicturePosts');
    };

    return {
      posts,
      toggleLike,
      startEditing,
      saveEdit,
      cancelEdit,
      deletePost,
      toggleFavourite,
      editingPostId,
      editDescription,
      handleImageUpload,
      openImageUpload,
      currentUser,
      loading,
      hasMorePosts,
      loadMorePosts,
    };
  },
});
</script>

<style scoped>
.picture__post-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 20px;
}

.picture__post {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding-left: 20px;
  padding-top: 20px;
  width: calc(100% - 40px);
  justify-content: center;
}

.picture__post-item {
  border: 1px solid #ccc;
  padding: 10px;
  width: 300px;
}

.picture__post-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
}

.image__upload-label {
  display: block;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.picture__post-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.picture__post-actions button {
  border-radius: 5px;
  border: none;
  height: 25px;
  width: 70px;
  color: gray;
}

.picture__post-actions-like {
  background-color: rgb(109, 160, 205);
  border: none;
  height: 45px;
  width: 70px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.picture__post-actions-like-quantity {
  color: white;
}

.picture__post-description {
  margin-top: 10px;
}

.picture__post-load-more-button {
  margin-top: 10px;
  border-radius: 5px;
  border: none;
  height: 25px;
  width: 70px;
  color: gray;
}

.picture__post-loading-spinner {
  margin-top: 10px;
  border-radius: 5px;
  border: none;
  height: 25px;
  width: 70px;
  color: gray;
}

.liked {
  color: #f00;
}

.favourite {
  color: gold;
}

.not_favourite {
  color: white;
}
</style>
