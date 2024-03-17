<script>
import AppMobileSidebar from './sidebars/AppMobileSidebar.vue';
export default {
    inject: ['theme', 'toggleTheme'],
    components: {
        AppMobileSidebar,
    },
}
</script>

<template>
    <header :class="`${theme}-mode`" class="shadow">
        <div class="container-fluid text-center py-3 h-100">
            <div class="row">
                <!-- WEB-APP LOGO (DESKTOP) || OFFCANVAS HAMBURGER BUTTON (MOBILE) -->
                <div class="col-6 justify-content-center align-items-center d-none d-lg-flex">
                    <h1>
                        <router-link class="router-link" :class="`${theme}-router-link`"
                            :to="{ name: 'home-page' }">MY-TOOLS</router-link>
                    </h1>
                </div>
                <div class="col-6 justify-content-start d-flex d-lg-none">
                    <button class="btn mx-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileSidebarOffcanvas" aria-controls="mobileSidebarOffcanvas">
                        <i class="fa-solid fa-bars" :class="theme === 'dark' ? 'text-white' : ''"></i>
                    </button>
                </div>
                <!-- SWITCH GESTIONE TEMA (LIGHT OR DARK) -> DESKTOP || MOBILE -->
                <div class="col-6 justify-content-center align-items-center d-none d-lg-flex">
                    <i class="fa-solid fa-sun mx-2"></i>
                    <div class="form-check form-switch d-flex justify-content-center" @click="toggleTheme">
                        <input class="form-check-input" type="checkbox" role="switch" :checked="theme === 'dark'">
                    </div>
                    <i class="fa-solid fa-moon mx-2"></i>
                </div>
                <div class="col-6 justify-content-end align-items-center d-flex d-lg-none">
                    <i class="fa-solid fa-sun mx-2"></i>
                    <div class="form-check form-switch d-flex justify-content-center" @click="toggleTheme">
                        <input class="form-check-input" type="checkbox" role="switch" :checked="theme === 'dark'">
                    </div>
                    <i class="fa-solid fa-moon mx-2"></i>
                </div>
            </div>
        </div>
        <app-mobile-sidebar />
    </header>
</template>

<style lang="scss" scoped></style>