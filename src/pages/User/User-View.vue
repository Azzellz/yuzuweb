<template>
    <!-- 路由中转站 -->
    <router-view :class="autoFit" v-if="isReady"></router-view>
</template>

<script>
import { mapActions } from "vuex";
export default {
    data() {
        return {
            isReady: false, //渲染锁
        };
    },
    computed: {
        //自适应类
        autoFit() {
            if (this.$route.meta.isHideAside && this.$route.meta.isHideHeader)
                return "";
            else if (this.$route.meta.isHideAside) return "without-aside";
            else if (this.$route.meta.isHideHeader) return "without-header";
            else return "with-aside-header";
        },
    },
    methods: {
        ...mapActions("UserModule", ["getUser"]),
    },
    async created() {
        //卡个渲染锁
        await this.getUser();
        this.isReady = true;
    },
};
</script>

<style scoped>
/* 适应fixed定位 */
.with-aside-header {
    margin-top: 60px;
    margin-left: 100px;
}
.without-aside {
    margin-top: 60px;
}
.without-header {
    margin-left: 100px;
}
</style>
