<script>
export default {
    inject: ['theme'],
}
</script>

<template>
    <div class="offcanvas offcanvas-start main-sidebar mobile-sidebar" :class="`${theme}-mobile-sidebar`" tabindex="-1" id="mobileSidebarOffcanvas" aria-labelledby="mobileSidebarOffcanvasLabel">
        <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="mobileSidebarOffcanvasLabel">Menù</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <div class="container-fluid h-100">
                <div class="row" :class="`${theme}-sidebar-router-row`" data-bs-dismiss="offcanvas">
                    <router-link class="col-12 router-link sidebar-router-link py-4" :class="[`${theme}-sidebar-router-link`, { 'active-router-link': $route.name === 'home-page' }]" :to="{ name: 'home-page' }">
                        <div class="row">
                            <div class="col-4 d-flex justify-content-center align-items-center">
                                <i class="fa-solid fa-house fa-lg"></i>
                            </div>
                            <div class="col-8">
                                <span>Home Page</span>
                            </div>
                        </div>
                    </router-link>
                    <router-link class="col-12 router-link sidebar-router-link py-4" :class="[`${theme}-sidebar-router-link`, { 'active-router-link': $route.name === 'todo-list' }]" :to="{ name: 'todo-list' }">
                        <div class="row">
                            <div class="col-4 d-flex justify-content-center align-items-center">
                                <i class="fa-solid fa-list fa-lg"></i>
                            </div>
                            <div class="col-8">
                                <span>Todo List</span>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>
            <!-- <div class="dropdown mt-3">
                <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    Dropdown button
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Action</a></li>
                    <li><a class="dropdown-item" href="#">Another action</a></li>
                    <li><a class="dropdown-item" href="#">Something else here</a></li>
                </ul>
            </div> -->
        </div>
    </div>
</template>

<style lang="scss" scoped></style>