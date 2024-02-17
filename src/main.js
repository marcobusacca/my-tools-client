import { createApp } from 'vue';
import App from './App.vue';
import { theme, toggleTheme } from './theme';
import { router } from './router';

createApp(App).provide('theme', theme).provide('toggleTheme', toggleTheme).use(router).mount('#app');
