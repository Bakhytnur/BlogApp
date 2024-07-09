<template>
  <div class="profile__view">
    <h1 class="profile__view-header">Profile</h1>
    <div class="profile__view-info" v-if="user">
      <div v-if="!editing">
        <p class="profile__view-username">
          <strong>Username:</strong> {{ user.username }}
        </p>
        <p class="profile__view-fullname">
          <strong>Full Name:</strong> {{ user.fio }}
        </p>
        <p class="profile__view-city"><strong>City:</strong> {{ user.city }}</p>
        <p class="profile__view-address">
          <strong>Address:</strong> {{ user.address }}
        </p>
        <p class="profile__view-dateofbirth">
          <strong>Date of Birth:</strong> {{ newDate }}
        </p>
        <button @click="editProfile" class="profile__view-edit-button">
          Edit
        </button>
      </div>
      <div v-else>
        <form @submit.prevent="saveProfile">
          <label for="username">Username:</label>
          <input id="username" v-model="editedUser.username" required />
          <label for="fullname">Full Name:</label>
          <input id="fullname" v-model="editedUser.fio" required />
          <label for="city">City:</label>
          <input id="city" v-model="editedUser.city" />
          <label for="address">Address:</label>
          <input id="address" v-model="editedUser.address" />
          <label for="dateofbirth">Date of Birth:</label>
          <input
            id="dateofbirth"
            type="date"
            v-model="editedUser.date_of_birth"
          />
          <button type="submit">Save</button>
          <button type="button" @click="cancelEdit">Cancel</button>
        </form>
      </div>
    </div>
    <div v-else>
      <p class="profile__view-info">Loading...</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { User } from '@/store';

export default defineComponent({
  name: 'ProfileView',
  setup() {
    const store = useStore();
    const user = computed(() => store.state.user);

    const editing = ref(false);
    const editedUser = ref<User>({
      id: '',
      username: '',
      fio: '',
      city: '',
      address: '',
      date_of_birth: '',
    });

    const formatDateForInput = (date: string) => {
      const [day, month, year] = date.split('.');
      return `${year}-${month}-${day}`;
    };

    //const newDate = formatDateForInput(user.value.date_of_birth);
    //const newDate = user.value?.date_of_birth
    //? user.value?.date_of_birth.split('T')[0]
    //: '';

    const newDate = computed(() => {
      return user.value?.date_of_birth
        ? user.value.date_of_birth.split('T')[0]
        : '';
    });
    console.log(newDate);

    const editProfile = () => {
      editing.value = true;
      editedUser.value = { ...user.value };
      //editedUser.value.date_of_birth = formatDateForInput(
      //user.value.date_of_birth,
      //);
      editedUser.value.date_of_birth = String(newDate);
    };

    const saveProfile = () => {
      store.dispatch('updateUserProfile', editedUser.value);
      editing.value = false;
    };

    const cancelEdit = () => {
      editing.value = false;
    };

    onMounted(() => {
      store.dispatch('fetchUserProfile');
    });

    return {
      user,
      editing,
      editedUser,
      newDate,
      editProfile,
      saveProfile,
      cancelEdit,
    };
  },
});
</script>

<style scoped>
.profile__view {
  text-align: center;
  color: white;
  padding-top: 20px;
}

.profile__view-header {
  font-size: 1.2em;
  margin-bottom: 1rem;
}

.profile__view-info {
  margin-top: 1rem;
  line-height: 1.6;
  font-size: 1em;
  padding-left: 30px;
  padding-right: 30px;
}

.profile__view-username,
.profile__view-fullname,
.profile__view-city,
.profile__view-address,
.profile__view-dateofbirth {
  margin: 0.5rem 0;
  display: flex;
  justify-content: space-between;
}

.profile__view-edit-button {
  margin-top: 1rem;
  border-radius: 5px;
  border: none;
  height: 25px;
  width: 70px;
  color: gray;
}
</style>
