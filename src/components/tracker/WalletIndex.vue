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
                        <i class="icon fa-solid fa-circle-arrow-left fa-xl" :class="`${theme}-icon`"
                            @click="$emit('close-page')"></i>
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
                                <tr v-for="wallet in store.tracker.wallets" :key="wallet.id">
                                    <!-- ACTIVE -->
                                    <td>
                                        <i :class="wallet.active ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
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
                                <tr v-if="!store.tracker.wallets.length">
                                    <td colspan="4" class="text-center py-4">Nessun wallet trovato</td>
                                </tr>
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