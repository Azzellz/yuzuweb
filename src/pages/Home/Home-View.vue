<template>
    <div class="center">
        <transition name="fade" appear>
            <div class="title">Yuzu</div>
        </transition>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    methods: {},
};
</script>

<style scoped>
.title {
    font-size: 100px;
    color: #ffffff;
    text-shadow: 0 0 10px #919191;
    text-align: center;
    font-family: "Pacifico", cursive;
    animation: animate 3s linear infinite;
}
</style>
