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

            tasksCategories: [],

            taskActive: {},
            taskFormTitle: null,
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
                this.TasksDone = rawTasksDone.map(task => ({
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

                // SETTO LA PRIMA CATEGORIA IN NEW_TASK.TASK_CATEGORY
                this.newTask.taskCategory = this.tasksCategories[0];

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
        /*
            INIZIO GESTIONE TASK FORM
        */
        taskFormModal(task) {

            this.taskActive = task;

            if (Object.keys(this.taskActive).length > 0) {

                this.taskFormTitle = task.title;

                this.newTask = {
                    title: this.taskActive.title,
                    date: this.taskActive.date,
                    time: this.taskActive.time,
                    done: this.taskActive.done,
                    taskCategory: this.taskActive.taskCategory,
                };
            } else {
                this.taskFormTitle = "Crea una nuova task";
            }

        },
        cancelTaskFormModal() {
            this.taskActive = {};
            this.taskFormTitle = null;
            this.newTask = {
                title: "",
                date: "",
                time: "",
                done: false,
                taskCategory: this.tasksCategories[0],
            };
            this.formErrors = {};
            this.getTasks();
        },
        taskSubmitForm() {
            // FACCIO PARTIRE IL LOADING
            this.store.loading = true;

            // SVUOTO IL FORM_ERRORS
            this.formErrors = {};

            // EFFETTUO LE VALIDAZIONI
            if (this.newTask.title.trim() === "") {
                this.formErrors.title = "Il titolo della task è obbligatorio";
            }

            // SE CI SONO ERRORI, FERMO IL METODO
            if (Object.keys(this.formErrors).length > 0) {
                this.store.loading = false;
                return;
            }

            if (!Object.keys(this.taskActive).length) { // SE TASK_ACTIVE È VUOTO, L'UTENTE STA CREANDO UNA TASK

                // EFFETTUO LA CHIAMATA POST PER CREARE LA TASK
                axios.post(`${this.store.baseUrl}/api/tasks`, this.newTask).then((response) => {

                    // STAMPO IN CONSOLE LA RISPOSTA
                    console.log(response);

                    // CHIUDO LA MODALE "TASK_FORM_MODAL"
                    this.closeTaskFormModal();

                    // AVVIO "CANCEL_TASK_FORM_MODAL"
                    this.cancelTaskFormModal();

                }).catch((error) => {
                    // STAMPO IN CONSOLE L'ERRORE
                    console.error("Errore nella richiesta API storeTask: ", error);
                });

            } else { // SE TASK_ACTIVE NON È VUOTO, L'UTENTE STA MODIFICANDO UNA TASK

                // EFFETTUO LA CHIAMATA PUT PER MODIFICARE LA TASK
                axios.put(`${this.store.baseUrl}/api/tasks/${this.taskActive.id}`, this.newTask).then((response) => {

                    // STAMPO IN CONSOLE LA RISPOSTA
                    console.log(response);

                    // CHIUDO LA MODALE "TASK_FORM_MODAL"
                    this.closeTaskFormModal();

                    // AVVIO "CANCEL_TASK_FORM_MODAL"
                    this.cancelTaskFormModal();

                }).catch((error) => {
                    // STAMPO IN CONSOLE L'ERRORE
                    console.error("Errore nella Chiamata API updateTask: ", error);
                });
            }
        },
        closeTaskFormModal() {
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
        /*
            FINE GESTIONE TASK FORM
        */
        /*
            INIZIO GESTIONE TASK DELETE
        */
        confirmDeleteTaskModal(task){
            this.taskActive = task;
        },
        cancelConfirmDeleteTaskModal(){
            this.taskActive = {};
        },
        deleteTask(id){
            // FACCIO PARTIRE IL LOADING
            this.store.loading = true;

            // EFFETTUO LA CHIAMATA DELETE PER CANCELLARE LA TASK
            axios.delete(`${this.store.baseUrl}/api/tasks/${id}`).then((response) => {

                console.log(response);

                this.cancelConfirmDeleteTaskModal();

                this.getTasks();

            }).catch((error) => {
                // STAMPO IN CONSOLE L'ERRORE
                console.error("Errore nella Chiamata API deleteTask: ", error);
            });
        },
        /*
            FINE GESTIONE TASK DELETE
        */
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
                <!-- HEADER -->
                <div class="col-12">
                    <div class="row">
                        <!-- TITLE -->
                        <div class="col-6 px-5">
                            <h3>Task da completare</h3>
                        </div>
                        <!-- CREATE TASK BUTTON -->
                        <div class="col-6 text-end px-5">
                            <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#taskFormModal"
                                @click="taskFormModal({})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <!-- TABLE TASK -->
                <div class="col-12 mt-5">
                    <table class="table table-hover text-center">
                        <!-- TABLE HEADER -->
                        <thead>
                            <tr>
                                <th scope="col">Completata</th>
                                <th scope="col">Titolo</th>
                                <th scope="col">Data</th>
                                <th scope="col">Ora</th>
                                <th scope="col">Strumenti</th>
                            </tr>
                        </thead>
                        <!-- TABLE BODY -->
                        <tbody>
                            <!-- TASKS ROWS -->
                            <tr role="button" v-for="task in tasksNotDone" :key="task.id">
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
                                        data-bs-target="#taskFormModal" @click="taskFormModal(task)">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <!-- BUTTON DELETE -->
                                    <button class="btn btn-danger mx-1" data-bs-toggle="modal" data-bs-target="#confirmDeleteTaskModal" @click="confirmDeleteTaskModal(task)">
                                        <i class="fas fa-trash"></i>
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
        <!-- TASK TOOLS MODAL -->
        <div class="modal modal-xl fade my-lg-5" id="taskFormModal" data-bs-backdrop="static" data-bs-keyboard="false"
            tabindex="-1" aria-labelledby="taskFormModalLabel" aria-hidden="true">
            <!-- MODAL DIALOG -->
            <div class="modal-dialog">
                <!-- MODAL CONTENT -->
                <div class="modal-content" :class="theme + '-mode-task-modals'">
                    <!-- MODAL HEADER -->
                    <div class="modal-header">
                        <!-- MODAL TITLE -->
                        <h1 class="modal-title fs-5" id="taskFormModalLabel" v-text="this.taskFormTitle"></h1>
                        <!-- BUTTON CLOSE -->
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                            @click="cancelTaskFormModal"></button>
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
                                v-model="this.newTask.title" @keyup.enter="taskSubmitForm">
                        </div>
                        <!-- INPUT DATA -->
                        <div class="input-group mb-3">
                            <label class="input-group-text" for="task-date">Data</label>
                            <input type="date" class="form-control" id="task-date" v-model="this.newTask.date" @keyup.enter="taskSubmitForm">
                        </div>
                        <!-- INPUT ORA -->
                        <div class="input-group mb-3">
                            <label class="input-group-text" for="task-time">Ora</label>
                            <input type="time" class="form-control" id="task-time" v-model="this.newTask.time" @keyup.enter="taskSubmitForm">
                        </div>
                        <!-- SELECT DONE -->
                        <div class="input-group mb-3">
                            <label class="input-group-text" for="task-done">Task completata*</label>
                            <select class="form-select" id="task-done" v-model="this.newTask.done">
                                <option :value="false">No</option>
                                <option :value="true">Si</option>
                            </select>
                        </div>
                        <!-- SELECT CATEGORIA -->
                        <div class="input-group mb-3">
                            <label class="input-group-text" for="task-category">Categoria*</label>
                            <select class="form-select" id="task-category" v-model="this.newTask.taskCategory">
                                <option v-for="taskCategory in tasksCategories" :key="taskCategory.id" :value="taskCategory"
                                    v-text="taskCategory.title"></option>
                            </select>
                        </div>
                    </div>
                    <!-- MODAL FOOTER -->
                    <div class="modal-footer">
                        <!-- BUTTON ANNULLA -->
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                            @click="cancelTaskFormModal">Annulla</button>
                        <!-- SUBMIT BUTTON -->
                        <button type="button" class="btn"
                            :class="!Object.keys(this.taskActive).length ? 'btn-success' : 'btn-warning'"
                            @click="taskSubmitForm">{{
                                !Object.keys(this.taskActive).length ? 'Crea' : 'Modifica'
                            }}</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- CONFIRM DELETE TASK MODAL -->
        <div class="modal fade" id="confirmDeleteTaskModal" tabindex="-1" aria-labelledby="confirmDeleteTaskModalLabel" aria-hidden="true">
            <!-- MODAL DIALOG -->
            <div class="modal-dialog">
                <!-- MODAL CONTENT -->
                <div class="modal-content" :class="theme + '-mode-task-modals'">
                    <!-- MODAL HEADER -->
                    <div class="modal-header">
                        <!-- MODAL TITLE -->
                        <h1 class="modal-title fs-5" id="confirmDeleteTaskModalLabel">Conferma eliminazione task</h1>
                        <!-- BUTTON CLOSE -->
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="cancelConfirmDeleteTaskModal()"></button>
                    </div>
                    <!-- MODAL BODY -->
                    <div class="modal-body">
                        Sei sicuro di voler eliminare: "{{ taskActive.title }}"?
                    </div>
                    <!-- MODAL FOOTER -->
                    <div class="modal-footer">
                        <!-- BUTTON ANNULLA -->
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="cancelConfirmDeleteTaskModal()">Annulla</button>
                        <!-- SUBMIT BUTTON: DELETE TASK -->
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="deleteTask(taskActive.id)">Elimina</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>