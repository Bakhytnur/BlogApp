import Vue from 'vue';
import { createStore } from 'vuex';
import axios from 'axios';

export interface User {
  id: string;
  username: string;
  fio: string;
  city: string;
  address: string;
  date_of_birth: string;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  favourite: boolean;
  user_id: string;
  created_at: string;
  like_increment: number;
  liked_by: string[];
}

export interface PicturePost {
  id: string;
  image_url: string;
  description: string;
  favourite: boolean;
  like_increment: number;
}

export interface FavouritePost {
  id: string;
  title?: string;
  body?: string;
  favourite: boolean;
  user_id?: string;
  created_at?: string;
  like_increment: number;
  image_url?: string;
  description?: string;
}

interface State {
  posts: Post[];
  user: User | null;
  token: string | null;
}

export default createStore({
  state: {
    posts: [] as Post[],
    user: {} as User,
    picturePosts: [] as PicturePost[],
    favouritePosts: [] as FavouritePost[],
    token: localStorage.getItem('token'),
    searchQuery: '',
    sortKey: 'title',
    sortOrder: 'asc',
  },
  mutations: {
    setPosts(state, posts: Post[]) {
      state.posts = posts;
    },
    addPost(state, post: Post) {
      state.posts.push(post);
    },
    updatePost(state, updatedPost: Post) {
      const index = state.posts.findIndex((post) => post.id === updatedPost.id);
      const index2 = state.favouritePosts.findIndex(
        (post) => post.id === updatedPost.id,
      );
      if (index !== -1) {
        //state.posts.splice(index, 1, updatedPost);
        state.posts[index] = { ...state.posts[index], ...updatedPost };
      }
      if (index2 !== -1) {
        //state.posts.splice(index, 1, updatedPost);
        state.favouritePosts[index2] = {
          ...state.favouritePosts[index2],
          ...updatedPost,
        };
      }
    },
    deletePost(state, postId: string) {
      state.posts = state.posts.filter((post) => post.id !== postId);
      state.favouritePosts = state.favouritePosts.filter(
        (post) => post.id !== postId,
      );
    },
    //setUser(state, user: User) {
    //state.user = user;
    //},
    setUser(state, user: User) {
      state.user = user;
    },
    setToken(state, token: string) {
      state.token = token;
      console.log('Setting token in localStorage:', token);
      localStorage.setItem('token', token);
    },
    clearToken(state) {
      state.token = null;
      localStorage.removeItem('token');
    },
    setSearchQuery(state, query: string) {
      state.searchQuery = query;
    },
    setSortKey(state, key: string) {
      state.sortKey = key;
    },
    setSortOrder(state, order: string) {
      state.sortOrder = order;
    },
    setFavouritePosts(state, favouritePosts) {
      state.favouritePosts = favouritePosts;
    },
    setFavourite(state, { id, favourite }: { id: string; favourite: boolean }) {
      const post = state.posts.find((post) => post.id === id);
      if (post) {
        post.favourite = favourite;
      }
    },
    setPostLikeIncrement(
      state,
      {
        id,
        like_increment,
        userId,
        likedByCurrentUser,
      }: {
        id: string;
        like_increment: number;
        userId: string;
        likedByCurrentUser: boolean;
      },
    ) {
      const post = state.posts.find((post) => post.id === id);
      const favourite_post = state.favouritePosts.find(
        (post) => post.id === id,
      );
      if (post) {
        post.like_increment = like_increment;
      }

      if (favourite_post) {
        favourite_post.like_increment = like_increment;
      }
    },
    setPicturePosts(state, picturePosts: PicturePost[]) {
      state.picturePosts = picturePosts;
    },
    addPicturePost(state, picturePost: PicturePost) {
      state.picturePosts.push(picturePost);
    },
    updatePicturePost(state, updatedPicturePost: PicturePost) {
      const index = state.picturePosts.findIndex(
        (post) => post.id === updatedPicturePost.id,
      );
      const index2 = state.favouritePosts.findIndex(
        (post) => post.id === updatedPicturePost.id,
      );
      if (index !== -1) {
        ///state.picturePosts.splice(index, 1, updatedPicturePost);
        //Object.assign(state.picturePosts[index], updatedPicturePost);
        state.picturePosts[index] = {
          ...state.picturePosts[index],
          ...updatedPicturePost,
        };
        state.favouritePosts[index2] = {
          ...state.picturePosts[index2],
          ...updatedPicturePost,
        };
      }
    },
    deletePicturePost(state, picturePostId: string) {
      state.picturePosts = state.picturePosts.filter(
        (post) => post.id !== picturePostId,
      );
      state.favouritePosts = state.favouritePosts.filter(
        (post) => post.id !== picturePostId,
      );
    },
    setPicturePostFavourite(
      state,
      { id, favourite }: { id: string; favourite: boolean },
    ) {
      const post = state.picturePosts.find((post) => post.id === id);
      if (post) {
        post.favourite = favourite;
      }
    },
    setPicturePostLikeIncrement(
      state,
      { id, like_increment }: { id: string; like_increment: number },
    ) {
      const post = state.picturePosts.find((post) => post.id === id);
      if (post) {
        post.like_increment = like_increment;
      }
    },
    //logout(state) {
    //state.user = null;
    //},
  },
  actions: {
    async fetchPosts({ commit, state }) {
      try {
        const response = await axios.get('http://localhost:5003/api/posts', {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        commit('setPosts', response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 403
        ) {
          // Handle forbidden error, e.g., redirect to login
        }
      }
    },
    async addPost({ commit, state }, post: Post) {
      try {
        const response = await axios.post(
          'http://localhost:5003/api/posts',
          post,
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          },
        );
        commit('addPost', response.data);
      } catch (error) {
        console.error('Error creating post:', error);
      }
    },
    async updatePost({ commit, state }, post: Post) {
      try {
        const response = await axios.put(
          `http://localhost:5003/api/posts/${post.id}`,
          post,
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          },
        );
        commit('updatePost', response.data);
      } catch (error) {
        console.error('Error editing post:', error);
      }
    },
    async deletePost({ commit, state }, postId: string) {
      try {
        await axios.delete(`http://localhost:5003/api/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        commit('deletePost', postId);
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    },
    async setFavourite(
      { commit, state },
      { id, favourite }: { id: string; favourite: boolean },
    ) {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.put(
          `http://localhost:5003/api/posts/${id}/favourite`,
          {
            //favourite
            userId,
          },
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          },
        );
        console.log('response', response);
        commit('setFavourite', { id, favourite });
        //commit('updatePost', { id, favourite: response.data.favourite });
      } catch (error) {
        console.error('Error setting favourite:', error);
      }
    },
    async setFavouritePicture(
      { commit, state },
      { id, favourite }: { id: string; favourite: boolean },
    ) {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.put(
          `http://localhost:5003/api/pictureposts/${id}/favourite`,
          {
            //favourite
            userId,
          },
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          },
        );
        console.log('response', response);
        //commit('setPicturePostFavourite', { id, favourite });
        commit('updatePicturePost', { id, favourite: response.data.favourite });
      } catch (error) {
        console.error('Error setting favourite:', error);
      }
    },
    async setLikeIncrementPost(
      { commit, state },
      {
        id,
        currentLikeIncrement,
        likedByCurrentUser,
        newLikeIncrement,
      }: {
        id: string;
        currentLikeIncrement: number;
        likedByCurrentUser: boolean;
        newLikeIncrement: number;
      },
    ) {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.put(
          `http://localhost:5003/api/posts/${id}/like`,
          {
            userId,
            likedByCurrentUser,
          },
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          },
        );
        console.log(response);
        commit('setPostLikeIncrement', {
          id,
          like_increment: newLikeIncrement,
          //like_increment: response.data.like_increment,
          userId,
          likedByCurrentUser,
        });
      } catch (error) {
        console.error('Error setting like increment:', error);
      }
    },
    async setLikeIncrement(
      { commit, state },
      {
        id,
        currentLikeIncrement,
      }: { id: string; currentLikeIncrement: number },
    ) {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.put(
          `http://localhost:5003/api/pictureposts/${id}/like`,
          {
            userId,
          },
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          },
        );
        console.log(response);
        commit('setPicturePostLikeIncrement', {
          id,
          like_increment: response.data.like_increment,
        });
      } catch (error) {
        console.error('Error setting like increment:', error);
      }
    },
    async fetchPicturePosts({ commit, state }) {
      try {
        const response = await axios.get(
          'http://localhost:5003/api/pictureposts',
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          },
        );
        commit('setPicturePosts', response.data);
      } catch (error) {
        console.error('Error fetching picture posts:', error);
      }
    },
    async addPicturePost({ commit, state }, picturePost: PicturePost) {
      try {
        const response = await axios.post(
          'http://localhost:5003/api/pictureposts',
          picturePost,
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          },
        );
        commit('addPicturePost', response.data);
      } catch (error) {
        console.error('Error adding picture post:', error);
      }
    },
    async updatePicturePost({ commit, state }, picturePost: PicturePost) {
      try {
        const response = await axios.put(
          `http://localhost:5003/api/pictureposts/${picturePost.id}`,
          picturePost,
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          },
        );
        commit('updatePicturePost', response.data);
      } catch (error) {
        console.error('Error updating picture post:', error);
      }
    },
    async deletePicturePost({ commit, state }, picturePostId: string) {
      try {
        await axios.delete(
          `http://localhost:5003/api/pictureposts/${picturePostId}`,
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          },
        );
        commit('deletePicturePost', picturePostId);
      } catch (error) {
        console.error('Error deleting picture post:', error);
      }
    },
    async fetchFavouritePosts({ commit, state }) {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.get(
          'http://localhost:5003/api/favouriteposts',
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          },
        );
        commit('setFavouritePosts', response.data);
      } catch (error) {
        console.error('Error fetching favourite posts:', error);
      }
    },
    async register(
      { commit },
      {
        username,
        password,
        fio,
        city,
        address,
        date_of_birth,
      }: {
        username: string;
        password: string;
        fio: string;
        city: string;
        address: string;
        date_of_birth: Date;
      },
    ) {
      try {
        await axios.post('http://localhost:5003/api/register', {
          username,
          password,
          fio,
          city,
          address,
          date_of_birth,
        });
      } catch (error) {
        console.error('Error registering:', error);
      }
    },
    async login({ commit }, { username, password }) {
      try {
        const response = await axios.post('http://localhost:5003/api/login', {
          username,
          password,
        });
        console.log('Login response:', response.data); // Логирование ответа
        commit('setToken', response.data.token);
        commit('setUser', response.data);
        localStorage.setItem('userId', response.data.id);
        console.log('Token set in Vuex state:', response.data.token);
        //commit('setToken', response.data);
      } catch (error) {
        console.error('Error logging in:', error);
      }
    },
    async fetchUserProfile({ commit }) {
      try {
        const response = await axios.get(
          'http://localhost:5003/api/user/profile',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        );
        commit('setUser', response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    },
    async updateUserProfile({ commit, state }, user: User) {
      try {
        const response = await axios.put(
          `http://localhost:5003/api/users/${user.id}`,
          user,
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          },
        );
        commit('setUser', response.data);
      } catch (error) {
        console.error('Error updating user profile:', error);
      }
    },
    logout({ commit }) {
      commit('clearToken');
    },
    setSearchQuery({ commit }, query: string) {
      commit('setSearchQuery', query);
    },
    setSortKey({ commit }, key: string) {
      commit('setSortKey', key);
    },
    setSortOrder({ commit }, order: string) {
      commit('setSortOrder', order);
    },
  },
  getters: {
    allPosts: (state) => state.posts,
    getUser: (state) => state.user,
    allPicturePosts: (state) => state.picturePosts,
    postById: (state) => (id: string) =>
      state.posts.find((post) => post.id === id),
    picturePostById: (state) => (id: string) =>
      state.picturePosts.find((post) => post.id === id),
    isAuthenticated: (state) => !!state.token,
    filteredAndSortedPosts: (state) => {
      let filteredPosts = state.posts.filter(
        (post) =>
          (post.title ? post.title.toLowerCase() : '').includes(
            state.searchQuery.toLowerCase(),
          ) ||
          (post.body ? post.body.toLowerCase() : '').includes(
            state.searchQuery.toLowerCase(),
          ),
      );

      filteredPosts = filteredPosts.sort((a, b) => {
        const modifier = state.sortOrder === 'asc' ? 1 : -1;
        // Ensure TypeScript understands that state.sortKey is a valid key of Post
        const key = state.sortKey as keyof Post;

        if (a[key] < b[key]) return -1 * modifier;
        if (a[key] > b[key]) return 1 * modifier;
        return 0;
      });

      return filteredPosts;
    },
    filteredAndSortedPicturePosts: (state) => {
      let filteredPosts = state.picturePosts.filter((post) =>
        post.description
          .toLowerCase()
          .includes(state.searchQuery.toLowerCase()),
      );

      filteredPosts = filteredPosts.sort((a, b) => {
        const modifier = state.sortOrder === 'asc' ? 1 : -1;
        const key = state.sortKey as keyof PicturePost;

        if (a[key] < b[key]) return -1 * modifier;
        if (a[key] > b[key]) return 1 * modifier;
        return 0;
      });

      return filteredPosts;
    },
    //favouritePosts: (state) => state.posts.filter((post) => post.favourite),
    favouritePosts: (state) => state.favouritePosts,
  },
});
