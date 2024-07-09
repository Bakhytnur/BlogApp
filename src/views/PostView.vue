<template>
  <div class="content">
    <h2 class="content__header">Posts</h2>
    <ul class="content__ul">
      <li v-for="post in posts" :key="post.id" class="content__li">
        <div v-if="!isEditing(post.id)" class="content__li-info">
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
                <p class="post__info-p">{{ post.body }}</p>
              </div>
            </div>
            <div class="post__actions">
              <button class="post__actions-like" @click="toggleLike(post.id)">
                <font-awesome-icon
                  :icon="['fas', 'heart']"
                  :class="{
                    liked: post.user_id_likes.includes(currentUser),
                  }"
                />
                <p class="post__actions-like-quantity">
                  {{ post.like_increment }}
                </p>
              </button>
              <font-awesome-icon
                class="post__actions-icon"
                :icon="['fas', 'star']"
                @click="toggleFavourite(post.id, !post.favourite)"
                :class="{
                  favourite: post.user_id_favourites.includes(currentUser),
                  not_favourite: !post.user_id_favourites.includes(currentUser),
                }"
              />
              <button @click="startEditing(post.id)">Edit</button>
              <button @click="deletePost(post.id)">Delete</button>
            </div>
          </div>
        </div>
        <div v-else class="content__li-info">
          <div class="post__container">
            <div class="post__info">
              <input
                type="text"
                v-model="editedPost.title"
                placeholder="Title"
              />
              <textarea v-model="editedPost.body" placeholder="Body"></textarea>
            </div>
            <div class="post__actions">
              <button @click="saveEdit(post.id)">Save</button>
              <button @click="cancelEdit">Cancel</button>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { Post } from '@/store';

export default defineComponent({
  name: 'PostView',
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
    });
    const editingId = ref<string | null>(null);

    const currentUser = localStorage.getItem('userId') || '';
    console.log(currentUser);

    const userInfo = store.getters.getUser;
    console.log('userInfo', userInfo);

    const posts: any = computed(() => store.getters.filteredAndSortedPosts);
    const likedPosts = computed(() => {
      return posts.value
        .filter((post: any) => {
          console.log('Checking post:', post.id);
          console.log('user_id_likes:', post.user_id_likes);
          console.log('currentUser:', currentUser);
          console.log('user_id_favourites:', post.user_id_favourites);
          return Array.isArray(post.user_id_likes);
          //Array.isArray(post.user_id_likes) &&
          //post.user_id_likes.includes(currentUser)
        })
        .filter(
          (post: any) =>
            post.user_id_likes !== null && post.user_id_likes !== undefined,
        );
    });
    console.log('posts', posts.value);
    console.log('likedPosts:', likedPosts.value);
    //console.log(
    //likedPosts.value.map((post: any) =>
    //post.user_id_likes
    //? Object.values(likedPosts.value?.user_id_likes)
    //: [],
    //),
    //);

    onMounted(async () => {
      await store.dispatch('fetchPosts');
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
      } else {
        console.error('Post not found or liked_by is not an array');
      }
    };

    const toggleFavourite = async (id: string, favourite: boolean) => {
      console.log('id', id, 'favourite', favourite);
      await store.dispatch('setFavourite', { id, favourite });
      await store.dispatch('fetchPosts');
    };

    const isEditing = (id: string) => editingId.value === id;

    return {
      //posts: computed(() => store.state.posts),
      posts: computed(() => store.getters.filteredAndSortedPosts),
      editedPost,
      editingId,
      startEditing,
      cancelEdit,
      saveEdit,
      deletePost,
      isEditing,
      toggleLike,
      toggleFavourite,
      currentUser,
      likedPosts,
    };
  },
});
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  width: 100%;
  box-sizing: border-box;
}

.content__ul {
  list-style-type: none; /* Удаляем маркеры списка */
  padding: 0; /* Убираем внутренние отступы */
  margin: 0; /* Убираем внешние отступы */
  width: 100%; /* Ширина списка */
  margin-top: 10px;
  margin-bottom: 10px;
}

.content__li {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px; /* Расстояние между элементами списка */
  padding: 10px; /* Для отступов вокруг элементов списка */
  max-width: 1500px; /* Максимальная ширина для элементов списка */
  box-sizing: border-box; /* Включаем padding и border в общую ширину и высоту элемента */
}

.content__li-info {
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
  width: 100%; /* Делаем контейнер шириной 100% */
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
  font-size: 2em; /* Устанавливаем размер иконки */
  margin-right: 10px;
  color: white;
}

.post__info-icon .fa-icon {
  font-size: 2.5em; /* Увеличение размера иконки */
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

.post__info-p {
  color: white;
  font-size: 0.7em;
  margin-top: 5px;
}

input {
  margin-right: 20px;
}

.post__actions {
  display: flex;
  gap: 10px; /* Расстояние между кнопками */
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

.liked {
  color: #f00; /* Цвет для "лайкнутой" иконки */
}

.favourite {
  color: gold;
}

.not_favourite {
  color: white;
}
</style>
