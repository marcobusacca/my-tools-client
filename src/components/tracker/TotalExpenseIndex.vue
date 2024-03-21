<script>
import { store } from '../../store';

export default {
    data() {
        return {
            store,
        }
    },
}
</script>

<template>
    <div class="main-content" v-if="!store.loading">
        <div class="container-fluid px-lg-5">
            <div class="container-fluid rounded-4 shadow my-5">
                <div class="row py-5">
                    <div class="col-12">
                        <span>Expense</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>