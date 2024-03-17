<script>
import { store } from '../../store';
import axios from 'axios';

export default {
    inject: ['theme'],
    props: {
        tasksCategories: Array,
        getTasks: Function,
        getTasksCategories: Function,
    },
    data() {
        return {
            store,

            taskCategoryActive: {},
            taskCategoryFormTitle: null,
            newTaskCategory: {
                title: "",
            },
            formErrors: {},
        }
    },
    methods: {
        /*
            INIZIO GESTIONE TASK_CATEGORY FORM
        */
        showTaskCategoryFormModal(taskCategory) {

            this.taskCategoryActive = taskCategory;

            if (Object.keys(this.taskCategoryActive).length > 0) {

                this.taskCategoryFormTitle = `Modifica: '${taskCategory.title}'`;

                this.newTaskCategory = {
                    title: this.taskCategoryActive.title,
                };
            } else {
                this.taskCategoryFormTitle = "Crea una nuova categoria";
            }
        },
        cancelTaskCategoryFormModal() {
            this.taskCategoryActive = {};
            this.taskCategoryFormTitle = null;
            this.newTaskCategory = {
                title: "",
            };
            this.formErrors = {};
            this.getTasks();
            this.getTasksCategories();
        },
        taskCategorySubmitForm() {
            // FACCIO PARTIRE IL LOADING
            this.store.loading = true;

            // SVUOTO IL FORM_ERRORS
            this.formErrors = {};

            // EFFETTUO LE VALIDAZIONI
            if (this.newTaskCategory.title.trim() === "") {
                this.formErrors.title = "Il titolo della categoria è obbligatorio";
            }

            // SE CI SONO ERRORI, FERMO IL METODO
            if (Object.keys(this.formErrors).length > 0) {
                this.store.loading = false;
                return;
            }

            if (!Object.keys(this.taskCategoryActive).length) { // SE TASK_CATEGORY_ACTIVE È VUOTO, L'UTENTE STA CREANDO UNA TASK_CATEGORY

                // EFFETTUO LA CHIAMATA POST PER CREARE LA TASK_CATEGORY
                axios.post(`${this.store.baseUrl}/api/tasks/categories`, this.newTaskCategory).then(() => {
                    
                    // RESETTO LE VARIABILI DI APPOGGIO E AGGIORNO LE CATEGORIE
                    this.cancelTaskCategoryFormModal();

                    // CHIUDO LA MODALE "TASK_CATEGORY_FORM_MODAL"
                    this.closeTaskCategoryFormModal();

                }).catch((error) => {
                    // STAMPO IN CONSOLE L'ERRORE
                    console.error("Errore nella richiesta API storeTaskCategory: ", error);
                });

            } else { // SE TASK_CATEGORY_ACTIVE NON È VUOTO, L'UTENTE STA MODIFICANDO UNA TASK_CATEGORY

                // EFFETTUO LA CHIAMATA PUT PER MODIFICARE LA TASK_CATEGORY
                axios.put(`${this.store.baseUrl}/api/tasks/categories/${this.taskCategoryActive.id}`, this.newTaskCategory).then(() => {

                    // RESETTO LE VARIABILI DI APPOGGIO E AGGIORNO LE CATEGORIE
                    this.cancelTaskCategoryFormModal();

                    // CHIUDO LA MODALE "TASK_CATEGORY_FORM_MODAL"
                    this.closeTaskCategoryFormModal();

                }).catch((error) => {
                    // STAMPO IN CONSOLE L'ERRORE
                    console.error("Errore nella Chiamata API updateTaskCategory: ", error);
                });
            }
        },
        closeTaskCategoryFormModal() {
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
            FINE GESTIONE TASK_CATEGORY FORM
        */
        showConfirmDeleteTaskCategoryModal(taskCategory){
            this.taskCategoryActive = taskCategory;
        },
        cancelConfirmDeleteTaskCategoryModal(){
            this.taskActive = {};
            this.getTasks();
            this.getTasksCategories();
        },
        deleteTaskCategory(id){
            // FACCIO PARTIRE IL LOADING
            this.store.loading = true;

            // EFFETTUO LA CHIAMATA DELETE PER CANCELLARE LA TASK
            axios.delete(`${this.store.baseUrl}/api/tasks/categories/${id}`).then(() => {

                this.cancelConfirmDeleteTaskCategoryModal();

            }).catch((error) => {
                // STAMPO IN CONSOLE L'ERRORE
                console.error("Errore nella Chiamata API deleteTask: ", error);
            });
        },
        /*
            INIZIO GESTIONE TASK_CATEGORY DELETE
        */
        /*
            FINE GESTIONE TASK_CATEGORY DELETE
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
            <!-- CONTAINER TASK CATEGORIES -->
            <div class="container-fluid rounded-4 shadow my-5">
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
                                <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#taskCategoryFormModal"
                                    @click="showTaskCategoryFormModal({})">
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
                                        <button class="btn btn-warning mx-1" data-bs-toggle="modal" data-bs-target="#taskCategoryFormModal" @click="showTaskCategoryFormModal(taskCategory)">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <!-- BUTTON DELETE -->
                                        <button class="btn btn-danger mx-1" data-bs-toggle="modal" data-bs-target="#confirmDeleteTaskCategoryModal" @click="showConfirmDeleteTaskCategoryModal(taskCategory)">
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
            <!-- TASK CATEGORY TOOLS MODAL -->
            <div class="modal modal-xl fade my-lg-5" id="taskCategoryFormModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="taskCategoryFormModalLabel" aria-hidden="true">
                <!-- MODAL DIALOG -->
                <div class="modal-dialog">
                    <!-- MODAL CONTENT -->
                    <div class="modal-content" :class="`${theme}-mode-modal`">
                        <!-- MODAL HEADER -->
                        <div class="modal-header">
                            <!-- MODAL TITLE -->
                            <h1 class="modal-title fs-5" id="taskCategoryFormModalLabel" v-text="taskCategoryFormTitle"></h1>
                            <!-- BUTTON CLOSE -->
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                @click="cancelTaskCategoryFormModal"></button>
                        </div>
                        <!-- MODAL BODY -->
                        <div class="modal-body py-5">
                            <!-- CONTAINER MESSAGGI DI ERRORI -->
                            <div class="alert alert-danger" v-if="Object.keys(formErrors).length > 0">
                                <ul>
                                    <li v-for="(error, key) in formErrors" :key="key" v-text="error"></li>
                                </ul>
                            </div>
                            <!-- INPUT TITOLO -->
                            <div class="input-group">
                                <label class="input-group-text" for="task-title">Titolo*</label>
                                <input type="text" class="form-control" id="task-title" placeholder="Inserisci il titolo"
                                    v-model="newTaskCategory.title" @keyup.enter="taskCategorySubmitForm">
                            </div>
                        </div>
                        <!-- MODAL FOOTER -->
                        <div class="modal-footer">
                            <!-- BUTTON ANNULLA -->
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                                @click="cancelTaskCategoryFormModal">Annulla</button>
                            <!-- SUBMIT BUTTON -->
                            <button type="button" class="btn"
                                :class="!Object.keys(taskCategoryActive).length ? 'btn-success' : 'btn-warning'"
                                @click="taskCategorySubmitForm">{{
                                !Object.keys(taskCategoryActive).length ? 'Crea' : 'Modifica'
                                }}</button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- CONFIRM DELETE TASK CATEGORY MODAL -->
            <div class="modal modal-xl fade my-lg-5" id="confirmDeleteTaskCategoryModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="confirmDeleteTaskCategoryModalLabel" aria-hidden="true">
                <!-- MODAL DIALOG -->
                <div class="modal-dialog">
                    <!-- MODAL CONTENT -->
                    <div class="modal-content" :class="`${theme}-mode-modal`">
                        <!-- MODAL HEADER -->
                        <div class="modal-header">
                            <!-- MODAL TITLE -->
                            <h1 class="modal-title fs-5" id="confirmDeleteTaskCategoryModalLabel">Conferma eliminazione categoria</h1>
                            <!-- BUTTON CLOSE -->
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                @click="cancelConfirmDeleteTaskCategoryModal()"></button>
                        </div>
                        <!-- MODAL BODY -->
                        <div class="modal-body py-5">
                            <div class="mb-5">
                                Tutte le task associate a questa categoria verranno automaticamente cancellate!
                            </div>
                            <div class="mt-5">
                                Sei sicuro di voler eliminare la categoria: "{{ taskCategoryActive.title }}"?
                            </div>
                        </div>
                        <!-- MODAL FOOTER -->
                        <div class="modal-footer">
                            <!-- BUTTON ANNULLA -->
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                                @click="cancelConfirmDeleteTaskCategoryModal()">Annulla</button>
                            <!-- SUBMIT BUTTON: DELETE TASK CATEGORY -->
                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
                                @click="deleteTaskCategory(taskCategoryActive.id)">Elimina</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>