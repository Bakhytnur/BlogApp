<template>
  <div class="add__picture-post">
    <h2 class="add__picture-post-header">Add New Picture Post</h2>
    <div class="add__picture-post-form">
      <div class="form__group">
        <label for="imageUpload">Upload Image:</label>
        <input
          type="file"
          id="imageUpload"
          @change="handleImageUpload"
          accept="image/*"
        />
      </div>
      <div class="form__group">
        <label for="description">Description:</label>
        <textarea id="description" v-model="description"></textarea>
      </div>
      <div class="form__actions">
        <button @click="savePost">Save</button>
        <button @click="cancelPost">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'AddPicturePost',
  setup() {
    const store = useStore();
    const router = useRouter();
    const description = ref('');
    const image = ref<string | null>(null);

    const handleImageUpload = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          image.value = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    };

    const savePost = async () => {
      if (!image.value) {
        alert('Please upload an image.');
        return;
      }

      const picturePost = {
        image_url: image.value,
        description: description.value,
      };

      try {
        await store.dispatch('addPicturePost', picturePost);
        description.value = '';
        image.value = null;
        router.push('/pictureposts');
        //router.push('/');
      } catch (error) {
        console.error('Error adding picture post:', error);
      }
    };

    const cancelPost = () => {
      description.value = '';
      image.value = null;
    };

    return {
      description,
      handleImageUpload,
      savePost,
      cancelPost,
    };
  },
});
</script>

<style scoped>
.add__picture-post {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.add__picture-post-header {
  color: white;
  text-align: center;
}

.add__picture-post-form {
  background-color: rgb(109, 160, 205);
  padding: 20px;
  border-radius: 5px;
}

.form__group {
  margin-bottom: 15px;
  color: white;
}

input[type='file'] {
  color: white;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type='file'],
textarea {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  box-sizing: border-box;
}

.form__actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.form__actions button {
  margin-left: 10px;
  border: none;
  background-color: white;
  color: gray;
  cursor: pointer;
  height: 25px;
  width: 70px;
  border-radius: 5px;
}

.form__actions button:hover {
  background-color: #0056b3;
}
</style>
