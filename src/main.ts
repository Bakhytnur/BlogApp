import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/styles.css';
import FontAwesomeIcon from './plugins/fontawesome';

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);

//app.use(store).use(router).mount('#app');
store
  .dispatch('fetchUserProfile')
  .then(() => {
    app.use(router);
    app.use(store);
    app.mount('#app');
  })
  .catch(() => {
    app.use(router);
    app.use(store);
    app.mount('#app');
  });
