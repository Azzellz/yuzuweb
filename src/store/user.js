import axios from "axios";

//判断是否已经登录,如果已经登录,那本地存储就有user_id这个字段,这里就可以直接发请求获取用户信息

//界面刷新Vuex会重新执行
const UserModule = {
    namespaced: true, //启动Vuex模块化
    actions: {
        //从服务器获取用户信息,并更新state
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
                        context.commit("UPDATE_CURRENT_USER", data);
                        //解除渲染锁
                        resolve(data);
                    })
                    .catch((err) => {
                        console.log(err);
                        reject(err);
                    });
            });
        },
        //获取最近所有注册的用户
        getRecentUsers(context) {
            //获取最近所有注册的用户
            axios.get(`/user/recent`).then(({ data: { data } }) => {
                console.log(data);
                context.commit("UPDATE_RECENT_USERS", data);
            });
        },
        //更新用户信息
        updateUser(context, newUser) {
            return new Promise((resolve, reject) => {
                axios.put("/user", newUser).then(({ data: { data } }) => {
                    console.log(data);
                    resolve(data);
                }).catch((err) => {
                    console.log(err);
                    reject(err);
                });
            });
        },
    },
    //mutations只能用来触发state的更新
    mutations: {
        UPDATE_CURRENT_USER(state, data) {
            console.log("updated user-info:", data);
            state.user = data.user;
            state.publishedTotal = data.publishedTotal;
            state.favoritesTotal = data.favoritesTotal;
        },
        UPDATE_RECENT_USERS(state, data) {
            state.recentUsers = data;
        },
    },
    state: {
        user: {}, //指向当前用户
        recentUsers: [], //最近注册的所有用户
        publishedTotal: 0,
        favoritesTotal: 0,
    },
};
export default UserModule;
