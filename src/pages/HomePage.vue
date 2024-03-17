<script>
import { store } from '../store';
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
        <div class="container-fluid px-5">
            <div class="container-fluid rounded-4 shadow my-5">
                <div class="row py-5">
                    <div class="col-12 d-flex align-items-center px-4">
                        <span>Home</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>