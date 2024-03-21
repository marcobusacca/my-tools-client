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
                balance: 0,
            },
            formErrors: {},
        }
    },
    methods: {
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
    },
}
</script>

<template>
    <div class="main-content" v-if="!store.loading">
        <div class="container-fluid px-5">
            <!-- CONTAINER OF RETURN BUTTON AND SHOW DISABLED WALLET -->
            <div class="container-fluid my-5">
                <div class="row">
                    <div class="col-6">
                        <i class="icon fa-solid fa-circle-arrow-left fa-xl" :class="`${theme}-icon`"
                            @click="$emit('close-page')"></i>
                    </div>
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
                                <!-- data-bs-toggle="modal"
                                    data-bs-target="#taskCategoryFormModal" @click="showTaskCategoryFormModal({})" -->
                                <button class="btn btn-success">
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
                                <!-- WALLET ROW -->
                                <tr v-for="wallet in store.tracker.activeWallets" :key="wallet.id">
                                    <!-- ACTIVE -->
                                    <td>
                                        <i role="button" :class="wallet.active ? 'fas fa-eye' : 'fas fa-eye-slash'"
                                            @click="toggleWalletActive(wallet.id)"></i>
                                    </td>
                                    <td v-text="wallet.name"></td>
                                    <td v-text="wallet.balance"></td>
                                    <td>
                                        <!-- BUTTON EDIT -->
                                        <!-- data-bs-toggle="modal"
                                            data-bs-target="#taskCategoryFormModal"
                                            @click="showTaskCategoryFormModal(taskCategory)" -->
                                        <button class="btn btn-warning mx-1">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr v-for="wallet in store.tracker.disabledWallets" :key="wallet.id"
                                    v-if="showDisabledWallets">
                                    <!-- ACTIVE -->
                                    <td>
                                        <i role="button" :class="wallet.active ? 'fas fa-eye' : 'fas fa-eye-slash'"
                                            @click="toggleWalletActive(wallet.id)"></i>
                                    </td>
                                    <td v-text="wallet.name"></td>
                                    <td v-text="wallet.balance"></td>
                                    <td>
                                        <!-- BUTTON EDIT -->
                                        <!-- data-bs-toggle="modal"
                                            data-bs-target="#taskCategoryFormModal"
                                            @click="showTaskCategoryFormModal(taskCategory)" -->
                                        <button class="btn btn-warning mx-1">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    </td>
                                </tr>
                                <!-- WALLETS EMPTY MESSAGE -->
                                <!-- <tr v-if="!store.tracker.activeWallets.length">
                                    <td colspan="4" class="text-center py-4">Nessun wallet trovato</td>
                                </tr> -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <!-- WALLET TOOLS MODAL -->
        </div>
    </div>
</template>

<style lang="scss" scoped></style>