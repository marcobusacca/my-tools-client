<script>
import { store } from '../store';
import axios from 'axios';

export default {
    data() {
        return {
            store,

            taskNotDoneCounter: 0,
        }
    },
    mounted() {
        this.getTasksNotDoneCounter();
    },
    methods: {
        getTasksNotDoneCounter(){

            this.store.loading = true;

            axios.get(`${this.store.baseUrl}/api/tasks`).then((response) => {

                let taskNotDone = response.data.filter(task => !task.done);

                this.taskNotDoneCounter = taskNotDone.length;

                this.store.loading = false;

            }).catch((error) => {
                console.error("Errore nella Chiamata API getTasks: ", error);
            });
        },
    },
}
</script>

<template>
    <div class="main-content" v-if="!this.store.loading">
        <div class="container-fluid px-5">
            <div class="container-fluid border rounded-4 shadow my-5">
                <div class="row py-5">
                    <div class="col-12 d-flex align-items-center">
                        <span v-if="!taskNotDoneCounter">Nessuna task da completare</span>
                        <span v-else>Task da completare: {{ taskNotDoneCounter }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>