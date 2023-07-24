import axios from "axios";
axios.defaults.baseURL = "http://localhost:4000";

axios
    .get("/posts")
    .then(({ data: { data } }) => {
        //从Vuex获取数据
        PostModule.state.posts = data;
        console.log("post-list:", data);
    })
    .catch((err) => {
        console.log(err);
    });

//界面刷新Vuex会重新执行
const PostModule = {
    namespaced: true,
    actions: {
        updatePosts(context) {
            axios
                .get("/posts")
                .then(({ data: { data } }) => {
                    context.commit("UPDATE", data);
                    console.log('post-list:',data)
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    },
    mutations: {
        UPDATE(state, posts) {
            state.posts = posts;
        },
    },
    getters: {
        getPosts(state) {
            return state.posts;
        },
        getPostById: (state) => {
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
