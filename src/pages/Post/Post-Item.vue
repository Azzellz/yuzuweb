<template>
    <span>
        <PostItemNormal
            v-if="!isEditing"
            :post="postWithFlag.post"
            :user="user"
            :isAuthor="isAuthor"
            :isEditing.sync="isEditing"
            @updateState="confirmUpdate"
        ></PostItemNormal>
        <PostItemEdit
            v-else
            :post="postWithFlag.post"
            :user="user"
            :isEditing.sync="isEditing"
            @updateState="confirmUpdate"
        ></PostItemEdit>
    </span>
</template>

<script>
import { mapActions, mapState } from "vuex";
import PostItemNormal from "./Post-Item-Normal.vue";
import PostItemEdit from "./Post-Item-Edit.vue";
export default {
    components: {
        PostItemNormal,
        PostItemEdit,
    },
    props: ["id", "currentPage", "pageSize"], //获取post的id,当前页数,每页数量
    data() {
        return {
            isAuthor: false, //判断是否为文章作者,如果是作者那么进入编辑页面
            isEditing: false, //判断是否在编辑状态
        };
    },
    computed: {
        ...mapState("PostModule", ["posts", "lastestPosts"]), //通过getter获取posts
        ...mapState("UserModule", ["user"]), //通过getter获取favorites
        //获取文章的选项
        getOption() {
            return {
                pageSize: this.pageSize,
                currentPage: this.currentPage,
                keyword: "",
            };
        },
        //从当前用户中找或是从所有文章中找
        postWithFlag() {
            const postFromPosts = this.posts.find(
                (post) => post._id === this.id
            );
            if (postFromPosts) {
                return {
                    post: postFromPosts,
                    from: this.$enum.POST_FROM.LIST_POSTS,
                };
            }
            const postFromUserPublished = this.user.published.find(
                (post) => post._id === this.id
            );
            if (postFromUserPublished) {
                return {
                    post: postFromUserPublished,
                    from: this.$enum.POST_FROM.USER_POSTS,
                };
            }
            const postFromUserFavorites = this.user.favorites.find(
                (post) => post._id === this.id
            );
            if (postFromUserFavorites) {
                return {
                    post: postFromUserFavorites,
                    from: this.$enum.POST_FROM.USER_POSTS,
                };
            }
            const postFromLastestPosts = this.lastestPosts.find(
                (post) => post._id === this.id
            );
            if (postFromLastestPosts) {
                return {
                    post: postFromLastestPosts,
                    from: this.$enum.POST_FROM.LASTEST_POSTS,
                };
            }
            return undefined;
        },
    },
    methods: {
        ...mapActions("PostModule", ["getPosts", "getLastestPosts"]),
        ...mapActions("UserModule", ["getUser"]),
        async confirmUpdate() {
            //枚举判断来源
            switch (this.postWithFlag.from) {
                case this.$enum.POST_FROM.USER_POSTS:
                    await this.getUser(this.getOption);
                    break;
                case this.$enum.POST_FROM.LIST_POSTS:
                    await this.getPosts(this.getOption);
                    break;
                case this.$enum.POST_FROM.LASTEST_POSTS:
                    await this.getLastestPosts(this.getOption);
                    break;
                default:
                    //全部更新一遍
                    await Promise.all([
                        this.getUser(this.getOption),
                        this.getPosts(this.getOption),
                        this.getLastestPosts(this.getOption),
                    ]);
                    break;
            }
        },
    },
    created() {

        //先判断当前文章是否存在,不存在直接返回到list路由
        if (!this.postWithFlag) {
            this.$message({
                type: "error",
                message: "当前文章不存在",
                offset: 80,
            });
            return this.$router.replace("/post/list");
        }
        //判断当前用户是否为文章作者
        //如果是则开启编辑模式
        if (this.postWithFlag.post.user._id === this.user._id) {
            this.isAuthor = true;
        }
        //绑定全局事件
        this.$bus.$on("updateState", this.confirmUpdate);
        this.$bus.$on("updateIsEditing", (isEditing) => {
            console.log(isEditing)
            this.isEditing = isEditing;
        });
    },
    beforeDestroy() {
        //解绑全局事件
        this.$bus.$off("updateState");
        this.$bus.$off("updateIsEditing");
    },
};
</script>

<style scoped></style>
