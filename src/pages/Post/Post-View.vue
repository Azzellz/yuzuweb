<template>
    <router-view></router-view>
</template>

<script>
export default {
    mounted() {
        if (this.$route.path !== "/post/list")
            this.$router.replace("/post/list");
    },
};
</script>

<style scoped>

</style>
