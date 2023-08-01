<template>
    <router-view class="fit-fixed-position" v-if="isReady"></router-view>
</template>

<script>
import { mapActions } from "vuex";
export default {
    data() {
        return {
            isReady: false, //渲染锁
        };
    },
    methods: {
        ...mapActions("PostModule", ["getPosts"]),
        ...mapActions("UserModule", ["getUser"]),
    },
    async created() {
        //卡个渲染锁
        let option = {
            currentPage: this.$route.query.currentPage,
            pageSize: this.$route.query.pageSize,
        };
        console.log(option)
        await Promise.all([this.getPosts(option), this.getUser(option)]);
        this.isReady = true; //解除渲染锁
    },
};
</script>

<style scoped>
/* 适应fixed定位 */
.fit-fixed-position {
    margin-top: 60px;
    margin-left: 100px;
}
</style>
