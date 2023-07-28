<template>
    <span>
        <PostItemNormal v-if="!isEditing" :post="post" :user="user" :isAuthor="isAuthor" :isEditing.sync="isEditing"></PostItemNormal>
        <PostItemEdit v-else :post="post" :user="user" :isEditing.sync="isEditing"></PostItemEdit>
    </span>
</template>

<script>
import { mapState } from "vuex";
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
        post() {
            //从当前用户中找或是从所有文章中找
            return this.posts.find((post) => post._id === this.id) || this.user.published.find((post) => post._id === this.id);
        },
    },
    props: ["id"],//获取post的id
    created() {
        //判断当前用户是否为文章作者
        //如果是则开启编辑模式
        if (this.post.user_id === this.user._id) {
            this.isAuthor = true;
            console.log("Hey!current custom is author!allow to edit mode");
        }
        
    },
};
</script>

<style scoped>
</style>
