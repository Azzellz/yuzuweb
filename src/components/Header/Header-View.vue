<template>
    <!-- 新导航栏 -->
    <el-menu
        :default-active="activeIndex"
        class="container"
        mode="horizontal"
        router
        background-color="#fff"
        text-color="#000"
        active-text-color="#ffd04b"
    >
        <el-menu-item index="/home">首页</el-menu-item>
        <el-menu-item index="/post/list">帖子</el-menu-item>
        <el-menu-item index="/user/info">个人</el-menu-item>
        <el-menu-item v-if="currentIndex" :index="activeIndex"
            >{{currentIndexContent}}</el-menu-item
        >
    </el-menu>
</template>

<script>
export default {
    data() {
        return {
            activeIndex: this.$route.path,
            currentIndex: false, //刚开始不可见
        };
    },
    computed:{
        currentIndexContent(){
            if (this.$route.query.title) return this.$route.query.title;
            else return "当前";
        }
    },
    methods: {
        showCurrentIndex(to) {
            this.activeIndex = to.fullPath;
            this.currentIndex = true;
        },
        //路由检查
        watchRoute(to) {
            this.currentIndex = false;
            const front = to.path.split("/")[1];
            const end = to.path.split("/")[2];

            switch (front) {
                case "post":
                    this.activeIndex = "/post/list";
                    break;
                case "user":
                    if (end==="info" || end==="follows" || end==="posts" || end==="favorites"){
                        this.activeIndex = "/user/info";
                    }else{
                        this.showCurrentIndex(to);
                    }  
                    break;
                default:
                    this.activeIndex = "/home";
                    break;
            }
        },
    },
    watch: {
        //监听路由变化
        $route(to) {
            this.watchRoute(to);
            console.log(to)
        },
    },
    created() {
        this.watchRoute(this.$route);
    },
};
</script>

<style scoped>
.nav-container {
    background-color: #000000;

    color: #fff;
    height: 50px;
    line-height: 50px;
    text-align: center;
    display: flex;
    justify-content: center;
}
.nav-item {
    margin: 0 25px;
    color: #fff;
    text-decoration: none;
}
.nav-item:hover {
    color: rgb(199, 199, 199);
}
.container {
    width: 100%;
    z-index: 10000;
    position: fixed;
    display: flex;
    justify-content: center;
    font-weight: bold;
}
</style>
