<script>
import { store } from '../store';
import axios from 'axios';

import TaskIndex from '../components/todolist/TaskIndex.vue';
import TaskCategoryIndex from '../components/todolist/TaskCategoryIndex.vue';

export default {
    inject: ['theme'],
    components:{
        TaskIndex,
        TaskCategoryIndex,
    },
    data() {
        return {
            store,

            tasksNotDone: [],
            tasksDone: [],

            tasksCategories: [],

            isTaskIndexActive: false,
            isTaskCategoryIndexActive: false,
        }
    },
    mounted() {
        this.getTasks();
        this.getTasksCategories();
    },
    methods: {
        getTasks() {
            // FACCIO PARTIRE IL LOADING
            this.store.loading = true;

            // SVUOTO GLI ARRAY DELLE TASKS
            this.tasksNotDone = [];
            this.tasksDone = [];

            // EFFETTUO LA CHIAMATA GET PER OTTENERE LA LISTA DI TASKS
            axios.get(`${this.store.baseUrl}/api/tasks`).then((response) => {

                // DICHIARO GLI ARRAY PER SUDDIVIDERE LE TASK
                let rawTasksNotDone = [];
                let rawTasksDone = [];

                // INSERISCO LE TASKS NEI RISPETTIVI ARRAY
                response.data.forEach(task => {
                    if (!task.done) {
                        rawTasksNotDone.push(task);
                    } else {
                        rawTasksDone.push(task);
                    }
                });

                // MAPPO L'ARRAY DELLE "TASKS_NOT_DONE"
                this.tasksNotDone = rawTasksNotDone.map(task => ({
                    // IN QUESTO MODO MANTENGO TUTTE LE PROPRIETA GIA ESISTENTI
                    ...task,
                    // AGGIUNGO LA PROPRIETA "FORMATTED_DATE"
                    formattedDate: this.formatItalianDate(task.date),
                    // AGGIUNGO LA PROPRIETA "FORMATTED_TIME"
                    formattedTime: this.formatItalianTime(task.time),
                }));

                // MAPPO L'ARRAY DELLE "TASKS_DONE"
                this.tasksDone = rawTasksDone.map(task => ({
                    // IN QUESTO MODO MANTENGO TUTTE LE PROPRIETA GIA ESISTENTI
                    ...task,
                    // AGGIUNGO LA PROPRIETA "FORMATTED_DATE"
                    formattedDate: this.formatItalianDate(task.date),
                    // AGGIUNGO LA PROPRIETA "FORMATTED_TIME"
                    formattedTime: this.formatItalianTime(task.time),
                }));

                // FERMO IL LOADING
                this.store.loading = false;

            }).catch((error) => {
                // STAMPO IN CONSOLE L'ERRORE
                console.error("Errore nella Chiamata API getTasks: ", error);
            });
        },
        getTasksCategories() {
            // FACCIO PARTIRE IL LOADING
            this.store.loading = true;

            // EFFETTUO LA CHIAMATA GET PER OTTENERE LA LISTA DELLE TASKS_CATEGORIES
            axios.get(`${this.store.baseUrl}/api/tasks/categories`).then((response) => {

                // SALVO IL RISULTATO IN TASKS_CATEGORIES
                this.tasksCategories = response.data;

                // FERMO IL LOADING
                this.store.loading = false;

            }).catch((error) => {
                // STAMPO IN CONSOLE L'ERRORE
                console.error("Errore nella Chiamata API getTasksCategories: ", error);
            });
        },
        toggleTaskIndex(){
            this.isTaskIndexActive = !this.isTaskIndexActive;
        },
        toggleTaskCategoryIndex(){
            this.isTaskCategoryIndexActive = !this.isTaskCategoryIndexActive;
        },
        formatItalianDate(originalDate) {
            const options = { day: "numeric", month: "numeric", year: "numeric" };
            const date = new Date(originalDate);
            return date.toLocaleDateString("it-IT", options);
        },
        formatItalianTime(originalTime) {
            const options = { hour: "numeric", minute: "numeric" };
            const time = new Date(`1970-01-01T${originalTime}`);
            return time.toLocaleTimeString("it-IT", options);
        },
    },
}
</script>

<template>
    <div class="main-content" v-if="!this.store.loading && !isTaskIndexActive && !isTaskCategoryIndexActive">
        <div class="container-fluid px-5 h-100">
            <div class="container-fluid h-100">
                <div class="row h-100">
                    <div class="col-12 d-flex justify-content-center align-items-center border-bottom">
                        <div class="cursor-pointer d-flex justify-content-center align-items-center" @click="toggleTaskIndex()">
                            <i class="fa-solid fa-circle-check fa-2xl mx-3"></i>
                            <h2 class="d-inline-block fs-1 mx-3">Tasks</h2>
                        </div>
                    </div>
                    <div class="col-12 d-flex justify-content-center align-items-center">
                        <div class="cursor-pointer d-flex justify-content-center align-items-center" @click="toggleTaskCategoryIndex()">
                            <i class="fa-solid fa-clipboard-list fa-2xl mx-3"></i>
                            <h2 class="d-inline-block fs-1 mx-3">Categorie</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <task-index v-if="!this.store.loading && isTaskIndexActive && !isTaskCategoryIndexActive" :tasksNotDone="tasksNotDone" :tasksDone="tasksDone" :tasksCategories="tasksCategories" :getTasks="getTasks" @close-page="toggleTaskIndex()" />
    <task-category-index v-if="!this.store.loading && !isTaskIndexActive && isTaskCategoryIndexActive" :tasksCategories="tasksCategories" :getTasksCategories="getTasksCategories" @close-page="toggleTaskCategoryIndex()" />
</template>

<style lang="scss" scoped></style>