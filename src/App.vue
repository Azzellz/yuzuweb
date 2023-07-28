<template>
    <transition appear name="fadeIn">
        <div id="app">
            <!-- 头部 -->
            <Header v-show="isHideHeader"></Header>
            <!-- 主体 -->

            <div class="main-container">
                <!-- 边栏,选择性展示 -->
                <transition appear name="fadeIn">
                    <router-view name="aside"></router-view>
                </transition>
                <!-- 路由展示区:用flex1可以铺满剩余空间 -->
                <transition appear name="fadeIn">
                    <router-view v-if="isReady" style="flex: 1"></router-view>
                </transition>
                
            </div>
        </div>
    </transition>
</template>

<script>
import Header from "./components/Header/Header-View.vue";
import { mapActions } from "vuex";
export default {
    name: "App",
    components: {
        Header,
        // Aside,
    },
    data() {
        return {
            isReady: false, //渲染锁
        };
    },
    methods: {
        ...mapActions("PostModule", ["getPosts"]),
        ...mapActions("UserModule", ["getUser"]),

        async loginCheck() {
            //做Token校验
            if (localStorage.getItem("token")) {
                //登录校验
                try {
                    const { data } = await this.$axios.post(
                        "http://localhost:4000/login",
                        {},
                        {
                            headers: {
                                Authorization: localStorage.getItem("token"),
                            },
                        }
                    );
                    console.log(data);
                } catch (err) {
                    //登录失败
                    console.log(err);
                    alert("登录已过期,请重新登录");
                    //移除旧的token
                    localStorage.clear();
                    //将界面路由至登录页面
                    this.$router.replace("/login");
                }
                // this.$axios
                //     .post(
                //         "http://localhost:4000/login",
                //         {},
                //         {
                //             headers: {
                //                 Authorization: localStorage.getItem("token"),
                //             },
                //         }
                //     )
                //     .then(({ data }) => {
                //         console.log(data);
                //     })
                //     .catch((err) => {
                //         //登录失败
                //         console.log(err);
                //         alert("登录已过期,请重新登录");
                //         //移除旧的token
                //         localStorage.clear();
                //         //将界面路由至登录页面
                //         this.$router.replace("/login");
                //     });
            } else if (
                this.$route.path !== "/login" &&
                this.$route.path !== "/register"
            ) {
                this.$router.replace("/login");
            }
        },
        storageCheck() {
            //做本地存储检查
            if (
                !localStorage.getItem(
                    "user_id" &&
                        !localStorage.getItem("token") &&
                        !localStorage.getItem("user_name") &&
                        !localStorage.getItem("user_account")
                ) &&
                !localStorage.getItem("avatar")
            ) {
                this.$message.error("本地信息有误,请重新登录");
                localStorage.clear();
                if (this.$route.path !== "/login") {
                    this.$router.replace("/login");
                }
            }
        },
    },
    computed: {
        isHideHeader() {
            return !this.$route.meta.hideHeader;
        },
    },
    async mounted() {
        //做登录检查
        this.loginCheck();
        //在APP实例中编程式操作路由时,不能重复进入路由,否则会崩溃
        //检查本地存储是否被修改
        this.storageCheck();

        //全局渲染锁检查
        //TODO: 解决了刷新后数据丢失的问题
        //TODO: 期间可以展示一个loading动画
        //等待数据刷新完后再渲染

        //这里更新数据没传参,默认是只拿到了10条post
        await Promise.all([this.getPosts(), this.getUser()]);
        this.isReady = true; //解除渲染锁

        // this.isReady = true; //解除渲染锁
    },
};
</script>

<style scoped>
#app {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
}


.main-container {
    display: flex;
    flex: 1;
}
</style>
<!-- 全局css样式 -->
<style>
* {
    padding: 0;
    margin: 0;
}

.center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.title {
    margin: 2rem auto;
    font-weight: bold;
    text-align: center;
    font-size: 30px;
    line-height: 30px;
}

.fadeIn-enter-active {
    animation: fadeIn 1s;
}
</style>
