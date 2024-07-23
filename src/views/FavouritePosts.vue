<template>
  <div class="content">
    <h2 class="content__header">Favourite Posts</h2>
    <ul class="content__list">
      <li v-for="post in favouritePosts" :key="post.id" class="content__item">
        <div class="content__post-type" v-if="!post.image_url">
          <div v-if="!isEditing(post.id)" class="content__post-info">
            <div class="post__container">
              <div class="post__info">
                <div class="post__info-icon">
                  <font-awesome-icon :icon="['fas', 'user-alt']" />
                </div>
                <div class="post__info-title-body">
                  <router-link
                    class="post__info-link"
                    :to="{ name: 'PostDetail', params: { id: post.id } }"
                  >
                    {{ post.title }}
                  </router-link>
                  <p class="post__info-body">{{ post.body }}</p>
                </div>
              </div>
              <div class="post__actions">
                <button class="post__actions-like" @click="toggleLike(post.id)">
                  <font-awesome-icon
                    :icon="['fas', 'heart']"
                    :class="{ liked: post.liked }"
                  />
                  <p class="post__actions-like-quantity">
                    {{ post.like_increment }}
                  </p>
                </button>
                <font-awesome-icon
                  :icon="['fas', 'star']"
                  @click="toggleFavourite(post.id, !post.favourite)"
                  :class="{
                    favourite: post.marked_favourite,
                    not_favourite: !post.marked_favourite,
                  }"
                />
                <button @click="startEditing(post.id)">Edit</button>
                <button @click="deletePost(post.id)">Delete</button>
              </div>
            </div>
          </div>
          <div v-else class="content__post-edit">
            <div class="post__container">
              <div class="post__info">
                <input
                  type="text"
                  v-model="editedPost.title"
                  placeholder="Title"
                />
                <textarea
                  v-model="editedPost.body"
                  placeholder="Body"
                ></textarea>
              </div>
              <div class="post__actions">
                <button @click="saveEdit(post.id)">Save</button>
                <button @click="cancelEdit">Cancel</button>
              </div>
            </div>
          </div>
        </div>
        <div class="content__post-type" v-else>
          <div class="picture__post-container">
            <div class="picture__post-image">
              <label :for="'imageUpload-' + post.id" class="image-upload-label">
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
          </div>
          <div class="picture__post-actions">
            <div class="picture__post-like">
              <button
                class="picture__post-actions-like"
                @click="toggleLikePicturePost(post.id)"
              >
                <font-awesome-icon
                  :icon="['fas', 'heart']"
                  :class="{ liked: post.liked }"
                />
                <p class="picture__post-like-quantity">
                  {{ post.like_increment }}
                </p>
              </button>
            </div>
            <div class="picture__post-favourite-btns">
              <font-awesome-icon
                class="post__actions-icon"
                :icon="['fas', 'star']"
                @click="toggleFavouritePicturePost(post.id, !post.favourite)"
                :class="{
                  favourite: post.marked_favourite,
                  not_favourite: !post.marked_favourite,
                }"
              />
              <button @click="startEditingPicturePost(post.id)">Edit</button>
              <button @click="deletePostPicturePost(post.id)">Delete</button>
            </div>
          </div>
          <div class="picture__post-description">
            <p>{{ post.description }}</p>
            <input v-if="editingPostId === post.id" v-model="editDescription" />
            <button
              v-if="editingPostId === post.id"
              @click="saveEditPicturePost(post.id)"
            >
              Save
            </button>
            <button
              v-if="editingPostId === post.id"
              @click="cancelEditPicturePost"
            >
              Cancel
            </button>
          </div>
        </div>
      </li>
    </ul>
    <button
      v-if="hasMorePosts && !loading"
      @click="loadMorePosts"
      class="content__load-more-button"
    >
      Load More
    </button>
    <div v-if="loading" class="content__loading-spinner">Loading...</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import { useStore } from 'vuex';
import { Post, PicturePost } from '@/store';

