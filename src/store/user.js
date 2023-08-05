import axios from "axios";

//判断是否已经登录,如果已经登录,那本地存储就有user_id这个字段,这里就可以直接发请求获取用户信息

//界面刷新Vuex会重新执行
const UserModule = {
    namespaced: true, //启动Vuex模块化
    actions: {
        getUser(context, val = {}) {
            //检查是否有参数传入,没有就使用默认值
            //!这里是用来分页的逻辑,一定要注意,如果不传入参数,那么就是初始查询,不跳过
            let currentPage = val.currentPage - 1 || 0; //currentPage=0的时候就是初始查询,不跳过
            let pageSize = val.pageSize || 10; //默认是一页展示10个post
            let keyword = val.keyword || ""; //默认搜索关键字为空

            return new Promise((resolve, reject) => {
                axios
                    .get(
                        `/user?id=${localStorage.getItem(
                            "user_id"
                        )}&limit=${pageSize}&skip=${
                            currentPage * pageSize
                        }&keyword=${keyword}`
                    )
                    .then(({ data: { data } }) => {
                        //从上下文对象中触发commit函数提交mutation,更新state
                        context.commit("UPDATE", data);
                        //解除渲染锁
                        resolve(data);
                    })
                    .catch((err) => {
                        console.log(err);
                        reject(err);
                    });
            });
        },
        getRecentUsers(context) {
            //获取最近所有注册的用户
            axios.get(`/user/recent`).then(({ data: { data } }) => {
                console.log(data)
                context.commit("UPDATE_RECENT_USERS", data);
            })
        },
        //!已弃用
        // async findUserPosts(context, postId) {
        //     //TODO: 得做一个同步用户信息的操作,确保当前store中的用户信息是匹配当前postid的
        //     console.log("findUserPosts:", postId);
        //     for (
        //         let i = 1;
        //         context.state.user.favorites.length ||
        //         context.state.user.published.length;
        //         i++
        //     ) {
        //         console.log(i);
        //         if (
        //             context.state.user.favorites.find(
        //                 (post) => post._id === postId
        //             ) ||
        //             context.state.user.published.find(
        //                 (post) => post._id === postId
        //             )
        //         ) {
        //             return; //如果找到了就跳出循环
        //         } else {
        //             await context.dispatch("getUser", {
        //                 currentPage: i,
        //                 keyword: "",
        //                 pageSize: this.pageSize,
        //             });
        //         }
        //     }
        //     //没找到就初始化用户信息
        //     await context.dispatch("getUser", {});
        // },
    },
    mutations: {
        UPDATE(state, data) {
            console.log("updated user-info:", data);
            state.user = data.user;
            state.publishedTotal = data.publishedTotal;
            state.favoritesTotal = data.favoritesTotal;
        },
        UPDATE_RECENT_USERS(state, data) {
            state.recentUsers = data;
        }
    },
    getters: {},
    state: {
        user: {},//指向当前用户
        recentUsers: [],//最近注册的所有用户
        publishedTotal: 0,
        favoritesTotal: 0,
    },
};
export default UserModule;
