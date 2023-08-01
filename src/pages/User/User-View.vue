<template>
    <!-- 路由中转站 -->
    <router-view class="fit-fixed-position" v-if="isReady"></router-view>
</template>

<script>
import { mapActions } from "vuex";
export default {
    data() {
        return {
            isReady: false, //渲染锁
        }
    },
    methods: {
        ...mapActions("UserModule", ["getUser"]),
    },
    async created() {
        //控制初始路由
        if (this.$route.path !== "/user/info")  this.$router.replace("/user/info");
        //卡个渲染锁
        await this.getUser();
        this.isReady = true;
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
