<template>
  <nav class="sidebar">
    <div class="sidebar-links">
      <router-link class="sidebar-links_link" to="/">
        <div class="sidebar-links_icon">
          <font-awesome-icon :icon="['fas', 'home']" />
        </div>
        <span>Home</span>
      </router-link>
      <router-link class="sidebar-links_link" to="/posts">
        <div class="sidebar-links_icon">
          <font-awesome-icon :icon="['fas', 'file-alt']" />
        </div>
        <span>Posts</span>
      </router-link>
      <router-link class="sidebar-links_link" to="/pictureposts">
        <div class="sidebar-links_icon">
          <font-awesome-icon :icon="['fas', 'star']" />
        </div>
        <span>Picture Posts</span>
      </router-link>
      <router-link class="sidebar-links_link" to="/favourites">
        <div class="sidebar-links_icon">
          <font-awesome-icon :icon="['fas', 'star']" />
        </div>
        <span>Favourite Posts</span>
      </router-link>
      <router-link class="sidebar-links_link" to="/profile">
        <div class="sidebar-links_icon">
          <font-awesome-icon :icon="['fas', 'user']" />
        </div>
        <span>Profile</span>
      </router-link>
      <router-link class="sidebar-links_link" to="/posts/new">
        <div class="sidebar-links_icon">
          <font-awesome-icon :icon="['fas', 'plus-circle']" />
        </div>
        <span>Add Post</span>
      </router-link>
      <!--router-link class="sidebar-links_link" to="/picturepost/new">
        <div class="sidebar-links_icon">
          <font-awesome-icon :icon="['fas', 'plus-circle']" />
        </div>
        <span>Add Picture Post</span>
      </router-link-->
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'SidebarView',
  setup() {
    const store = useStore();

    return {
      store,
    };
  },
});
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 100%;
  background-color: rgb(109, 160, 205);
  border-right: 1px gray solid;
  box-sizing: border-box;
  padding: 20px;
  flex-shrink: 0;
}

.sidebar-links {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-top: 20px;
}

.sidebar-links_link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  padding: 5px;
}

.sidebar-links_link span {
  margin-left: 10px;
}

.sidebar-links_link .fa-icon {
  font-size: 20px; /* Adjust the size as needed */
}

.sidebar-links_icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
}
</style>
