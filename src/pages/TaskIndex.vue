<script>
import { store } from '../store';
import axios from 'axios';

export default {
    inject: ['theme'],
    data() {
        return {
            store,

            tasksNotDone: [],
            tasksDone: [],

            newTasksNotDone: [],
            newTasksDone: [],

            tasksCategories: [],

            taskActive: {},
            taskActiveTitle: null,

            newTask: {
                title: "",
                date: "",
                time: "",
                done: false,
                taskCategory: {},
            },

            formErrors: {},
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

                this.createNewTasksNotDone();
                this.createNewTasksDone();

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

                // STAMPO IN CONSOLE IL RISULTATO
                console.log(response);

                // AGGIORNO LE TASKS
                this.getTasks();

            }).catch((error) => {
                // STAMPO IN CONSOLE L'ERRORE
                console.error("Errore nella Chiamata API setTaskDone: ", error);
            });
        },
        taskEditModal(task) {
            this.taskActive = task;
            this.taskActiveTitle = task.title;
        },
        cancelTaskEditModal() {
            this.taskActive = {};
            this.taskActiveTitle = null;
            this.formErrors = {};
            this.getTasks();
        },
        taskUpdate() {
            // FACCIO PARTIRE IL LOADING
            this.store.loading = true;

            // SVUOTO IL FORM_ERRORS
            this.formErrors = {};

            // EFFETTUO LE VALIDAZIONI
            if (this.taskActive.title.trim() === "") {
                this.formErrors.title = "Il titolo della task è obbligatorio";
            }

            // SE CI SONO ERRORI, FERMO IL METODO
            if (Object.keys(this.formErrors).length > 0) {
                this.store.loading = false;
                return;
            }

            // EFFETTUO LA CHIAMATA PUT PER OTTENERE AGGIORNARE LA TASK
            axios.put(`${this.store.baseUrl}/api/tasks/${this.taskActive.id}`, this.taskActive).then((response) => {

                // STAMPO IN CONSOLE IL RISULTATO
                console.log(response);

                // CHIUDO LA MODALE "TASK_EDIT_MODAL"
                this.closeTaskEditModal();

                // AVVIO "CANCEL_TASK_EDIT_MODAL"
                this.cancelTaskEditModal();

            }).catch((error) => {
                // STAMPO IN CONSOLE L'ERRORE
                console.error("Errore nella Chiamata API getTasks: ", error);
            });
        },
        closeTaskEditModal() {
            // RIPRISTINO GLI STILI DEL BODY
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = '';

            // RIMUOVO DAL BODY LA CLASSE "MODAL-OPEN"
            document.body.classList.remove('modal-open');

            // TROVO IL MODAL_BACKDROP
            const modalBackdropElement = document.querySelector('.modal-backdrop');

            // SE ESISTE, LO RIMUOVO
            if (modalBackdropElement) {
                modalBackdropElement.remove();
            }
        },
        createNewTasksNotDone() {
            // MAPPO L'ARRAY DELLE "TASKS_NOT_DONE"
            this.newTasksNotDone = this.tasksNotDone.map(task => ({
                // IN QUESTO MODO MANTENGO TUTTE LE PROPRIETA GIA ESISTENTI
                ...task,
                // AGGIUNGO LA PROPRIETA "FORMATTED_DATE"
                formattedDate: this.formatItalianDate(task.date),
                // AGGIUNGO LA PROPRIETA "FORMATTED_TIME"
                formattedTime: this.formatItalianTime(task.time),
            }))
        },
        createNewTasksDone() {
            this.newTasksDone = this.tasksDone.map(task => ({
                // IN QUESTO MODO MANTENGO TUTTE LE PROPRIETA GIA ESISTENTI
                ...task,
                // AGGIUNGO LA PROPRIETA "FORMATTED_DATE"
                formattedDate: this.formatItalianDate(task.date),
                // AGGIUNGO LA PROPRIETA "FORMATTED_TIME"
                formattedTime: this.formatItalianTime(task.time),
            }))
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
    <div class="container-fluid" v-if="!this.store.loading">
        <!-- CONTAINER TASK NOT DONE -->
        <div class="container border rounded-5 shadow my-5">
            <div class="row py-5">
                <!-- TABLE TITLE -->
                <div class="col-12 text-center">
                    <h3>Task da completare</h3>
                </div>
                <!-- TABLE TASK -->
                <div class="col-12 mt-5">
                    <table class="table table-hover text-center">
                        <!-- TABLE HEADER -->
                        <thead>
                            <tr>
                                <th scope="col">Done</th>
                                <th scope="col">Titolo</th>
                                <th scope="col">Data</th>
                                <th scope="col">Ora</th>
                                <th scope="col">Strumenti</th>
                            </tr>
                        </thead>
                        <!-- TABLE BODY -->
                        <tbody>
                            <!-- TASK ROW -->
                            <tr role="button" v-for="task in newTasksNotDone" :key="task.id">
                                <!-- TASK CHECKBOX -->
                                <td>
                                    <input type="checkbox" role="button" class="form-check-input" :name="task.title"
                                        :id="task.id" :checked="task.done" @click="setTaskDone(task.id)">
                                </td>
                                <!-- TASK TITLE -->
                                <td v-text="task.title"></td>
                                <!-- TASK DATE -->
                                <td v-text="`${task.date ? task.formattedDate : '-'}`"></td>
                                <!-- TASK TIME -->
                                <td v-text="`${task.time ? task.formattedTime : '-'}`"></td>
                                <!-- TASK TOOLS -->
                                <td>
                                    <!-- BUTTON EDIT -->
                                    <button class="btn btn-warning mx-1" data-bs-toggle="modal"
                                        data-bs-target="#taskEditModal" @click="taskEditModal(task)">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </td>
                            </tr>
                            <!-- TASK EMPTY MESSAGE -->
                            <tr v-if="!tasksNotDone.length">
                                <td colspan="5" class="text-center py-4">Nessuna task da completare</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <!-- CONTAINER TASK DONE -->
        <!-- CONTAINER TASKS CATEGORIES -->
        <div class="container border rounded-5 shadow my-5">
            <div class="row py-5">
                <div class="col-12">
                    <ol class="m-0">
                        <li v-for="taskCategory in tasksCategories">{{ taskCategory.title }}</li>
                    </ol>
                </div>
            </div>
        </div>
        <!-- TASK TOOLS MODAL -->
        <div class="modal modal-xl fade my-lg-5" id="taskEditModal" data-bs-backdrop="static" data-bs-keyboard="false"
            tabindex="-1" aria-labelledby="taskEditModalLabel" aria-hidden="true">
            <!-- MODAL DIALOG -->
            <div class="modal-dialog">
                <!-- MODAL CONTENT -->
                <div class="modal-content" :class="theme + '-mode-task-form-modal'">
                    <!-- MODAL HEADER -->
                    <div class="modal-header">
                        <!-- MODAL TITLE -->
                        <h1 class="modal-title fs-5" id="taskEditModalLabel" v-text="this.taskActiveTitle"></h1>
                        <!-- BUTTON CLOSE -->
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                            @click="cancelTaskEditModal"></button>
                    </div>
                    <!-- MODAL BODY -->
                    <div class="modal-body">
                        <!-- CONTAINER MESSAGGI DI ERRORI -->
                        <div class="alert alert-danger" v-if="Object.keys(formErrors).length > 0">
                            <ul>
                                <li v-for="(error, key) in formErrors" :key="key" v-text="error"></li>
                            </ul>
                        </div>
                        <!-- INPUT TITOLO -->
                        <div class="input-group mb-3">
                            <label class="input-group-text" for="task-title">Titolo*</label>
                            <input type="text" class="form-control" id="task-title" placeholder="Inserisci il titolo"
                                v-model="this.taskActive.title">
                        </div>
                        <!-- INPUT DATA -->
                        <div class="input-group mb-3">
                            <label class="input-group-text" for="task-date">Data</label>
                            <input type="date" class="form-control" id="task-date" v-model="this.taskActive.date">
                        </div>
                        <!-- INPUT ORA -->
                        <div class="input-group mb-3">
                            <label class="input-group-text" for="task-time">Ora</label>
                            <input type="time" class="form-control" id="task-time" v-model="this.taskActive.time">
                        </div>
                        <!-- SELECT DONE -->
                        <div class="input-group mb-3">
                            <label class="input-group-text" for="task-done">Task completata*</label>
                            <select class="form-select" id="task-done" v-model="this.taskActive.done">
                                <option :value="true">Si</option>
                                <option :value="false">No</option>
                            </select>
                        </div>
                        <!-- SELECT CATEGORIA -->
                        <div class="input-group mb-3">
                            <label class="input-group-text" for="task-category">Categoria*</label>
                            <select class="form-select" id="task-category" v-model="this.taskActive.taskCategory">
                                <option v-for="taskCategory in tasksCategories" :key="taskCategory.id" :value="taskCategory"
                                    v-text="taskCategory.title"></option>
                            </select>
                        </div>
                    </div>
                    <!-- MODAL FOOTER -->
                    <div class="modal-footer">
                        <!-- BUTTON ANNULLA -->
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                            @click="cancelTaskEditModal">Annulla</button>
                        <!-- BUTTON MODIFICA -->
                        <button type="button" class="btn btn-warning" @click="taskUpdate">Modifica</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- CONFIRM DELETE TASK MODAL -->
    </div>
</template>

<style lang="scss" scoped></style>