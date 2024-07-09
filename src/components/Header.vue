<template>
  <div>
    <nav class="navbar">
      <div class="navbar-header">Blog App</div>
      <div class="navbar-controls-main">
        <div v-if="loginVerify" class="navbar-controls">
          <input
            type="text"
            v-model="searchQuery"
            @input="updateSearchQuery"
            placeholder="Search posts..."
          />
          <select v-model="sortKey" @change="updateSortKey">
            <option value="title">Title</option>
            <option value="body">Body</option>
          </select>
          <select v-model="sortOrder" @change="updateSortOrder">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <div v-if="loginVerify" class="navbar-controls">
          <button @click="logout">Logout</button>
        </div>
        <div v-else class="navbar-controls">
          <button>
            <router-link class="navbar-controls-link" to="/login"
              >Login</router-link
            >
          </button>
          <button>
            <router-link class="navbar-controls-link" to="/register"
              >Register</router-link
            >
          </button>
        </div>
      </div>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'HeaderView',
  setup() {
    const store = useStore();
    const searchQuery = ref(store.state.searchQuery);
    const sortKey = ref(store.state.sortKey);
    const sortOrder = ref(store.state.sortOrder);

    const router = useRouter();

    const loginVerify = computed(() => store.getters.isAuthenticated);

    const updateSearchQuery = () => {
      store.dispatch('setSearchQuery', searchQuery.value);
    };

    const updateSortKey = () => {
      store.dispatch('setSortKey', sortKey.value);
    };

    const updateSortOrder = () => {
      store.dispatch('setSortOrder', sortOrder.value);
    };

    const logout = () => {
      store.dispatch('logout');
      router.push('/login');
    };

    return {
      loginVerify,
      searchQuery,
      sortKey,
      sortOrder,
      updateSearchQuery,
      updateSortKey,
      updateSortOrder,
      logout,
    };
  },
});
</script>

<style scoped>
.navbar {
  width: 100%;
  background-color: rgb(149, 174, 211);
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;
}

.navbar-header {
  font-size: 25px;
  color: white;
}

.navbar-controls-main {
  display: flex;
  gap: 20px;
}

.navbar-links {
  display: flex;
  gap: 15px;
}

.navbar-links_link {
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: white;
  height: 25px;
  padding: 5px;
}

.navbar-links_link:hover {
  background-color: rgb(89, 89, 193);
  border-radius: 5px;
}

.navbar-controls {
  display: flex;
  gap: 5px;
}

.navbar-controls input {
  width: 200px;
  border-radius: 5px;
  border: none;
  padding: 3px;
  color: gray;
}

.navbar-controls_input {
  display: flex;
  align-items: center;
}

.navbar-controls select {
  border-radius: 5px;
  border: none;
  color: gray;
}

.navbar-controls button {
  border-radius: 5px;
  border: none;
  height: 25px;
  width: 70px;
  color: gray;
  margin-right: 5px;
}

.navbar-controls-link {
  text-decoration: none;
  color: gray;
}
</style>
