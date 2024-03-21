<script>
import { store } from '../store';
import axios from 'axios';

import TotalExpenseIndex from '../components/tracker/TotalExpenseIndex.vue';
import WalletIndex from '../components/tracker/WalletIndex.vue';

export default {
    components: {
        TotalExpenseIndex,
        WalletIndex,
    },
    data() {
        return {
            store,

            isExpenseIndexActive: false,
            isWalletIndexActive: false,
        }
    },
    mounted() {
        this.getExpenses();
        this.getWallets();
    },
    methods: {
        getExpenses() {
            // FACCIO PARTIRE IL LOADING
            this.store.loading = true;

            // SVUOTO L'ARRAY DELLE SPESE
            this.store.tracker.totalExpenses = [];

            // EFFETTUO LA CHIAMATA GET PER OTTENERE LA LISTA DELLE SPESE
            axios.get(`${this.store.baseUrl}/api/tracker/expenses`).then((response) => {

                // SALVO IL RISULTATO
                this.store.tracker.totalExpenses = response.data;

                // FERMO IL LOADING
                this.store.loading = false;

            }).catch((error) => {
                // STAMPO IN CONSOLE L'ERRORE
                console.error("Errore nella Chiamata API getExpenses: ", error);
            });
        },
        getWallets() {
            // FACCIO PARTIRE IL LOADING
            this.store.loading = true;

            // SVUOTO L'ARRAY DEI WALLET
            this.store.tracker.activeWallets = [];
            this.store.tracker.disabledWallets = [];

            // EFFETTUO LA CHIAMATA GET PER OTTENERE LA LISTA DEI WALLETS
            axios.get(`${this.store.baseUrl}/api/tracker/wallets`).then((response) => {

                // SALVO E FILTRO IL RISULTATO
                this.store.tracker.activeWallets = response.data.filter((wallet) => wallet.active);
                this.store.tracker.disabledWallets = response.data.filter((wallet) => !wallet.active);

                // FERMO IL LOADING
                this.store.loading = false;

            }).catch((error) => {
                // STAMPO IN CONSOLE L'ERRORE
                console.error("Errore nella Chiamata API getWallets: ", error);
            });
        },
        toggleExpenseIndex() {
            this.isExpenseIndexActive = !this.isExpenseIndexActive;
        },
        toggleWalletIndex() {
            this.isWalletIndexActive = !this.isWalletIndexActive;
        },
    },
}
</script>

<template>
    <div class="main-content" v-if="!store.loading && !isExpenseIndexActive && !isWalletIndexActive">
        <div class="container-fluid px-lg-5 animate__animated animate__fadeInDown animate__faster">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12 col-lg-6 px-2 my-3 my-lg-0" @click="toggleExpenseIndex()">
                        <div class="d-flex justify-content-center align-items-center shadow cursor-pointer py-5">
                            <i class="fa-solid fa-receipt fa-xl mx-2"></i>
                            <h2 class="fs-2 mx-2">Spese</h2>
                        </div>
                    </div>
                    <div class="col-12 col-lg-6 px-2 my-3 my-lg-0" @click="toggleWalletIndex()">
                        <div class="d-flex justify-content-center align-items-center shadow cursor-pointer py-5">
                            <i class="fas fa-wallet fa-xl mx-2"></i>
                            <h2 class="fs-2 mx-2">Wallet</h2>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div class="container-fluid rounded-4 shadow my-5">
                <div class="row py-5">
                    <div class="col-12 d-flex align-items-center px-4">
                        <span v-if="!taskNotDoneCounter">Nessuna task da completare</span>
                        <span v-else>Task da completare: {{ taskNotDoneCounter }}</span>
                    </div>
                </div>
            </div> -->
        </div>
    </div>
    <!-- EXPENSE-INDEX -->
    <total-expense-index v-if="!store.loading && isExpenseIndexActive" :getExpenses="getExpenses"
        @close-page="toggleExpenseIndex()" />
    <!-- WALLET-INDEX -->
    <wallet-index v-if="!store.loading && isWalletIndexActive" :getWallets="getWallets"
        @close-page="toggleWalletIndex()" />
</template>

<style lang="scss" scoped></style>