<script>
export default {
    inject: ['theme'],
}
</script>

<template>
    <div class="main-sidebar desktop-main-sidebar shadow d-none d-lg-block py-5">
        <div class="container-fluid h-100">
            <div class="row" :class="`${theme}-sidebar-router-row`">
                <router-link class="col-12 router-link sidebar-router-link py-4"
                    :class="[`${theme}-sidebar-router-link`, { 'active-router-link': $route.name === 'home-page' }]"
                    :to="{ name: 'home-page' }">
                    <div class="row">
                        <div class="col-4 d-flex justify-content-end align-items-center">
                            <i class="fa-solid fa-house"></i>
                        </div>
                        <div class="col-8">
                            <span>Home Page</span>
                        </div>
                    </div>
                </router-link>
                <router-link class="col-12 router-link sidebar-router-link py-4"
                    :class="[`${theme}-sidebar-router-link`, { 'active-router-link': $route.name === 'todo-list' }]"
                    :to="{ name: 'todo-list' }">
                    <div class="row">
                        <div class="col-4 d-flex justify-content-end align-items-center">
                            <i class="fa-solid fa-list"></i>
                        </div>
                        <div class="col-8">
                            <span>Todo List</span>
                        </div>
                    </div>
                </router-link>
                <router-link class="col-12 router-link sidebar-router-link py-4"
                    :class="[`${theme}-sidebar-router-link`, { 'active-router-link': $route.name === 'tracker' }]"
                    :to="{ name: 'tracker' }">
                    <div class="row">
                        <div class="col-4 d-flex justify-content-end align-items-center">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="col-8">
                            <span>Tracker</span>
                        </div>
                    </div>
                </router-link>
            </div>
            <!-- <router-link :to="{ name: 'tasks', params: { slug: task.slug } }"></router-link> -->
        </div>
    </div>
</template>

<style lang="scss" scoped></style>