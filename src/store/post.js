import axios from "axios";
axios.defaults.baseURL = "http://localhost:4000";
//todo 这里应该限制向后端获取的post数量,只获取指定数量的post
// axios
//     .get("/posts")
//     .then(({ data: { data } }) => {
//         //从Vuex获取数据
//         PostModule.state.posts = data;
//         console.log("inited post-list:", data);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

//界面刷新Vuex会重新执行
const PostModule = {
    namespaced: true,
    actions: {
        updatePosts(context) {
            return new Promise((resolve, reject) => {
                axios
                    .get("/posts")
                    .then(({ data: { data } }) => {
                        //从上下文对象中触发commit函数提交mutation,更新state
                        context.commit("UPDATE", data);
                        console.log("updated post-list:", data);
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
        UPDATE(state, posts) {
            state.posts = posts;
        },
    },
    getters: {
        posts(state) {
            return state.posts;
        },
        getPostById(state) {
            return (id) => {
                state.posts.find((post) => {
                    return post._id === id;
                });
            };
        },
    },
    state: {
        posts: [],
    },
};
export default PostModule;
