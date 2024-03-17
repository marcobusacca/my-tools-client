<script>
import { store } from '../../store';
import axios from 'axios';

export default {
    inject: ['theme'],
    props: {
        tasksNotDone: Array,
        tasksDone: Array,
        tasksCategories: Array,
        getTasks: Function,
    },
    data() {
        return {
            store,

            isTasksCategoriesEmpty: false,

            taskActive: {},
            taskFormTitle: null,
            newTask: {
                title: "",
                date: "",
                time: "",
                done: false,
                taskCategory: this.tasksCategories[0],
            },
            formErrors: {},
        }
    },
    methods: {
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
        /*
            INIZIO GESTIONE TASK FORM
        */
        showTaskFormModal(task) {

            if(this.tasksCategories.length > 0){

                this.taskActive = task;
    
                if (Object.keys(this.taskActive).length > 0) {
    
                    this.taskFormTitle = `Modifica: '${task.title}'`;
    
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

            } else {
                this.taskFormTitle = "Nessuna categoria trovata";
                this.isTasksCategoriesEmpty = true;
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
        showConfirmDeleteTaskModal(task){
            this.taskActive = task;
        },
        cancelConfirmDeleteTaskModal(){
            this.taskActive = {};
            this.getTasks();
        },
        deleteTask(id){
            // FACCIO PARTIRE IL LOADING
            this.store.loading = true;

            // EFFETTUO LA CHIAMATA DELETE PER CANCELLARE LA TASK
            axios.delete(`${this.store.baseUrl}/api/tasks/${id}`).then((response) => {

                this.cancelConfirmDeleteTaskModal();

            }).catch((error) => {
                // STAMPO IN CONSOLE L'ERRORE
                console.error("Errore nella Chiamata API deleteTask: ", error);
            });
        },
        /*
            FINE GESTIONE TASK DELETE
        */
    },
}
</script>

<template>
    <div class="main-content" v-if="!store.loading">
        <div class="container-fluid px-5">
            <!-- CONTAINER OF RETURN BUTTON -->
            <div class="container-fluid my-5">
                <div class="row">
                    <div class="col-12">
                        <i class="icon fa-solid fa-circle-arrow-left fa-xl" :class="`${theme}-icon`" @click="$emit('close-page')"></i>
                    </div>
                </div>
            </div>
            <!-- CONTAINER TASKS NOT DONE -->
            <div class="container-fluid rounded-4 shadow my-5">
                <div class="row py-5">
                    <!-- HEADER -->
                    <div class="col-12">
                        <div class="row">
                            <!-- TITLE -->
                            <div class="col-6 px-5">
                                <h3>Da completare</h3>
                            </div>
                            <!-- CREATE TASK BUTTON -->
                            <div class="col-6 text-end px-5">
                                <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#taskFormModal"
                                    @click="showTaskFormModal({})">
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
                                    <th scope="col">Categoria</th>
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
                                    <!-- TASK CATEGORY TITLE -->
                                    <td v-text="task.taskCategory.title"></td>
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
                                            data-bs-target="#taskFormModal" @click="showTaskFormModal(task)">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <!-- BUTTON DELETE -->
                                        <button class="btn btn-danger mx-1" data-bs-toggle="modal"
                                            data-bs-target="#confirmDeleteTaskModal" @click="showConfirmDeleteTaskModal(task)">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                                <!-- TASK EMPTY MESSAGE -->
                                <tr v-if="!tasksNotDone.length">
                                    <td colspan="6" class="text-center py-4">Nessuna task da completare</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <!-- CONTAINER TASKS DONE -->
            <div class="container-fluid rounded-4 shadow my-5">
                <div class="row py-5">
                    <!-- HEADER -->
                    <div class="col-12 px-5">
                        <!-- TITLE -->
                        <h3>Completate</h3>
                    </div>
                    <!-- TABLE TASK -->
                    <div class="col-12 mt-5">
                        <table class="table table-hover text-center">
                            <!-- TABLE HEADER -->
                            <thead>
                                <tr>
                                    <th scope="col">Completata</th>
                                    <th scope="col">Categoria</th>
                                    <th scope="col">Titolo</th>
                                    <th scope="col">Data</th>
                                    <th scope="col">Ora</th>
                                    <th scope="col">Strumenti</th>
                                </tr>
                            </thead>
                            <!-- TABLE BODY -->
                            <tbody>
                                <!-- TASKS ROWS -->
                                <tr role="button" v-for="task in tasksDone" :key="task.id">
                                    <!-- TASK CHECKBOX -->
                                    <td>
                                        <input type="checkbox" role="button" class="form-check-input" :name="task.title"
                                            :id="task.id" :checked="task.done" @click="setTaskDone(task.id)">
                                    </td>
                                    <!-- TASK CATEGORY TITLE -->
                                    <td v-text="task.taskCategory.title"></td>
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
                                            data-bs-target="#taskFormModal" @click="showTaskFormModal(task)">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <!-- BUTTON DELETE -->
                                        <button class="btn btn-danger mx-1" data-bs-toggle="modal"
                                            data-bs-target="#confirmDeleteTaskModal" @click="showConfirmDeleteTaskModal(task)">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                                <!-- TASK EMPTY MESSAGE -->
                                <tr v-if="!tasksDone.length">
                                    <td colspan="6" class="text-center py-4">Nessuna task completata</td>
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
                    <div class="modal-content" :class="`${theme}-mode-modal`">
                        <!-- MODAL HEADER -->
                        <div class="modal-header">
                            <!-- MODAL TITLE -->
                            <h1 class="modal-title fs-5" id="taskFormModalLabel" v-text="taskFormTitle" :class="isTasksCategoriesEmpty ? 'text-danger' : ''"></h1>
                            <!-- BUTTON CLOSE -->
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                @click="cancelTaskFormModal"></button>
                        </div>
                        <!-- MODAL BODY -->
                        <div class="modal-body py-5" v-if="!isTasksCategoriesEmpty">
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
                                    v-model="newTask.title" @keyup.enter="taskSubmitForm">
                            </div>
                            <!-- INPUT DATA -->
                            <div class="input-group mb-3">
                                <label class="input-group-text" for="task-date">Data</label>
                                <input type="date" class="form-control" id="task-date" v-model="newTask.date"
                                    @keyup.enter="taskSubmitForm">
                            </div>
                            <!-- INPUT ORA -->
                            <div class="input-group mb-3">
                                <label class="input-group-text" for="task-time">Ora</label>
                                <input type="time" class="form-control" id="task-time" v-model="newTask.time"
                                    @keyup.enter="taskSubmitForm">
                            </div>
                            <!-- SELECT DONE -->
                            <div class="input-group mb-3">
                                <label class="input-group-text" for="task-done">Task completata*</label>
                                <select class="form-select" id="task-done" v-model="newTask.done">
                                    <option :value="false">No</option>
                                    <option :value="true">Si</option>
                                </select>
                            </div>
                            <!-- SELECT CATEGORIA -->
                            <div class="input-group">
                                <label class="input-group-text" for="task-category">Categoria*</label>
                                <select class="form-select" id="task-category" v-model="newTask.taskCategory">
                                    <option v-for="taskCategory in tasksCategories" :key="taskCategory.id" :value="taskCategory"
                                        v-text="taskCategory.title"></option>
                                </select>
                            </div>
                        </div>
                        <div class="modal-body py-5" v-else>
                            <span>Devi inserire almeno una categoria per poter creare delle task!</span>
                        </div>
                        <!-- MODAL FOOTER -->
                        <div class="modal-footer" v-if="!isTasksCategoriesEmpty">
                            <!-- BUTTON ANNULLA -->
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                                @click="cancelTaskFormModal">Annulla</button>
                            <!-- SUBMIT BUTTON -->
                            <button type="button" class="btn"
                                :class="!Object.keys(taskActive).length ? 'btn-success' : 'btn-warning'"
                                @click="taskSubmitForm">{{
                                !Object.keys(taskActive).length ? 'Crea' : 'Modifica'
                                }}</button>
                        </div>
                        <div class="modal-footer" v-else>
                            <!-- BUTTON ANNULLA -->
                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
                                @click="cancelTaskFormModal">Okay</button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- CONFIRM DELETE TASK MODAL -->
            <div class="modal modal-xl fade my-lg-5" id="confirmDeleteTaskModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
                aria-labelledby="confirmDeleteTaskModalLabel" aria-hidden="true">
                <!-- MODAL DIALOG -->
                <div class="modal-dialog">
                    <!-- MODAL CONTENT -->
                    <div class="modal-content" :class="`${theme}-mode-modal`">
                        <!-- MODAL HEADER -->
                        <div class="modal-header">
                            <!-- MODAL TITLE -->
                            <h1 class="modal-title fs-5" id="confirmDeleteTaskModalLabel">Conferma eliminazione task</h1>
                            <!-- BUTTON CLOSE -->
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                @click="cancelConfirmDeleteTaskModal()"></button>
                        </div>
                        <!-- MODAL BODY -->
                        <div class="modal-body py-5">
                            Sei sicuro di voler eliminare: "{{ taskActive.title }}"?
                        </div>
                        <!-- MODAL FOOTER -->
                        <div class="modal-footer">
                            <!-- BUTTON ANNULLA -->
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                                @click="cancelConfirmDeleteTaskModal()">Annulla</button>
                            <!-- SUBMIT BUTTON: DELETE TASK -->
                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
                                @click="deleteTask(taskActive.id)">Elimina</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>