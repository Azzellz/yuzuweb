import axios from "axios";

//界面刷新Vuex会重新执行
const PostModule = {
    namespaced: true,
    //注意! actions只能接收一个额外参数val,如果要传多个参数,需要把参数封装成对象
    actions: {
        getPosts(context, val = {}) {
            //检查是否有参数传入,没有就使用默认值
            let currentPage = val.currentPage - 1 || 0; //currentPage=0的时候就是初始查询,不跳过
            let pageSize = +val.pageSize || 10; //默认是一页展示10个post
            let keyword = val.keyword || ""; //默认搜索关键字为空

            return new Promise((resolve, reject) => {
                axios
                    .get(
                        `/posts?limit=${pageSize}&skip=${
                            currentPage * pageSize
                        }&keyword=${keyword}`
                    )
                    .then(({ data: { data } }) => {
                        //从上下文对象中触发commit函数提交mutation,更新state
                        context.commit("UPDATE_LIST_POSTS", {
                            ...data,
                            currentPage,
                            pageSize,
                        });
                        //解除渲染锁
                        resolve(data);
                    })
                    .catch((err) => {
                        console.log(err);
                        reject(err);
                    });
            });
        },
        getLastestPosts(context) {
            //!获取最新的十篇文章,后续可拓展获取指定数量的文章
            return new Promise((resolve, reject) => {
                axios
                    .get(`/posts/lastest`)
                    .then(({ data: { data } }) => {
                        //更新LastestPosts
                        context.commit("UPDATE_LASTEST_POSTS", data);
                        //解除渲染锁
                        resolve(data);
                    })
                    .catch((err) => {
                        console.log(err);
                        reject(err);
                    });
            });
        },
        //直接将整个post对象传入,替换数据库内具有相同id的post
        updatePost(context, newPost) {
            console.log("going to update:", newPost);
            return axios.put(`/post`, newPost);
        },
        deletePost(context, post_id) {
            return axios.delete(`/post?post_id=${post_id}`);
        },
    },
    mutations: {
        UPDATE_LIST_POSTS(state, data) {
            state.posts = data.posts;
            state.total = data.total;
            state.currentPage = data.currentPage;
            state.pageSize = data.pageSize;
            console.log("updated post-list:", data.posts);
        },
        UPDATE_LASTEST_POSTS(state, data) {
            state.lastestPosts = data;
            console.log("updated lastest-post-list:", data);
        },
        UPDATE_CURRENT_PAGE(state, currentPage) {
            state.currentPage = currentPage;
            console.log("updated currentPage:", state.currentPage);
        },
        UPDATE_PAGE_SIZE(state, pageSize) {
            state.pageSize = pageSize;
            console.log("updated pageSize:", state.pageSize);
        },
    },
    getters: {
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
        lastestPosts: [],
        total: 0, //记录数据库post总数
        currentPage: 0, //默认从0开始算就是第一页
        pageSize: 10, //每页显示的记录数
    },
};
export default PostModule;
