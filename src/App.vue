<script>
import { store } from './store';

import AppHeader from './components/AppHeader.vue';
import AppLoader from './components/AppLoader.vue';

export default {
  inject: ['theme'],

  components: {
    AppHeader,
    AppLoader,
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
    <router-view></router-view>
  </main>
</template>

<style lang="scss">
// IMPORTO GENERALS.SCSS
@use './styles/generals.scss' as *;
// IMPORTO VARIABLES.SCSS
@use './styles/partials/variables' as *;
</style>
