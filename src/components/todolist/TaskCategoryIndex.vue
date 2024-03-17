<script>
import { store } from '../../store';
import axios from 'axios';

export default {
    inject: ['theme'],
    props: {
        tasksCategories: Array,
        getTasksCategories: Function,
    },
    data() {
        return {
            store,
        }
    },
    methods: {

    },
}
</script>

<template>
    <div class="main-content" v-if="!this.store.loading">
        <div class="container-fluid px-5">
            <!-- CONTAINER OF RETURN BUTTON -->
            <div class="container-fluid my-5">
                <div class="row">
                    <div class="col-12">
                        <i class="icon fa-solid fa-circle-arrow-left fa-xl" :class="`${theme}-icon`" @click="$emit('close-page')"></i>
                    </div>
                </div>
            </div>
            <!-- CONTAINER TASK CATEGORIES -->
            <div class="container-fluid border rounded-4 shadow my-5">
                <div class="row py-5">
                    <!-- HEADER -->
                    <div class="col-12">
                        <div class="row">
                            <!-- TITLE -->
                            <div class="col-6 px-5">
                                <h3>Categorie</h3>
                            </div>
                            <!-- CREATE TASK CATEGORY BUTTON -->
                            <div class="col-6 text-end px-5">
                                <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#taskFormModal"
                                    @click="">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <!-- TABLE TASK CATEGORIES -->
                    <div class="col-12 mt-5">
                        <table class="table table-hover text-center">
                            <!-- TABLE HEADER -->
                            <thead>
                                <tr>
                                    <th scope="col">Titolo</th>
                                    <th scope="col">Strumenti</th>
                                </tr>
                            </thead>
                            <!-- TABLE BODY -->
                            <tbody>
                                <!-- TASK CATEGORIES ROWS -->
                                <tr role="button" v-for="taskCategory in tasksCategories" :key="taskCategory.id">
                                    <!-- TASK CATEGORIES TITLE -->
                                    <td v-text="taskCategory.title"></td>
                                    <!-- TASK CATEGORIES TOOLS -->
                                    <td>
                                        <!-- BUTTON EDIT -->
                                        <!-- data-bs-toggle="modal"
                                            data-bs-target="#confirmDeleteTaskModal" -->
                                        <button class="btn btn-warning mx-1" @click="">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <!-- BUTTON DELETE -->
                                        <!-- data-bs-toggle="modal"
                                            data-bs-target="#confirmDeleteTaskModal" -->
                                        <button class="btn btn-danger mx-1" @click="">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                                <!-- TASK EMPTY MESSAGE -->
                                <tr v-if="!tasksCategories.length">
                                    <td colspan="5" class="text-center py-4">Nessuna categoria</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>