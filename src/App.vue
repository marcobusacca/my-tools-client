<script>
import AppHeader from './components/AppHeader.vue';
export default {
  components: {
    AppHeader,
  },
}
</script>

<template>
  <!-- COMPONENT: APP-HEADER -->
  <app-header />
  <main>
    <router-view></router-view>
  </main>
</template>

<style lang="scss">
// IMPORTO GENERALS.SCSS
@use './styles/generals.scss' as *;
</style>
