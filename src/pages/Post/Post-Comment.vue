<template>
    <el-card class="comment-container" v-if="post.isCommentable">
        <div class="comment-edit-box">
            <el-input
                type="textarea"
                maxlength="100"
                show-word-limit
                class="comment-input"
                v-model="comment"
                @keydown.enter.native="publishComment"
                placeholder="添加评论(回车发布评论,最多100个字)"
            ></el-input>
            <el-button
                type="primary"
                icon="el-icon-check"
                style="margin-right: 30px"
                @click="publishComment"
            ></el-button>
            <el-button type="success" @click="supportPost" plain>👍</el-button>
            <el-button type="danger" @click="opposePost" plain>👎</el-button>
            <el-button
                v-if="!isFavorite"
                type="warning"
                icon="el-icon-star-off"
                plain
                @click="favoritePost"
            ></el-button>
            <el-button
                v-else
                type="warning"
                icon="el-icon-star-on"
                @click="unfavoritePost"
            ></el-button>
            <el-button
                type="primary"
                v-if="isAuthor"
                @click="goingToEditMode"
                plain
                >编辑</el-button
            >
        </div>
        <el-divider></el-divider>
        <div class="comment-display-box">
            <Post-Comment-Card
                v-for="(comment, index) in post.comments"
                :key="comment._id"
                :comment="comment"
                :index="index"
            ></Post-Comment-Card>
        </div>
    </el-card>
    <div v-else class="close-tip">
        <h1>作者已关闭评论区</h1>
        <el-button
            type="primary"
            v-if="isAuthor"
            @click="openComment"
            style="margin: 20px"
            >重新开启</el-button
        >
    </div>
</template>

<script>
import { mapActions } from "vuex";
import PostCommentCard from "./Post-Comment-Card.vue";
export default {
    name: "Post-Comment",
    components: {
        PostCommentCard,
    },
    props: ["post","user", "isAuthor"],
    data() {
        return {
            // currentPost: this.post, //引用当前文章
            comment: "",
            isFavorite: false,
        };
    },
    methods: {
        ...mapActions("PostModule", ["updatePost"]),
        //发表评论
        publishComment() {
            if (!this.comment) return this.$message.error("评论不能为空");
            //要求内容：post(id),user(id),user_name,avatar,content
            const comment = {
                post: this.post._id,
                user: this.user._id,
                content: this.comment,
                support: 0,
                oppose: 0,
            };
            //给服务器发送评论请求
            //TODO: 这里可以做个评论区校验,防止用户恶意评论
            this.$axios
                .post("/comment", comment)
                .then((res) => {
                    console.log(res);
                    //根据不同数据源更新不同的数据
                    //this.confirmUpdate();
                    //调用父组件的更新状态方法
                    this.$bus.$emit("updateState");
                    //TODO: 这里也可以更新下用户信息,但是不知道会不会有性能问题
                    this.$message({
                        type: "success",
                        message: "评论成功",
                        offset: 80,
                    });
                    //重置评论输入框内容
                    this.comment = "";
                })
                .catch((err) => {
                    console.log(err);
                    //提示失败
                    this.$message({
                        type: "error",
                        message: "评论失败",
                        offset: 80,
                    });
                });
        },
        //给帖子点赞
        supportPost() {
            //给帖子点赞
            this.$axios
                .post("/support/post", {
                    post_id: this.post._id,
                })
                .then(({ data: { data } }) => {
                    console.log(data);
                    this.$message({
                        type: "success",
                        message: "点赞成功",
                        offset: 80,
                    });
                    //调用父组件的更新状态方法
                    this.$bus.$emit("updateState");
                })
                .catch((err) => {
                    console.log(err);
                    this.$message({
                        type: "error",
                        message: "点赞失败",
                        offset: 80,
                    });
                });
        },
        //给帖子点踩
        opposePost() {
            //给帖子点踩
            this.$axios
                .post("/oppose/post", {
                    post_id: this.post._id,
                })
                .then(({ data: { data } }) => {
                    console.log(data);
                    this.$message({
                        type: "success",
                        message: "点踩成功",
                        offset: 80,
                    });
                    //调用父组件的更新状态方法
                    this.$bus.$emit("updateState");
                })
                .catch((err) => {
                    console.log(err);
                    this.$message({
                        type: "error",
                        message: "点踩失败",
                        offset: 80,
                    });
                });
        },
        //收藏帖子
        favoritePost() {
            //收藏帖子
            this.$axios
                .post("/favorite/post", {
                    post_id: this.post._id,
                    user_id: localStorage.getItem("user_id"),
                })
                .then(({ data: { data } }) => {
                    console.log("收藏成功", data);
                    this.$message({
                        type: "success",
                        message: "收藏成功",
                        offset: 80,
                    });
                    this.isFavorite = true;
                })
                .catch((err) => {
                    console.log(err);
                    this.$message({
                        type: "error",
                        message: "收藏失败",
                        offset: 80,
                    });
                });
        },
        //取消收藏帖子
        unfavoritePost() {
            //取消收藏帖子
            this.$axios
                .post("/unfavorite/post", {
                    post_id: this.post._id,
                    user_id: localStorage.getItem("user_id"),
                })
                .then(({ data: { data } }) => {
                    console.log("取消收藏", data);
                    this.$message({
                        type: "success",
                        message: "取消收藏成功",
                        offset: 80,
                    });
                    //更新用户信息以便获取最新的收藏列表
                    this.isFavorite = false;
                })
                .catch((err) => {
                    console.log(err);
                    this.$message({
                        type: "error",
                        message: "取消收藏失败",
                        offset: 80,
                    });
                });
        },
        //进入编辑模式,切换组件
        goingToEditMode() {
            //触发父组件的事件更新isEditing的值为true
            // this.$emit("update:isEditing", true);
            this.$bus.$emit("updateIsEditing", true);
            this.$message({
                type: "warning",
                message: "编辑模式开启,点击保存后修改生效",
                offset: 80,
            });
        },
        //开启评论区
        async openComment() {
            let newPost = this.post;
            newPost.isCommentable = true;
            //更新帖子
            await this.updatePost(newPost);
            this.$message({
                type: "success",
                message: "评论区开启成功",
                offset: 80,
            });
        },
    },
    created() {
        //获取文章的收藏状态
        this.$axios
            .post("/user/isfavorite", {
                user_id: localStorage.getItem("user_id"),
                post_id: this.post._id,
            })
            .then(({ data: { data } }) => {
                this.isFavorite = data;
            })
            .catch((err) => {
                console.log(err);
            });
    },
};
</script>

<style scoped>
.comment-container {
    width: 80%;
    margin-bottom: 20px;
}
.comment-input {
    width: 80%;
}
.comment-edit-box {
    display: flex;
    margin: 20px;
}
.comment-edit-box * {
    margin: 0 10px;
}
.close-tip {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
}
</style>
