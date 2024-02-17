<script>
export default {

}
</script>

<template>
    <header>
        <div class="container-fluid bg-black text-white text-center py-3">
            <div class="row">
                <div class="col-12">
                    <h1>
                        <router-link class="text-white text-decoration-none"
                            :to="{ name: 'home-page' }">MY-TOOLS</router-link>
                    </h1>
                </div>
            </div>
        </div>
    </header>
</template>

<style lang="scss" scoped></style>