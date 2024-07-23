<template>
  <div class="register__page">
    <h1 class="register__page-title">Register</h1>
    <form class="register__page-form" @submit.prevent="validateAndRegister">
      <div class="form-group">
        <input
          v-model="username"
          @blur="validateUsername"
          placeholder="Username"
        />
        <!--span v-if="errors.username" class="error-message">{{
          errors.username
        }}</!--span-->
      </div>
      <div class="form-group">
        <input
          v-model="password"
          @blur="validatePassword"
          type="password"
          placeholder="Password"
        />
        <!--span v-if="errors.password" class="error-message">{{
          errors.password
        }}</!--span-->
      </div>
      <div class="form-group">
        <input v-model="fio" @blur="validateFio" placeholder="Full Name" />
        <!--span v-if="errors.fio" class="error-message">{{ errors.fio }}</!--span-->
      </div>
      <div class="form-group">
        <input v-model="city" @blur="validateCity" placeholder="City" />
        <!--span v-if="errors.city" class="error-message">{{ errors.city }}</!--span-->
      </div>
      <div class="form-group">
        <input
          v-model="address"
          @blur="validateAddress"
          placeholder="Address"
        />
        <!--span v-if="errors.address" class="error-message">{{
          errors.address
        }}</!--span-->
      </div>
      <div class="form-group">
        <input
          v-model="dateOfBirth"
          @blur="validateDateOfBirth"
          placeholder="Date of Birth"
        />
        <!--span v-if="errors.dateOfBirth" class="error-message">{{
          errors.dateOfBirth
        }}</!--span-->
      </div>
      <button type="submit">Register</button>
      <div class="error-container">
        <span v-if="errors.username" class="error-message">{{
          errors.username
        }}</span>
        <span v-if="errors.password" class="error-message">{{
          errors.password
        }}</span>
        <span v-if="errors.fio" class="error-message">{{ errors.fio }}</span>
        <span v-if="errors.city" class="error-message">{{ errors.city }}</span>
        <span v-if="errors.address" class="error-message">{{
          errors.address
        }}</span>
        <span v-if="errors.dateOfBirth" class="error-message">{{
          errors.dateOfBirth
        }}</span>
      </div>
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
    const errors = ref<{ [key: string]: string }>({});

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

    const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;
    const fioPattern = /^[a-zA-Z\s]{3,100}$/;
    const addressPattern = /^[a-zA-Z0-9\s,.-]{5,200}$/;
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;

    const validateUsername = () => {
      if (!username.value) {
        errors.value.username = 'Username is required';
      } else if (!usernamePattern.test(username.value)) {
        errors.value.username =
          'Username must be 3-20 characters long and can contain letters, numbers, and underscores';
      } else {
        errors.value.username = '';
      }
    };

    const validatePassword = () => {
      if (!password.value) {
        errors.value.password = 'Password is required';
      } else if (!passwordPattern.test(password.value)) {
        errors.value.password =
          'Password must be 8-20 characters long, contain at least one uppercase letter, one number, and one special character';
      } else {
        errors.value.password = '';
      }
    };

    const validateFio = () => {
      if (!fio.value) {
        errors.value.fio = 'Full Name is required';
      } else if (!fioPattern.test(fio.value)) {
        errors.value.fio = 'Full Name can only contain letters and spaces';
      } else {
        errors.value.fio = '';
      }
    };

    const validateCity = () => {
      if (!city.value) {
        errors.value.city = 'City is required';
      } else {
        errors.value.city = '';
      }
    };

    const validateAddress = () => {
      if (!address.value) {
        errors.value.address = 'Address is required';
      } else if (!addressPattern.test(address.value)) {
        errors.value.address =
          'Address must be 5-200 characters long and can contain letters, numbers, spaces, and some punctuation';
      } else {
        errors.value.address = '';
      }
    };

    const validateDateOfBirth = () => {
      if (!dateOfBirth.value) {
        errors.value.dateOfBirth = 'Date of Birth is required';
      } else {
        errors.value.dateOfBirth = '';
      }
    };

    const validateAll = () => {
      validateUsername();
      validatePassword();
      validateFio();
      validateCity();
      validateAddress();
      validateDateOfBirth();
    };

    const validateAndRegister = async () => {
      validateAll();

      if (Object.values(errors.value).every((error) => error === '')) {
        await store.dispatch('register', {
          username: username.value,
          password: password.value,
          fio: fio.value,
          city: city.value,
          address: address.value,
          date_of_birth: dateOfBirth.value,
        });
        router.push('/login');
      }
    };

    return {
      username,
      password,
      fio,
      city,
      address,
      dateOfBirth,
      errors,
      validateUsername,
      validatePassword,
      validateFio,
      validateCity,
      validateAddress,
      validateDateOfBirth,
      validateAndRegister,
    };
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
  gap: 20px;
  width: 300px;
  max-width: 600px;
}

.register__page-form button {
  border-radius: 5px;
  border: none;
  height: 25px;
  width: 70px;
  color: gray;
}

.form-group {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.form-group input {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}

.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 300px;
  margin-top: 10px;
}

.error-message {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  color: white;
  font-size: 0.8em;
  padding-left: 5px;
  border-bottom: 2px solid red;
}
</style>
