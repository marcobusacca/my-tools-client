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

            taskNotDoneCounter: 0,

            isTaskIndexActive: false,
            isTaskCategoryIndexActive: false,
        }
    },
    mounted() {
        this.getTasks();
        this.getTasksCategories();
        this.getTasksNotDoneCounter();
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
        getTasksNotDoneCounter(){

            this.store.loading = true;

            axios.get(`${this.store.baseUrl}/api/tasks`).then((response) => {

                let taskNotDone = response.data.filter(task => !task.done);

                this.taskNotDoneCounter = taskNotDone.length;

                this.store.loading = false;

            }).catch((error) => {
                console.error("Errore nella Chiamata API getTasks: ", error);
            });
        },
        toggleTaskIndex(){
            this.isTaskIndexActive = !this.isTaskIndexActive;
            if(!this.isTaskIndexActive)
                this.getTasksNotDoneCounter();
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
    <div class="main-content" v-if="!store.loading && !isTaskIndexActive && !isTaskCategoryIndexActive">
        <div class="container-fluid px-lg-5 animate__animated animate__fadeInDown animate__faster">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12 col-lg-6 px-2 my-3 my-lg-0" @click="toggleTaskIndex()">
                        <div class="d-flex justify-content-center align-items-center shadow cursor-pointer py-5">
                            <i class="fa-solid fa-circle-check fa-xl mx-2"></i>
                            <h2 class="fs-2 mx-2">Tasks</h2>
                        </div>
                    </div>
                    <div class="col-12 col-lg-6 px-2 my-3 my-lg-0" @click="toggleTaskCategoryIndex()">
                        <div class="d-flex justify-content-center align-items-center shadow cursor-pointer py-5">
                            <i class="fa-solid fa-clipboard-list fa-xl mx-2"></i>
                            <h2 class="fs-2 mx-2">Categorie</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container-fluid rounded-4 shadow my-5">
                <div class="row py-5">
                    <div class="col-12 d-flex align-items-center px-4">
                        <span v-if="!taskNotDoneCounter">Nessuna task da completare</span>
                        <span v-else>Task da completare: {{ taskNotDoneCounter }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- TASK-INDEX -->
    <task-index v-if="!store.loading && isTaskIndexActive"
    :tasksNotDone="tasksNotDone"
    :tasksDone="tasksDone"
    :tasksCategories="tasksCategories"
    :getTasks="getTasks"
    @close-page="toggleTaskIndex()" />
    <!-- TASK-CATEGORY-INDEX -->
    <task-category-index v-if="!store.loading && isTaskCategoryIndexActive"
    :tasksCategories="tasksCategories"
    :getTasks="getTasks"
    :getTasksCategories="getTasksCategories"
    @close-page="toggleTaskCategoryIndex()" />
</template>

<style lang="scss" scoped></style>