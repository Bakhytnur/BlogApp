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
      id: '', // This will be replaced with a unique UUID
      title: '',
      body: '',
      favourite: false,
      user_id: userId,
      created_at: '',
      like_increment: 0,
      liked_by: [],
    });

    const handleSubmit = async () => {
      formData.id = uuidv4(); // Generate a unique UUID for the post ID
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
  align-items: flex-start; /* Align items to the top */
  height: 100%; /* Full height of the parent */
  padding-top: 50px; /* Add padding to move the form down */
  background-color: rgb(109, 160, 205); /* Background color for the wrapper */
}

.post__form {
  display: flex;
  flex-direction: column;
  justify-content: center; /* Center elements vertically */
  align-items: center; /* Center elements horizontally */
  gap: 20px; /* Space between form fields */
  max-width: 600px; /* Max width for the form */
  padding: 20px; /* Add padding inside the form */
  background-color: rgb(109, 160, 205); /* Background color for the form */
}

.post__form h2 {
  text-align: center;
  color: white; /* Change the color to contrast with the form background */
  margin-bottom: 20px; /* Space between the heading and the first field */
}

.post__form-field {
  display: flex;
  flex-direction: column;
  width: 100%; /* Ensure fields take up the full width of the form */
}

.post__form-field label {
  margin-bottom: 5px; /* Space between label and input */
  font-weight: bold; /* Optional: bold label text */
  color: white; /* Change the color to contrast with the form background */
}

.post__form-field input,
.post__form-field textarea {
  width: 100%; /* Full width input and textarea */
  padding: 10px; /* Padding inside input and textarea */
  font-size: 16px; /* Font size for input and textarea */
  border: 1px solid #ccc; /* Border for input and textarea */
  border-radius: 5px; /* Rounded corners for input and textarea */
  box-sizing: border-box; /* Include padding and border in the element's total width and height */
}

.post__form-field textarea {
  resize: vertical; /* Allow vertical resizing of the textarea */
}

.post__form-field--button {
  display: flex;
  justify-content: flex-end; /* Align button to the right */
  margin-top: 20px; /* Add space above the button */
}

.post__form-field button {
  padding: 10px 20px; /* Padding inside the button */
  font-size: 16px; /* Font size for the button */
  border: none; /* Remove default button border */
  border-radius: 5px; /* Rounded corners for the button */
  background-color: #0056b3; /* Button background color */
  color: #fff; /* Button text color */
  cursor: pointer; /* Pointer cursor on hover */
  transition: background-color 0.3s ease; /* Smooth transition for background color */
}

.post__form-field button:hover {
  background-color: #004494; /* Darker background on hover */
}
</style>
