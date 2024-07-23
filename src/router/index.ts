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
import { useStore } from 'vuex';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'ProfileView',
    component: ProfileView,
    meta: { requiresAuth: true },
  },
  {
    path: '/posts',
    name: 'PostView',
    component: PostView,
    meta: { requiresAuth: true },
  },
  {
    path: '/post/:id',
    name: 'PostDetail',
    component: PostDetail,
    meta: { requiresAuth: true },
  },
  {
    path: '/post/new',
    name: 'NewPost',
    component: AddPost,
    meta: { requiresAuth: true },
  },
  {
    path: '/post/edit/:id',
    name: 'EditPost',
    component: AddPost,
    meta: { requiresAuth: true },
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
    path: '/favourites',
    name: 'FavouritePosts',
    component: FavouritePosts,
    meta: { requiresAuth: true },
  },
  {
    path: '/pictureposts',
    name: 'PicturePost',
    component: PicturePost,
    meta: { requiresAuth: true },
  },
  {
    path: '/picturepost/new',
    name: 'AddPicturePost',
    component: AddPicturePost,
    meta: { requiresAuth: true },
  },
  {
    path: '/posts/new',
    name: 'NewPosts',
    component: PostManager,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const store = useStore();
  const isAuthenticated = store.getters.isAuthenticated;

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
