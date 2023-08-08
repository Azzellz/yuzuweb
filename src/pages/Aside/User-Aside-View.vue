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
            <el-menu-item index="/user/info">
                <i class="el-icon-tickets"></i>
                <span>资料</span>
            </el-menu-item>
            <el-menu-item index="/user/follows">
                <i class="el-icon-s-custom"></i>
                <span>关注</span>
            </el-menu-item>
            <el-menu-item index="/user/posts">
                <i class="el-icon-chat-dot-square"></i>
                <span>帖子</span>
            </el-menu-item>
            <el-menu-item index="/user/favorites">
                <i class="el-icon-star-off"></i>
                <span slot="title">收藏</span>
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
                case "/user/info":
                    this.activeIndex = "/user/info";
                    break;
                case "/user/follows":
                    this.activeIndex = "/user/follows";
                    break;
                case "/user/posts":
                    this.activeIndex = "/user/posts";
                    break;
                case "/user/favorites":
                    this.activeIndex = "/user/favorites";
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
    created() {
        this.watchRoute(this.$route);
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
