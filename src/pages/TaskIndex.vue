<script>
import { store } from '../store';
import axios from 'axios';

export default {
    data() {
        return {
            store,
            tasks: [],
            tasksCategories: [],
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

            // EFFETTUO LA CHIAMATA GET PER OTTENERE LA LISTA DI TASKS
            axios.get(`${this.store.baseUrl}/api/tasks`).then((response) => {

                // SALVO IL RISULTATO IN TASKS
                this.tasks = response.data;

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
        setTaskDone(task) {
            task.done = !task.done;
        }
    },
}
</script>

<template>
    <div class="container bg-white border rounded-5 shadow my-5" v-if="!this.store.loading">
        <div class="row py-5">
            <div class="col-12">
                <ol>
                    <li v-for="task in tasks" @click="setTaskDone(task)">{{ `${task.title} | ${task.done ? "SI" : "NO"}`
                    }}</li>
                </ol>
            </div>
            <div class="col-12">
                <ol>
                    <li v-for="taskCategory in tasksCategories">{{ taskCategory.title }}</li>
                </ol>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>