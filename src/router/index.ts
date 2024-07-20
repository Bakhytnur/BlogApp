import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import ProfileView from '@/views/ProfileView.vue';
import PostView from '@/views/PostView.vue';
import PostDetail from '@/views/PostDetail.vue';
import AddPost from '@/views/AddPost.vue';
import LoginView from '@/views/Login.vue';
import RegisterView from '@/views/RegisterView.vue';
import FavouritePosts from '../views/FavouritePosts.vue';
import PicturePost from '@/views/PicturePost.vue';
import AddPicturePost from '@/views/AddPicturePost.vue';
import PostManager from '@/views/PostManager.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView,
  },
  {
    path: '/profile',
    name: 'ProfileView',
    component: ProfileView,
  },
  {
    path: '/posts',
    name: 'PostView',
    component: PostView,
  },
  {
    path: '/post/:id',
    name: 'PostDetail',
    component: PostDetail,
  },
  {
    path: '/post/new',
    name: 'NewPost',
    component: AddPost,
  },
  {
    path: '/post/edit/:id',
    name: 'EditPost',
    component: AddPost,
  },
  {
    path: '/login',
    name: 'LoginView',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'RegisterView',
    component: RegisterView,
  },
  {
    path: '/favourites', // Новый маршрут
    name: 'FavouritePosts',
    component: FavouritePosts,
  },
  {
    path: '/pictureposts', // Маршрут для PicturePost
    name: 'PicturePost',
    component: PicturePost,
  },
  {
    path: '/picturepost/new', // Маршрут для AddPicturePost
    name: 'AddPicturePost',
    component: AddPicturePost,
  },
  {
    path: '/posts/new',
    name: 'NewPosts',
    component: PostManager,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
