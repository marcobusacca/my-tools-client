<script>
import { store } from './store';

import AppHeader from './components/AppHeader.vue';
import AppLoader from './components/AppLoader.vue';
import AppDesktopSidebar from './components/sidebars/AppDesktopSidebar.vue';

export default {
  inject: ['theme'],

  components: {
    AppHeader,
    AppLoader,
    AppDesktopSidebar,
  },
  data() {
    return {
      store,
    }
  },
  mounted() {
    this.setThemeMode();
  },
  methods: {
    setThemeMode(){
      document.body.classList.add(this.theme === 'light' ? 'light-mode' : 'dark-mode');
    },
  },
}
</script>

<template>
  <!-- COMPONENT: APP-HEADER -->
  <app-header />
  <main>
    <!-- COMPONENT: APP-LOADER -->
    <app-loader v-if="this.store.loading" />
    <!-- COMPONENT: APP-DESKTOP-SIDEBAR -->
    <app-desktop-sidebar />
    <!-- ROUTER-VIEW -->
    <router-view></router-view>
  </main>
</template>

<style lang="scss">
// IMPORTO GENERALS.SCSS
@use './styles/generals.scss' as *;
// IMPORTO VARIABLES.SCSS
@use './styles/partials/variables' as *;
</style>
