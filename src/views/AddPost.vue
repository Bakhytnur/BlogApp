<template>
  <div class="form__wrapper">
    <form class="post__form" @submit.prevent="handleSubmit">
      <h2>Add a new post</h2>
      <div class="post__form-field">
        <label for="title">Title:</label>
        <input id="title" type="text" v-model="formData.title" required />
      </div>
      <div class="post__form-field">
        <label for="body">Body:</label>
        <textarea id="body" v-model="formData.body" required></textarea>
      </div>
      <div class="post__form-field post__form-field--button">
        <button type="submit">Create</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { v4 as uuidv4 } from 'uuid';
import { Post } from '@/store';

export default defineComponent({
  name: 'PostForm',
  setup() {
    const router = useRouter();
    const store = useStore();
    const userId = localStorage.getItem('userId') || '';

    const formData = reactive<Post>({
      id: '',
      title: '',
      body: '',
      favourite: false,
      user_id: userId,
      created_at: '',
      like_increment: 0,
      liked_by: [],
    });

    const handleSubmit = async () => {
      formData.id = uuidv4();
      await store.dispatch('addPost', formData);
      //router.push('/posts');
      router.push('/');
    };

    return {
      formData,
      handleSubmit,
    };
  },
});
</script>

<style scoped>
html,
body {
  height: 100%;
  margin: 0;
}

.form__wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
  padding-top: 50px;
  background-color: rgb(109, 160, 205);
}

.post__form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  max-width: 600px;
  padding: 20px;
  background-color: rgb(109, 160, 205);
}

.post__form h2 {
  text-align: center;
  color: white;
  margin-bottom: 20px;
}

.post__form-field {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.post__form-field label {
  margin-bottom: 5px;
  font-weight: bold;
  color: white;
}

.post__form-field input,
.post__form-field textarea {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.post__form-field textarea {
  resize: vertical;
}

.post__form-field--button {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.post__form-field button {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  background-color: #0056b3;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.post__form-field button:hover {
  background-color: #004494;
}
</style>
