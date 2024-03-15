<script>
import { store } from '../store';

export default {
    data() {
        return {
            store,
        }
    },
}
</script>

<template>
    <div class="container border rounded-5 shadow my-5" v-if="!this.store.loading">
        <div class="row justify-content-center py-5">
            <div class="col-12 d-flex align-items-center">
                <!-- <router-link :to="{ name: 'tasks', params: { slug: task.slug } }"></router-link> -->
                <router-link class="btn btn-primary" :to="{ name: 'tasks' }">Tasks</router-link>
                <span class="ms-3">Gestisci le tue Task Quotidiane attraverso la To-Do List</span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>