<template>
  <div class="content">
    <div class="content__posts-pictures">
      <div class="content__posts">
        <div
          v-if="picture_posts.length > 0"
          class="content__posts-img-description"
        >
          <img
            :src="picture_posts[picture_posts.length - 1].image_url"
            alt="Post Image"
            width="345"
            height="180"
          />
          <p>{{ picture_posts[picture_posts.length - 1].description }}</p>
        </div>
        <div v-else>No Image Available</div>
      </div>
      <div class="content__pictures">
        <div
          v-if="picture_posts.length > 0"
          class="content__posts-img-description"
        >
          <img
            :src="picture_posts[picture_posts.length - 2].image_url"
            alt="Post Image"
            width="345"
            height="180"
          />
          <p>{{ picture_posts[picture_posts.length - 2].description }}</p>
        </div>
        <div v-else>No Image Available</div>
      </div>
    </div>
    <div class="content__favourites">
      <Carousel
        ref="carouselRef"
        class="large-carousel"
        :items-to-show="3"
        :wrap-around="true"
        :mouse-drag="true"
      >
        <Slide v-for="(post, index) in picture_posts" :key="index">
          <img :src="post.image_url" alt="Favourite Image" />
        </Slide>
      </Carousel>
      <button @click="goPrev" class="carousel-button prev-button">‹</button>
      <button @click="goNext" class="carousel-button next-button">›</button>
    </div>
    <!-- New smaller carousel -->
    <div class="content__small-favourites">
      <Carousel
        class="small-carousel"
        :items-to-show="5"
        :wrap-around="true"
        :autoplay="100"
        :mouse-drag="true"
        :transition="1000"
      >
        <Slide v-for="(post, index) in picture_posts" :key="index">
          <img
            :src="post.image_url"
            alt="Small Favourite Image"
            class="small-img"
          />
        </Slide>
      </Carousel>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed, Ref } from 'vue';
import { useStore } from 'vuex';
import { Post } from '@/store';
import { Carousel, Slide } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';

interface CarouselMethods {
  prev: () => void;
  next: () => void;
}

export default defineComponent({
  name: 'HomeView',
  components: {
    Carousel,
    Slide,
  },
  setup() {
    const store = useStore();

    const carouselRef: Ref<CarouselMethods | null> = ref(null);

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
    const picture_posts = computed(() => store.getters.allPicturePosts);

    console.log('picture_posts', picture_posts.value);

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
      await store.dispatch('fetchPicturePosts');
      carouselRef.value = document.getElementById(
        'carousel',
      ) as CarouselMethods | null;
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
      await store.dispatch('fetchPosts'); // Ensure the posts list is updated
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

    const goPrev = () => {
      if (carouselRef.value) {
        carouselRef.value.prev();
      }
    };

    const goNext = () => {
      if (carouselRef.value) {
        carouselRef.value.next();
      }
    };

    console.log(carouselRef.value);

    return {
      //posts: computed(() => store.state.posts),
      posts: computed(() => store.getters.filteredAndSortedPosts),
      picture_posts,
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
      goPrev,
      goNext,
      carouselRef,
    };
  },
});
</script>

<style scoped>
@import 'vue3-carousel/dist/carousel.css';

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  overflow-y: auto;
  max-width: 800px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.content__posts-pictures {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
}

.content__posts,
.content__pictures {
  width: 48%;
  height: 200px;
  /*background-color: #5778be;*/
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px gray solid;
}

.content__posts-img-description {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.content__favourites {
  width: 100%;
  height: 200px;
  /*background-color: #5778be;*/ /* Placeholder for background color */
  box-sizing: border-box;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px gray solid;
  position: relative;
}

.large-carousel,
.large-carousel .carousel__slide {
  width: 100%;
  height: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.large-carousel .carousel__slide img {
  width: 100%;
  object-fit: cover;
  height: 200px;
  width: 280px;
  margin-right: 10px;
}

.carousel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 1;
}

.prev-button {
  left: 10px;
}

.next-button {
  right: 10px;
}

/* New carousel styles */
.content__small-favourites {
  width: 100%;
  height: 70px;
  box-sizing: border-box;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px gray solid;
  position: relative;
}

.small-carousel,
.small-carousel .carousel__slide {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.small-carousel .carousel__slide img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  margin-right: 10px;
}

.small-img {
  width: 100%;
  height: 50%;
  object-fit: cover;
}

.carousel__slide {
  transition: transform 0.1s ease-in-out;
}
</style>
