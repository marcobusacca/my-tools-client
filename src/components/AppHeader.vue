<script>
export default {
    inject: ['theme', 'toggleTheme'],
}
</script>

<template>
    <header :class="theme + '-mode'" class="shadow">
        <div class="container-fluid text-center py-3">
            <div class="row">
                <!-- WEB-APP LOGO -->
                <div class="col-6 d-flex justify-content-center align-items-center">
                    <h1>
                        <router-link class="router-link text-decoration-none"
                            :to="{ name: 'home-page' }">MY-TOOLS</router-link>
                    </h1>
                </div>
                <!-- SWITCH GESTIONE TEMA (LIGHT OR DARK) -->
                <div class="col-6 d-flex justify-content-center align-items-center">
                    <i class="fa-solid fa-sun mx-2"></i>
                    <div class="form-check form-switch d-flex justify-content-center" @click="toggleTheme">
                        <input class="form-check-input" type="checkbox" role="switch" :checked="theme === 'dark'">
                    </div>
                    <i class="fa-solid fa-moon mx-2"></i>
                </div>
            </div>
        </div>
    </header>
</template>

<style lang="scss" scoped></style>