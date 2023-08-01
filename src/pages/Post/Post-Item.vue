<template>
    <span>
        <PostItemNormal
            v-if="!isEditing"
            :post="postWithFlag.post"
            :user="user"
            :pageSize="pageSize"
            :currentPage="currentPage"
            :isAuthor="isAuthor"
            :isFromUser="postWithFlag.isFromUser"
            :isEditing.sync="isEditing"
        ></PostItemNormal>
        <PostItemEdit
            v-else
            :post="postWithFlag.post"
            :user="user"
            :isEditing.sync="isEditing"
            :isFromUser="postWithFlag.isFromUser"
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
        ...mapState("PostModule", ["posts"]), //通过getter获取posts
        ...mapState("UserModule", ["user"]), //通过getter获取favorites
        postWithFlag() {
            //从当前用户中找或是从所有文章中找
            return this.posts.find((post) => post._id === this.id)
                ? {
                      post: this.posts.find((post) => post._id === this.id),
                      isFromUser: false,
                  }
                : {
                      post: this.user.published.find(
                          (post) => post._id === this.id
                      )
                          ? this.user.published.find(
                                (post) => post._id === this.id
                            )
                          : this.user.favorites.find(
                                (post) => post._id === this.id
                            ),
                      isFromUser: true,
                  };
        },
    },
    methods: {
        ...mapActions("UserModule", ["getUser"]), //通过action获取posts
    },
    props: ["id", "currentPage", "pageSize"], //获取post的id
    created() {
        //判断当前用户是否为文章作者
        //如果是则开启编辑模式
        if (this.postWithFlag.post.user_id === this.user._id) {
            this.isAuthor = true;
            // console.log("Hey!current custom is author!allow to edit mode");
        }
        if (this.postWithFlag.isFromUser) {
            // console.log("Hey!current custom is from user page!");
        } else {
            // console.log("Hey!current custom is from post list page!");
        }

    },
};
</script>

<style scoped></style>
