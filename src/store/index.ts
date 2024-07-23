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
  liked: boolean;
  marked_favourite: boolean;
}

export interface PicturePost {
  id: string;
  image_url: string;
  description: string;
  favourite: boolean;
  like_increment: number;
  liked: boolean;
  marked_favourite: boolean;
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
  liked_by?: string[];
  liked: boolean;
}

interface State {
  posts: Post[];
  user: User | null;
  token: string | null;
  hasMorePosts: boolean;
  pageNumber: number;
  pageSize: number;
  hasMorePicturePosts: boolean;
  picturePageNumber: number;
  picturePageSize: number;
}

export default createStore({
  state: {
    posts: [] as Post[],
    user: {} as User,
    picturePosts: [] as PicturePost[],
    favouritePosts: [] as FavouritePost[],
    token: localStorage.getItem('token'),
    searchQuery: '',
    sortKey: 'Sort',
    sortOrder: 'Order',
    hasMorePosts: true,
    pageNumber: 1,
    pageSize: 10,
    hasMorePicturePosts: true,
    picturePageNumber: 1,
    picturePageSize: 5,
    hasMoreFavouritePosts: true,
    favouritePageNumber: 1,
    favouritePageSize: 5,
  },
  mutations: {
    setPosts(state, posts: Post[]) {
      state.posts = posts;
    },
    addPosts(state, posts: Post[]) {
      state.posts.push(...posts);
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
          //...state.posts[index2],
          ...updatedPost,
        };
        state.favouritePosts = state.favouritePosts.filter(
          (post) => post.id !== updatedPost.id,
        );
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
    setHasMorePosts(state, hasMore: boolean) {
      state.hasMorePosts = hasMore;
    },
    incrementPageNumber(state) {
      state.pageNumber += 1;
    },
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
    setFavourite(
      state,
      {
        id,
        favourite,
        marked_favourite,
      }: { id: string; favourite: boolean; marked_favourite: boolean },
    ) {
      const post = state.posts.find((post) => post.id === id);
      if (post) {
        post.favourite = favourite;
        post.marked_favourite = marked_favourite;
      }
    },
    setPostLikeIncrement(
      state,
      {
        id,
        like_increment,
        userId,
        likedByCurrentUser,
        liked,
      }: {
        id: string;
        like_increment: number;
        userId: string;
        likedByCurrentUser: boolean;
        liked: boolean;
      },
    ) {
      const post = state.posts.find((post) => post.id === id);
      const favourite_post = state.favouritePosts.find(
        (post) => post.id === id,
      );
      if (post) {
        post.like_increment = like_increment;
        post.liked = liked;
      }

      if (favourite_post) {
        favourite_post.like_increment = like_increment;
        favourite_post.liked = liked;
      }
    },
    setPicturePosts(state, picturePosts: PicturePost[]) {
      state.picturePosts = picturePosts;
    },
    addPicturePosts(state, picturePosts: PicturePost[]) {
      state.picturePosts.push(...picturePosts);
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
      }
      if (index2 !== -1) {
        state.favouritePosts[index2] = {
          ...state.favouritePosts[index2],
          ...updatedPicturePost,
        };
        state.favouritePosts = state.favouritePosts.filter(
          (post) => post.id !== updatedPicturePost.id,
        );
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
    setHasMorePicturePosts(state, hasMore: boolean) {
      state.hasMorePicturePosts = hasMore;
    },
    incrementPicturePageNumber(state) {
      state.picturePageNumber += 1;
    },
    setPicturePostFavourite(
      state,
      {
        id,
        favourite,
        marked_favourite,
      }: { id: string; favourite: boolean; marked_favourite: boolean },
    ) {
      const post = state.picturePosts.find((post) => post.id === id);
      if (post) {
        post.favourite = favourite;
        post.marked_favourite = marked_favourite;
      }
    },
    setPicturePostLikeIncrement(
      state,
      {
        id,
        like_increment,
        liked,
      }: { id: string; like_increment: number; liked: boolean },
    ) {
      const post = state.picturePosts.find((post) => post.id === id);
      const favourite_post = state.favouritePosts.find(
        (post) => post.id === id,
      );

      if (post) {
        post.like_increment = like_increment;
        post.liked = liked;
      }
      if (favourite_post) {
        favourite_post.like_increment = like_increment;
        favourite_post.liked = liked;
      }
    },
    addFavouritePosts(state, favouritePosts: FavouritePost[]) {
      state.favouritePosts.push(...favouritePosts);
    },
    setHasMoreFavouritePosts(state, hasMore: boolean) {
      state.hasMoreFavouritePosts = hasMore;
    },
    incrementFavouritePageNumber(state) {
      state.favouritePageNumber += 1;
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
          params: {
            page: state.pageNumber,
            pageSize: state.pageSize,
          },
        });

        const posts = response.data;
        if (posts.length < state.pageSize) {
          commit('setHasMorePosts', false);
        }
        //commit(state.pageNumber === 1 ? 'setPosts' : 'addPosts', posts);
        commit('addPosts', posts);
        commit('incrementPageNumber');
        //commit('setPosts', response.data);
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
    async fetchMorePosts({ dispatch }) {
      await dispatch('fetchPosts');
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
      { commit, dispatch, state },
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
        //commit('setFavourite', {
        //id,
        //favourite
        //});
        commit('updatePost', {
          id,
          favourite: response.data.favourite,
          marked_favourite: response.data.marked_favourite,
        });

        await dispatch('fetchFavouritePosts');
      } catch (error) {
        console.error('Error setting favourite:', error);
      }
    },
    async setFavouritePicture(
      { commit, dispatch, state },
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
        commit('updatePicturePost', {
          id,
          favourite: response.data.favourite,
          marked_favourite: response.data.marked_favourite,
        });

        await dispatch('fetchFavouritePosts');
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
          //like_increment: newLikeIncrement,
          like_increment: response.data.like_increment,
          liked: response.data.liked,
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
        console.log('response', response);
        commit('setPicturePostLikeIncrement', {
          id,
          like_increment: response.data.like_increment,
          liked: response.data.liked,
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
            params: {
              page: state.picturePageNumber,
              picturePageSize: state.picturePageSize,
            },
          },
        );

        console.log('state.picturePageNumber', state.picturePageNumber);

        const picture_posts = response.data;
        console.log('picture_posts', picture_posts);

        if (picture_posts.length < state.picturePageSize) {
          commit('setHasMorePicturePosts', false);
        }

        commit('addPicturePosts', picture_posts);
        commit('incrementPicturePageNumber');

        //commit('setPicturePosts', response.data);
      } catch (error) {
        console.error('Error fetching picture posts:', error);
      }
    },
    async fetchMorePicturePosts({ dispatch }) {
      await dispatch('fetchPicturePosts');
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
            params: {
              page: state.favouritePageNumber,
              favouritePageSize: state.favouritePageSize,
            },
          },
        );
        const favourite_posts = response.data;
        console.log('favourite_posts', favourite_posts);
        if (favourite_posts.length < state.favouritePageSize) {
          commit('setHasMoreFavouritePosts', false);
        }

        commit('addFavouritePosts', favourite_posts);
        commit('incrementFavouritePageNumber');
        //commit('setFavouritePosts', response.data);
      } catch (error) {
        console.error('Error fetching favourite posts:', error);
      }
    },
    async fetchMoreFavouritePosts({ dispatch }) {
      await dispatch('fetchFavouritePosts');
    },
    async fetchFavouritePostsMain({ commit, state }) {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.get(
          'http://localhost:5003/api/favouritepostsmain',
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
    //favouritePosts: (state) => state.favouritePosts,
    favouritePosts: (state) => {
      let filteredPosts = state.favouritePosts.filter(
        (post) =>
          (post.title ? post.title.toLowerCase() : '').includes(
            state.searchQuery.toLowerCase(),
          ) ||
          (post.body ? post.body.toLowerCase() : '').includes(
            state.searchQuery.toLowerCase(),
          ) ||
          (post.description ? post.description?.toLowerCase() : '').includes(
            state.searchQuery.toLowerCase(),
          ),
      );

      filteredPosts = filteredPosts.sort((a, b) => {
        const keyA = (a[state.sortKey as keyof FavouritePost] ?? '') as string;
        const keyB = (b[state.sortKey as keyof FavouritePost] ?? '') as string;
        if (state.sortOrder === 'asc') {
          return keyA.localeCompare(keyB);
        } else {
          return keyB.localeCompare(keyA);
        }
      });

      return filteredPosts;
    },
  },
});
