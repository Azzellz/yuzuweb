import axios from "axios";
axios.defaults.baseURL = "http://localhost:4000";

//判断是否已经登录,如果已经登录,那本地存储就有user_id这个字段,这里就可以直接发请求获取用户信息
const user_id = localStorage.getItem("user_id");
// if (user_id) {
//     axios
//         .get(`/user?id=${user_id}`)
//         .then(({ data: { data } }) => {
//             //从Vuex获取数据
//             UserModule.state.user = data;
//             console.log("inited user-info:", data);
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// }

//界面刷新Vuex会重新执行
const UserModule = {
    namespaced: true, //启动Vuex模块化
    actions: {
        updateUserInfo(context) {
            return new Promise((resolve, reject) => {
                axios
                    .get(`/user?id=${user_id}`)
                    .then(({ data: { data } }) => {
                        //从上下文对象中触发commit函数提交mutation,更新state
                        context.commit("UPDATE", data);
                        console.log("updated user-info:", data);
                        //解除渲染锁
                        resolve(data);
                    })
                    .catch((err) => {
                        console.log(err);
                        reject(err);
                    });
            });
        },
    },
    mutations: {
        UPDATE(state, user) {
            state.user = user;
        },
    },
    getters: {
        userInfo(state) {
            return state.user;
        },
    },
    state: {
        user: {},
    },
};
export default UserModule;
