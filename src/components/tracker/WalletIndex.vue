<script>
import { store } from '../../store';
import axios from 'axios';

export default {
    inject: ['theme'],
    props: {
        getWallets: Function,
    },
    data() {
        return {
            store,

            showDisabledWallets: false,

            walletActive: {},
            walletFormTitle: null,
            newWallet: {
                name: "",
                balance: "",
            },
            formErrors: {},
        }
    },
    methods: {
        /*
            INIZIO GESTIONE WALLET FORM
        */
        showWalletFormModal(wallet){

            this.walletActive = wallet;

            if(Object.keys(this.walletActive).length > 0){

                this.walletFormTitle = `Modifica: '${wallet.name}'`;

                this.newWallet = {
                    name: this.walletActive.name,
                    balance: this.walletActive.balance,
                };
            } else{
                this.walletFormTitle = "Crea un nuovo wallet";
            }
        },
        cancelWalletFormModal(){
            this.walletActive = {};
            this.walletFormTitle = null;
            this.newWallet = {
                name: "",
                balance: 0,
            };
            this.formErrors = {};
            this.getWallets();
        },
        walletSubmitForm(){
            // FACCIO PARTIRE IL LOADING
            this.store.loading = true;

            // SVUOTO IL FORM_ERRORS
            this.formErrors = {};

            // EFFETTUO LE VALIDAZIONI
            if (this.newWallet.name.trim() === "") {
                this.formErrors.name = "Il nome del wallet è obbligatorio";
            }

            // SE CI SONO ERRORI, FERMO IL METODO
            if (Object.keys(this.formErrors).length > 0) {
                this.store.loading = false;
                return;
            }

            if(!Object.keys(this.walletActive).length){ // SE WALLET_ACTIVE È VUOTO, L'UTENTE STA CREANDO UN NUOVO WALLET

                // EFFETTUO LA CHIAMATA POST PER CREARE IL WALLET
                axios.post(`${this.store.baseUrl}/api/tracker/wallets`, this.newWallet).then(() => {

                    // RESETTO LE VARIABILI DI APPOGGIO E AGGIORNO I WALLET
                    this.cancelWalletFormModal();

                    // CHIUDO LA MODALE "WALLET_FORM_MODAL"
                    this.closeWalletFormModal();

                }).catch((error) => {
                    // STAMPO IN CONSOLE L'ERRORE
                    console.error("Errore nella richiesta API storeWallet: ", error);
                });

            } else{ // SE WALLET_ACTIVE NON È VUOTO, L'UTENTE STA MODIFICANDO UN WALLET

                // EFFETTUO LA CHIAMATA PUT PER MODIFICARE IL WALLET
                axios.put(`${this.store.baseUrl}/api/tracker/wallets/${this.walletActive.id}`, this.newWallet).then(() => {

                    // RESETTO LE VARIABILI DI APPOGGIO E AGGIORNO I WALLET
                    this.cancelWalletFormModal();

                    // CHIUDO LA MODALE "WALLET_FORM_MODAL"
                    this.closeWalletFormModal();

                }).catch((error) => {
                    // STAMPO IN CONSOLE L'ERRORE
                    console.error("Errore nella richiesta API updateWallet: ", error);
                });
            }
        },
        closeWalletFormModal(){
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
            FINE GESTIONE WALLET FORM
        */
        toggleDisabledWallets() {
            this.showDisabledWallets = !this.showDisabledWallets;
        },
        toggleWalletActive(id) {
            // FACCIO PARTIRE IL LOADING
            this.store.loading = true;

            // EFFETTUO LA CHIAMATA PUT PER AGGIORNARE LO STATO "ACTIVE" DEL WALLET
            axios.put(`${this.store.baseUrl}/api/tracker/wallets/active/${id}`).then(() => {

                // AGGIORNO I WALLETS
                this.getWallets();

            }).catch((error) => {
                console.error("Errore nella Chiamata API toggleWalletActive: ", error);
            });
        },
        getFormattedBalance(balance){
            return balance.toFixed(2);
        }
    },
}
</script>

<template>
    <div class="main-content" v-if="!store.loading">
        <div class="container-fluid px-5">
            <!-- CONTAINER OF RETURN BUTTON AND SHOW DISABLED WALLET -->
            <div class="container-fluid my-5">
                <div class="row">
                    <!-- RETURN BUTTON -->
                    <div class="col-6">
                        <i class="icon fa-solid fa-circle-arrow-left fa-xl" :class="`${theme}-icon`"
                            @click="$emit('close-page')"></i>
                    </div>
                    <!-- SHOW DISABLED WALLET -->
                    <div class="col-6 d-flex justify-content-end" v-if="store.tracker.disabledWallets.length > 0">
                        <div class="d-flex rounded-4 shadow p-3">
                            <label class="mx-3">Wallet disabilitati</label>
                            <div class="form-check form-switch d-flex justify-content-center"
                                @click="toggleDisabledWallets()">
                                <input class="form-check-input" type="checkbox" role="switch"
                                    :checked="showDisabledWallets">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- CONTAINER OF WALLETS -->
            <div class="container-fluid rounded-4 shadow my-5">
                <div class="row py-5">
                    <!-- HEADER -->
                    <div class="col-12">
                        <div class="row">
                            <!-- TITLE -->
                            <div class="col-6 px-5">
                                <h3>Wallet</h3>
                            </div>
                            <!-- CREATE WALLET BUTTON -->
                            <div class="col-6 text-end px-5">
                                <button class="btn btn-success" data-bs-toggle="modal"
                                    data-bs-target="#walletFormModal" @click="showWalletFormModal({})">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <!-- WALLETS TABLE -->
                    <div class="col-12 mt-5">
                        <table class="table table-hover text-center">
                            <!-- TABLE HEADER -->
                            <thead>
                                <tr>
                                    <th scope="col">Abilitato</th>
                                    <th scope="col">Nome</th>
                                    <th scope="col">Saldo</th>
                                    <th scope="col">Strumenti</th>
                                </tr>
                            </thead>
                            <!-- TABLE BODY -->
                            <tbody>
                                <!-- WALLETS EMPTY MESSAGE -->
                                <tr v-if="!store.tracker.activeWallets.length">
                                    <td colspan="4" class="text-center py-4">Nessun wallet abilitato</td>
                                </tr>
                                <!-- ACTIVE WALLET ROW -->
                                <tr v-for="wallet in store.tracker.activeWallets" :key="wallet.id">
                                    <!-- ACTIVE -->
                                    <td>
                                        <i role="button" :class="wallet.active ? 'fas fa-eye' : 'fas fa-eye-slash'"
                                            @click="toggleWalletActive(wallet.id)"></i>
                                    </td>
                                    <td v-text="wallet.name"></td>
                                    <td>{{ getFormattedBalance(wallet.balance) }}€</td>
                                    <td>
                                        <!-- BUTTON EDIT -->
                                        <button class="btn btn-warning mx-1" data-bs-toggle="modal"
                                            data-bs-target="#walletFormModal"
                                            @click="showWalletFormModal(wallet)">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    </td>
                                </tr>
                                <!-- DISABLED WALLET ROW -->
                                <tr v-for="wallet in store.tracker.disabledWallets" :key="wallet.id"
                                    v-if="showDisabledWallets">
                                    <!-- ACTIVE -->
                                    <td>
                                        <i role="button" :class="wallet.active ? 'fas fa-eye' : 'fas fa-eye-slash'"
                                            @click="toggleWalletActive(wallet.id)"></i>
                                    </td>
                                    <td v-text="wallet.name"></td>
                                    <td>{{ getFormattedBalance(wallet.balance) }}€</td>
                                    <td>
                                        <!-- BUTTON EDIT -->
                                        <button class="btn btn-warning mx-1" data-bs-toggle="modal"
                                            data-bs-target="#walletFormModal"
                                            @click="showWalletFormModal(wallet)">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <!-- WALLET TOOLS MODAL -->
            <div class="modal modal-xl fade my-lg-5" id="walletFormModal" data-bs-backdrop="static"
                data-bs-keyboard="false" tabindex="-1" aria-labelledby="walletFormModalLabel" aria-hidden="true">
                <!-- MODAL DIALOG -->
                <div class="modal-dialog">
                    <!-- MODAL CONTENT -->
                    <div class="modal-content" :class="`${theme}-mode-modal`">
                        <!-- MODAL HEADER -->
                        <div class="modal-header">
                            <!-- MODAL TITLE -->
                            <h1 class="modal-title fs-5" id="walletFormModalLabel" v-text="walletFormTitle"></h1>
                            <!-- BUTTON CLOSE -->
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                @click="cancelWalletFormModal"></button>
                        </div>
                        <!-- MODAL BODY -->
                        <div class="modal-body py-5">
                            <!-- CONTAINER MESSAGGI DI ERRORI -->
                            <div class="alert alert-danger" v-if="Object.keys(formErrors).length > 0">
                                <ul>
                                    <li v-for="(error, key) in formErrors" :key="key" v-text="error"></li>
                                </ul>
                            </div>
                            <!-- INPUT NAME -->
                            <div class="input-group mb-3">
                                <label class="input-group-text" for="wallet-name">Nome*</label>
                                <input type="text" class="form-control" id="wallet-name"
                                    placeholder="Inserisci il nome" v-model="newWallet.name"
                                    @keyup.enter="walletSubmitForm">
                            </div>
                            <!-- INPUT BALANCE -->
                            <div class="input-group">
                                <label class="input-group-text" for="wallet-balance">Saldo*</label>
                                <input type="number" class="form-control" id="wallet-balance"
                                    placeholder="Inserisci il saldo" min="0" step="0.01" v-model="newWallet.balance"
                                    @keyup.enter="walletSubmitForm">
                            </div>
                        </div>
                        <!-- MODAL FOOTER -->
                        <div class="modal-footer">
                            <!-- BUTTON ANNULLA -->
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                                @click="cancelWalletFormModal">Annulla</button>
                            <!-- SUBMIT BUTTON -->
                            <button type="button" class="btn"
                                :class="!Object.keys(walletActive).length ? 'btn-success' : 'btn-warning'"
                                @click="walletSubmitForm">{{ !Object.keys(walletActive).length ? 'Crea' :
        'Modifica' }}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>