export default defineComponent({
  name: 'FavouritePostsView',
  setup() {
    const store = useStore();
    const editedPost = ref<Post>({
      id: '',
      title: '',
      body: '',
      favourite: false,
      user_id: '',
      created_at: '',
      like_increment: 0,
      liked_by: [],
      liked: false,
      marked_favourite: false,
    });
    const editingId = ref<string | null>(null);

    const editingPostId = ref<string | null>(null);
    const editDescription = ref<string>('');
    const editPictureUrl = ref<string>('');
    const loading = ref(false);

    const hasMorePosts = computed(() => store.state.hasMoreFavouritePosts);

    const currentUser = localStorage.getItem('userId') || '';
    console.log(currentUser);

    const loadMorePosts = async () => {
      if (!loading.value) {
        loading.value = true;
        await store.dispatch('fetchMoreFavouritePosts');
        loading.value = false;
      }
    };

    const loadFavouritePosts = async () => {
      await store.dispatch('fetchFavouritePostsMain');
    };

    onMounted(async () => {
      //await store.dispatch('fetchPosts');
      //await store.dispatch('fetchPicturePosts');
      await store.dispatch('fetchFavouritePosts');
    });

    const startEditing = (id: string) => {
      const post = store.state.posts.find((post: Post) => post.id === id);
      if (post) {
        editedPost.value = { ...post };
        editingId.value = id;
      }
    };

    const cancelEdit = () => {
      editingId.value = null;
      editedPost.value = {
        id: '',
        title: '',
        body: '',
        favourite: false,
        user_id: '',
        created_at: '',
        like_increment: 0,
        liked_by: [],
        liked: false,
        marked_favourite: false,
      };
    };

    const saveEdit = async (id: string) => {
      await store.dispatch('updatePost', editedPost.value);
      cancelEdit();
    };

    const deletePost = async (id: string) => {
      await store.dispatch('deletePost', id);
      await store.dispatch('fetchPosts');
    };

    const toggleLike = async (id: string) => {
      //const post = store.state.posts.find((post: Post) => post.id === id);
      const post = store.getters.allPosts.find((post: Post) => post.id === id);
      console.log('post', post);
      if (post) {
        const userId = currentUser;
        //const likedByCurrentUser = post.liked_by.includes(userId);
        const likedByCurrentUser = post.user_id_likes.includes(userId);
        console.log('likedByCurrentUser', likedByCurrentUser);

        const newLikeIncrement = likedByCurrentUser
          ? post.like_increment - 1
          : post.like_increment + 1;

        console.log(newLikeIncrement);
        await store.dispatch('setLikeIncrementPost', {
          id: post.id,
          currentLikeIncrement: post.like_increment,
          likedByCurrentUser,
          newLikeIncrement,
        });

        await store.dispatch('fetchPosts');
        await store.dispatch('fetchFavouritePosts');
      } else {
        console.error('Post not found or liked_by is not an array');
      }
    };

    const toggleFavourite = async (id: string, favourite: boolean) => {
      await store.dispatch('setFavourite', { id, favourite });
      await store.dispatch('fetchPosts');
      await store.dispatch('fetchFavouritePosts');
    };

    //picture posts methods

    const toggleLikePicturePost = async (id: string) => {
      const post = store.state.picturePosts.find(
        (post: PicturePost) => post.id === id,
      );
      console.log(post);
      if (post) {
        //const newLikeIncrement = post.like_increment + 1;
        //console.log(newLikeIncrement);
        await store.dispatch('setLikeIncrement', {
          id: post.id,
          currentLikeIncrement: post.like_increment,
        });
        await store.dispatch('fetchPicturePosts');
        await store.dispatch('fetchFavouritePosts');
      }
    };

    const startEditingPicturePost = (id: string) => {
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

    const saveEditPicturePost = (id: string) => {
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

    const cancelEditPicturePost = () => {
      editingPostId.value = null;
      editDescription.value = '';
    };

    const deletePostPicturePost = (id: string) => {
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

    const toggleFavouritePicturePost = async (
      id: string,
      favourite: boolean,
    ) => {
      console.log('id', id, 'favourite', favourite);
      await store.dispatch('setFavouritePicture', { id, favourite });
      await store.dispatch('fetchPicturePosts');
      await store.dispatch('fetchFavouritePosts');
    };

    //getters
    const isEditing = (id: string) => editingId.value === id;

    const favouritePosts = computed(() => store.getters.favouritePosts);
    console.log(favouritePosts);

    return {
      favouritePosts,
      startEditing,
      cancelEdit,
      saveEdit,
      deletePost,
      isEditing,
      editedPost,
      toggleLike,
      toggleFavourite,
      currentUser,

      editingPostId,
      editDescription,
      toggleLikePicturePost,
      startEditingPicturePost,
      saveEditPicturePost,
      cancelEditPicturePost,
      deletePostPicturePost,
      toggleFavouritePicturePost,
      handleImageUpload,
      openImageUpload,
      loading,
      hasMorePosts,
      loadMorePosts,
    };
  },
});
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  width: 100%;
  box-sizing: border-box;
}

.content__list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.content__item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  width: 70%;
  box-sizing: border-box;
  border-bottom: 1px solid gray;
}

.content__post-info {
  width: 100%;
}

.content__post-type {
  width: 100%;
}

.content__header {
  color: white;
  font-size: 1.2em;
}

.post__container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.post__info {
  display: flex;
  flex-direction: row;
  margin-right: 10px;
}

.post__info-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  margin-right: 10px;
  color: white;
}

.post__info-icon .fa-icon {
  font-size: 2.5em;
  height: 100px;
  display: flex;
  align-items: center;
}

.post__info-title-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.post__info-link {
  text-decoration: none;
  color: white;
  font-size: 1em;
}

.post__info-body {
  color: white;
  font-size: 0.7em;
  margin-top: 5px;
}

.post__actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.post__actions-icon {
  color: white;
}

.post__actions button {
  border-radius: 5px;
  border: none;
  height: 25px;
  width: 70px;
  color: gray;
}

.post__actions-like {
  color: white;
  background-color: rgb(109, 160, 205);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.post__actions-like-quantity {
  color: white;
}

.favourite {
  color: gold;
}

.picture__post {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.picture__post-item {
  border: 1px solid #ccc;
  padding: 10px;
  width: 300px;
}

.picture__post-container {
}
.picture__post-image {
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.image__upload-label {
  display: block;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
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
  width: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.picture__post-like-quantity {
  color: white;
}

.picture__post-description {
  margin-top: 10px;
}

.content__load-more-button {
  border-radius: 5px;
  border: none;
  height: 25px;
  width: 70px;
  color: gray;
}

.content__loading-spinner {
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

.picture__post-like {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.picture__post-favourite-btns {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>
