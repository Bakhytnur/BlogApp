<template>
  <div v-if="post">
    <h2>{{ post.title }}</h2>
    <p>{{ post.body }}</p>
    <router-link :to="{ name: 'EditPost', params: { id: post.id } }"
      >Edit</router-link
    >
    <button @click="deletePost(post.id)">Delete</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { Post } from '@/store';

export default defineComponent({
  name: 'PostDetail',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const post = computed(() =>
      store.state.posts.find((p: Post) => p.id === route.params.id),
    );

    const deletePost = async (postId: number) => {
      if (confirm('Are you sure you want to delete this post?')) {
        await store.dispatch('deletePost', postId);
        router.push('/');
      }
    };

    return {
      post,
      deletePost,
    };
  },
});
</script>
