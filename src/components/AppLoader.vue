<script>
export default {

}
</script>

<template>
    <div class="loader-container">
        <div class="loader-content">
            <div class="spinner"></div>
        </div>
    </div>
</template>
  
<style lang="scss" scoped>
.loader-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;

    .loader-content {
        // background-color: white;
        padding: 20px;
        border-radius: 8px;
        text-align: center;

        .spinner {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: radial-gradient(farthest-side, #474bff 94%, #0000) top/9px 9px no-repeat,
                conic-gradient(#0000 30%, #474bff);
            -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 9px), #000 0);
            animation: spinner-c7wet2 1s infinite linear;
        }

        @keyframes spinner-c7wet2 {
            100% {
                transform: rotate(1turn);
            }
        }
    }
}
</style>