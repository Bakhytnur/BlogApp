<template>
  <div class="register__page">
    <h1 class="register__page-title">Register</h1>
    <form class="register__page-form" @submit.prevent="register">
      <input v-model="username" label="Username" placeholder="Username" />
      <input
        v-model="password"
        label="Password"
        type="password"
        placeholder="Password"
      />
      <input v-model="fio" placeholder="Full Name" />
      <input v-model="city" placeholder="City" />
      <input v-model="address" placeholder="Address" />
      <input v-model="dateOfBirth" placeholder="Date of Birth" />
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'RegisterView',
  setup() {
    const store = useStore();
    const router = useRouter();
    const username = ref<string>('');
    const password = ref<string>('');
    const fio = ref<string>('');
    const city = ref<string>('');
    const address = ref<string>('');
    const dateOfBirth = ref<string>('');

    const register = async () => {
      await store.dispatch('register', {
        username: username.value,
        password: password.value,
        fio: fio.value,
        city: city.value,
        address: address.value,
        date_of_birth: dateOfBirth.value,
      });
      router.push('/login');
    };

    return { username, password, fio, city, address, dateOfBirth, register };
  },
});
</script>

<style scoped>
.register__page {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 20px;
}

.register__page-title {
  color: white;
  padding-bottom: 20px;
  font-size: 1.2em;
}

.register__page-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  gap: 10px;
}

.register__page-form button {
  border-radius: 5px;
  border: none;
  height: 25px;
  width: 70px;
  color: gray;
}
</style>
