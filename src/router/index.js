import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../pages/Home/Home-View.vue";
import User from "../pages/User/User-View.vue";
import Post from "../pages/Post/Post-View.vue";
import PostPublish from "../pages/Post/Post-Publish.vue";
import PostItem from "../pages/Post/Post-Item.vue";
import PostList from "../pages/Post/Post-List.vue";
import Login from "../pages/Login/Login-View.vue";
import Register from "../pages/Register/Register-View.vue";
import UserAside from "../pages/Aside/User-Aside-View.vue";
import PostAside from "../pages/Aside/Post-Aside-View.vue";
import UserFollows from "../pages/User/User-Follows.vue";
import UserInfo from "../pages/User/User-Info.vue";
import UserPosts from "../pages/User/User-Posts.vue";
import UserFavorites from "../pages/User/User-Favorites.vue";
import UserOtherInfo from "../pages/User/User-Other-Info.vue";

Vue.use(VueRouter);
const router = new VueRouter({
    routes: [
        {
            path: "/login",
            component: Login,
            meta: {
                hideHeader: true,
            },
        },
        {
            path: "/register",
            component: Register,
            meta: {
                hideHeader: true,
            },
        },
        {
            path: "/home",
            component: Home,
            meta: {
                hideAside: true,
            },
        },
        {
            path: "/post",
            components: {
                //配置default属性，渲染默认组件,会渲染到没有name属性的router-view中
                default: Post,
                aside: PostAside,
            },
            redirect: "/post/list",
            children: [
                {
                    path: "list",
                    component: PostList,
                },
                {
                    path: "publish",
                    component: PostPublish,
                },
                {
                    path: "item",
                    component: PostItem,
                    //使用props传参
                    props($route) {
                        return {
                            id: $route.query.id,
                        };
                    },
                },
            ],
        },
        {
            path: "/user",
            redirect: "/user/info",
            //使用componens实现多个组件渲染
            components: {
                //配置default属性，渲染默认组件,会渲染到没有name属性的router-view中
                default: User,
                aside: UserAside,
            },
            children: [
                {
                    path: "follows",
                    component: UserFollows,
                },
                {
                    path: "info",
                    component: UserInfo,
                },
                {
                    path: "posts",
                    component: UserPosts,
                },
                {
                    path: "favorites",
                    component: UserFavorites,
                },
                {
                    path: "other",
                    component: UserOtherInfo,
                    meta: {
                        isHideAside: true, //展示其他用户信息时隐藏侧边栏,注意,meta以这里的为主,其他地方的会被覆盖
                    },
                    props($route) {
                        return {
                            id: $route.query.id,
                            currentPage: $route.query.currentPage,
                            pageSize: $route.query.pageSize,
                        };
                    },
                },
            ],
        },
        {
            path: "*",
            redirect: "/login",
        },
    ],
});
//todo: 应该把登录校验放到这里做
// router.beforeEach((to, from, next) => {

// })
export default router;
