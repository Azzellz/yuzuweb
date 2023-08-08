<template>
    <div class="container">
        <el-menu
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            style="border: none"
            router
            :default-active="activeIndex"
        >
            <el-menu-item v-if="currentIndex" :index="activeIndex"
                ><i class="el-icon-location"></i>
                <span slot="title">当前</span>
            </el-menu-item>
            <el-menu-item index="/post/list">
                <i class="el-icon-document-copy"></i>
                <span slot="title">全部</span>
            </el-menu-item>
            <el-menu-item index="/post/publish">
                <i class="el-icon-edit"></i>
                <span slot="title">发布</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
export default {
    data() {
        return {
            activeIndex: this.$route.path,
            currentIndex: false, //刚开始不可见
        };
    },
    methods: {
        //展示当前这个路由项
        showCurrentIndex(to) {
            this.activeIndex = to.fullPath;
            this.currentIndex = true;
        },
        //路由检查
        watchRoute(to) {
            this.currentIndex = false;
            switch (to.path) {
                case "/post/list":
                    this.activeIndex = "/post/list";
                    break;
                case "/post/publish":
                    this.activeIndex = "/post/publish";
                    break;
                default:
                    this.showCurrentIndex(to);
                    break;
            }
        },
    },
    watch: {
        $route(to) {
            this.watchRoute(to);
        },
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            vm.watchRoute(to);
        });
    },
};
</script>

<style scoped>
.container {
    width: 100px;
    height: 100%;
    margin-top: 60px;
    background-color: #545c64;
    font-weight: bold;
    overflow-y: auto;
    position: fixed;
}
</style>
