import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import './style.css'
import App from './App.vue';
import Home from './views/Home.vue';
import VueKonva from 'vue-konva';

const routes = [
  { path: '/', component: Home },
  { path: '/wiki', component: () => import('./views/Wiki.vue') }, // Create Wiki.vue
  { path: '/timeline', component: () => import('./views/Timeline.vue') }, // Create Timeline.vue
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);

app.use(router);
app.use(VueKonva)

app.mount('#app');

export { router }; // Export the router instance for use in components
