import axios from "axios";

//界面刷新Vuex会重新执行
const PostModule = {
    namespaced: true,
    //注意! actions只能接收一个额外参数val,如果要传多个参数,需要把参数封装成对象
    actions: {
        getPosts(context, val={}) {
            
            //检查是否有参数传入,没有就使用默认值
            let currentPage = val.currentPage || 0; //currentPage=0的时候就是初始查询,不跳过
            let pageSize = val.pageSize || 10; //默认是一页展示10个post
            let keyword = val.keyword || ""; //默认搜索关键字为空
            console.log("currentPage:", currentPage);
            
            return new Promise((resolve, reject) => {
                axios
                    .get(
                        `/posts?limit=${pageSize}&skip=${
                            currentPage * pageSize
                        }&keyword=${keyword}`
                    )
                    .then(({ data: { data } }) => {
                        //从上下文对象中触发commit函数提交mutation,更新state
                        context.commit("UPDATE", data);
                        console.log(data);
                        //解除渲染锁
                        resolve(data);
                    })
                    .catch((err) => {
                        console.log(err);
                        reject(err);
                    });
            });
        },
        updatePost(context, newPost) {
            console.log(newPost)
            axios.put(`/post`, newPost).then(({ data }) => {
                console.log(data)
            })
        }
    },
    mutations: {
        UPDATE(state, data) {
            state.posts = data.posts;
            console.log("updated post-list:", data.posts);
            state.total = data.total;
            console.log("updated posts total:", data.total);
            // console.log("current pageSize:", state.pageSize);
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
        total: 0, //记录总数
        // pageSize: 5, //每页显示的记录数
    },
};
export default PostModule;
