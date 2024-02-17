<script>
import { store } from '../store';
import axios from 'axios';

export default {
    data() {
        return {
            store,
            tasksNotDone: [],
            tasksDone: [],
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

            // SVUOTO GLI ARRAY DELLE TASKS
            this.tasksNotDone = [];
            this.tasksDone = [];

            // EFFETTUO LA CHIAMATA GET PER OTTENERE LA LISTA DI TASKS
            axios.get(`${this.store.baseUrl}/api/tasks`).then((response) => {

                // INSERISCO LE TASKS NEI RISPETTIVI ARRAY
                response.data.forEach(task => {
                    if (task.done) {
                        this.tasksDone.push(task);
                    } else {
                        this.tasksNotDone.push(task);
                    }
                });

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
        setTaskDone(id) {
            // FACCIO PARTIRE IL LOADING
            this.store.loading = true;

            // EFFETTUO LA CHIAMATA PUT PER AGGIORNARE LO STATO "DONE" DELLO TASK
            axios.put(`${this.store.baseUrl}/api/tasks/done/${id}`).then((response) => {

                // AGGIORNO LE TASKS
                this.getTasks();

            }).catch((error) => {
                // STAMPO IN CONSOLE L'ERRORE
                console.error("Errore nella Chiamata API setTaskDone: ", error);
            });
        },
        taskEdit(task) {
            console.log(task.id);
        }
    },
}
</script>

<template>
    <div class="container-fluid" v-if="!this.store.loading">
        <div class="container bg-white border rounded-5 shadow my-5">
            <div class="row py-5">
                <div class="col-12">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Done</th>
                                <th scope="col">Titolo</th>
                                <th scope="col">Data</th>
                                <th scope="col">Ora</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr role="button" v-for="task in tasksNotDone" :key="task.id" @click="taskEdit(task)">
                                <td>
                                    <input type="checkbox" role="button" class="form-check-input" :name="task.title"
                                        :id="task.id" :checked="task.done" @click="setTaskDone(task.id)">
                                </td>
                                <td v-text="task.title"></td>
                                <td v-text="`${task.date ? task.date : 'null'}`"></td>
                                <td v-text="`${task.time ? task.time : 'null'}`"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="container bg-white border rounded-5 shadow my-5">
            <div class="row py-5">
                <div class="col-12">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Done</th>
                                <th scope="col">Titolo</th>
                                <th scope="col">Data</th>
                                <th scope="col">Ora</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr role="button" v-for="task in tasksDone" :key="task.id" @click="taskEdit(task)">
                                <td>
                                    <input type="checkbox" role="button" class="form-check-input" :name="task.title"
                                        :id="task.id" :checked="task.done" @click="setTaskDone(task.id)">
                                </td>
                                <td v-text="task.title"></td>
                                <td v-text="`${task.date ? task.date : 'null'}`"></td>
                                <td v-text="`${task.time ? task.time : 'null'}`"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="container bg-white border rounded-5 shadow my-5">
            <div class="row py-5">
                <div class="col-12">
                    <ol>
                        <li v-for="taskCategory in tasksCategories">{{ taskCategory.title }}</li>
                    </ol>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>