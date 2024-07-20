<template>
  <div class="form__wrapper">
    <div class="button__group">
      <button
        @click="setCurrentComponent('AddPost')"
        :class="{ selected: currentComponent === 'AddPost' }"
      >
        Add Post
      </button>
      <button
        @click="setCurrentComponent('AddPicturePost')"
        :class="{ selected: currentComponent === 'AddPicturePost' }"
      >
        Add Picture Post
      </button>
    </div>
    <component :is="currentComponent" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import AddPost from './AddPost.vue';
import AddPicturePost from './AddPicturePost.vue';

export default defineComponent({
  name: 'PostManager',
  components: {
    AddPost,
    AddPicturePost,
  },
  setup() {
    const currentComponent = ref('AddPost');

    const setCurrentComponent = (component: string) => {
      currentComponent.value = component;
    };

    return {
      currentComponent,
      setCurrentComponent,
    };
  },
});
</script>

<style scoped>
.form__wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 20px;
}

.button__group {
  margin-bottom: 20px;
}

.button__group button {
  margin: 0 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: white;
  color: gray;
  height: 25px;
  width: 125px;
  transition: background-color 0.3s, color 0.3s;
}

.button__group button.selected {
  background-color: gray;
  color: white;
}
</style>
