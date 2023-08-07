<template>
    <span>
        <PostItemNormal
            v-if="!isEditing"
            :post="postWithFlag.post"
            :user="user"
            :pageSize="pageSize"
            :currentPage="currentPage"
            :isAuthor="isAuthor"
            :from="postWithFlag.from"
            :isEditing.sync="isEditing"
        ></PostItemNormal>
        <PostItemEdit
            v-else
            :post="postWithFlag.post"
            :user="user"
            :isEditing.sync="isEditing"
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
    data() {
        return {
            isAuthor: false, //判断是否为文章作者,如果是作者那么进入编辑页面
            isEditing: false, //判断是否在编辑状态
        };
    },
    computed: {
        ...mapState("PostModule", ["posts", "lastestPosts"]), //通过getter获取posts
        ...mapState("UserModule", ["user"]), //通过getter获取favorites
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
        ...mapActions("UserModule", ["getUser"]), //通过action获取posts
    },
    props: ["id", "currentPage", "pageSize"], //获取post的id
    created() {
        //判断当前用户是否为文章作者
        //如果是则开启编辑模式
        if (this.postWithFlag.post.user._id === this.user._id) {
            this.isAuthor = true;
        }
    },
};
</script>

<style scoped></style>
