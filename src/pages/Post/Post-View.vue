<template>
    <router-view class="fit-fixed-position"></router-view>
</template>

<script>
export default {
    mounted() {},
};
</script>

<style scoped>
/* 适应fixed定位 */
.fit-fixed-position {
    margin-top: 60px;
    margin-left: 100px;
}
</style>
