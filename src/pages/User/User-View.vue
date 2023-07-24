<template>
    <!-- 路由中转站 -->
    <router-view></router-view>
</template>

<script>
export default {
    mounted() {
        if (this.$route.path !== "/user/info")  this.$router.replace("/user/info");
        
    },
};
</script>

<style scoped>
.user-info {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
}
.user-item {
    margin: 10px;
    display: flex;
    justify-content: center;
    font-size: 30px;
    font-weight: bold;
}
</style>
