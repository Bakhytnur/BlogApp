<template>
  <div class="login__page">
    <h2 class="login__page-title">Login</h2>
    <form class="login__page-form" @submit.prevent="handleLogin">
      <div class="login__page-username">
        <div class="login__page-username-label-container">
          <label for="username">Username:</label>
        </div>
        <input type="text" v-model="username" id="username" required />
      </div>
      <div class="login__page-password">
        <div class="login__page-password-label-container">
          <label class="login__page-password-label" for="password"
            >Password:</label
          >
        </div>
        <input type="password" v-model="password" id="password" required />
      </div>
      <div class="login__page-btn-container">
        <button class="login__page-btn" type="submit">Login</button>
      </div>
    </form>
    <p v-if="errorMessage" class="login__page-err">{{ errorMessage }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'LoginView',
  setup() {
    const username = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const store = useStore();
    const router = useRouter();

    const handleLogin = async () => {
      try {
        errorMessage.value = ''; // Очистить сообщение об ошибке
        await store.dispatch('login', {
          username: username.value,
          password: password.value,
        });
        router.push('/posts');
      } catch (error: unknown) {
        if (error instanceof Error) {
          errorMessage.value = 'Login failed: ' + error.message;
        } else {
          errorMessage.value = 'Login failed: An unknown error occurred';
        }
      }
    };

    return {
      username,
      password,
      errorMessage,
      handleLogin,
    };
  },
});
</script>

<style scoped>
.login__page {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 20px;
}

.login__page-title {
  color: white;
  padding-bottom: 20px;
  font-size: 1.2em;
}

.login__page-username {
  display: flex;
  gap: 20px;
  color: white;
}

.login__page-username-label-container {
  display: flex;
  flex-direction: row;
  width: 70px;
}

.login__page-username label {
  margin-right: 10px;
  width: 100px;
}

.login__page-password {
  display: flex;
  gap: 20px;
  color: white;
}

.login__page-password-label-container {
  display: flex;
  flex-direction: row;
  width: 70px;
}

.login__page-password label {
  margin-right: 10px;
}

.login__page-btn-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.login__page-btn {
  border-radius: 5px;
  border: none;
  height: 25px;
  width: 70px;
  color: gray;
}

.login__page-err {
  color: red;
}
</style>
