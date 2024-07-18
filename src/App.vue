<template>
  <div id="app">
    <Header />
    <div class="main-content">
      <Sidebar />
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';

export default defineComponent({
  name: 'App',
  components: {
    Header,
    Sidebar,
  },
});
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-content {
  display: flex;
  flex: 1;
  margin-left: 50px;
  margin-right: 50px;
}

.content {
  display: flex;
  flex: 1;
  overflow-y: auto;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  /*width: calc(100% - 240px);*/
}
</style>
