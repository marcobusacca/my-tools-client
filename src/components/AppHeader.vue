<script>
export default {

}
</script>

<template>
    <header>
        <div class="container-fluid bg-black text-white text-center py-3">
            <div class="row">
                <div class="col-6">
                    <h1>MY-TOOLS</h1>
                </div>
                <div class="col-6">
                    <!-- <router-link :to="{ name: 'tasks', params: { slug: task.slug } }"></router-link> -->
                    <router-link :to="{ name: 'tasks' }">TASKS</router-link>
                </div>
            </div>
        </div>
    </header>
</template>

<style lang="scss" scoped></style>