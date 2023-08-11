<template>
    <el-card class="comment-container">
        <div class="comment-setting">
            <el-popover
                placement="top"
                width="200"
                title="删除"
                trigger="hover"
                content="这将删除所有评论"
            >
                <el-button
                    type="danger"
                    @click="deleteAllComments"
                    icon="el-icon-delete"
                    slot="reference"
                    >删除所有评论</el-button
                >
            </el-popover>

            <el-popover
                placement="top"
                width="200"
                title="关闭"
                trigger="hover"
                content="这将关闭评论区"
                v-if="currentPost.isCommentable"
            >
                <el-button
                    type="danger"
                    @click="closeComment"
                    icon="el-icon-close"
                    slot="reference"
                    >关闭评论区</el-button
                >
            </el-popover>
            <el-popover
                placement="top"
                width="200"
                title="打开"
                trigger="hover"
                content="这将打开评论区"
                v-else
            >
                <el-button
                    type="primary"
                    @click="openComment"
                    icon="el-icon-check"
                    slot="reference"
                    >打开评论区</el-button
                >
            </el-popover>
            <el-popover
                placement="top"
                width="200"
                title="删除"
                trigger="hover"
                content="这将删除本篇文章"
            >
                <el-button
                    type="danger"
                    @click="deleteCurrentPost"
                    icon="el-icon-close"
                    slot="reference"
                    >删除本篇文章</el-button
                >
            </el-popover>
        </div>
        <el-divider></el-divider>
        <div>
            <Post-Comment-Card-Edit
                v-for="(comment, index) in post.comments"
                :key="comment._id"
                :comment="comment"
                :index="index"
                @deleteOneComment="deleteOneComment"
                @topComment="topComment"
            ></Post-Comment-Card-Edit>
        </div>
    </el-card>
</template>

<script>
import { mapActions } from "vuex";
import PostCommentCardEdit from "./Post-Comment-Card-Edit.vue";
export default {
    name: "Post-Comment-Edit",
    components: {
        PostCommentCardEdit,
    },
    props: ["post"],
    data() {
        return {
            currentPost: this.post, //引用当前文章,便于修改
        };
    },
    methods: {
        ...mapActions("PostModule", ["updatePost", "deletePost"]),
        //删除当前文章(不需要保存的操作,立即生效)
        async deleteCurrentPost() {
            try {
                await this.deletePost(this.currentPost._id);
                //调用父组件的更新状态方法
                this.$bus.$emit("updateState");
                //回退的上一页
                history.back();
                this.$message({
                    type: "success",
                    message: "删除成功",
                    offset: 80,
                });
            } catch (err) {
                console.log(err);
                this.$message({
                    type: "error",
                    message: "删除失败,请重试",
                    offset: 80,
                });
            }
        },
        //以下均是需要保存生效的方法
        //删除所有评论
        deleteAllComments() {
            //清空当前文章的评论
            this.currentPost.comments = [];
            this.$message({
                type: "success",
                message: "全部删除成功",
                offset: 80,
            });
        },
        //删除某个评论
        deleteOneComment(index) {
            this.$message({
                type: "success",
                message: "删除成功",
                offset: 80,
            });
            this.currentPost.comments.splice(index, 1);
        },
        //顶置评论
        topComment(comment, currentIndex) {
            this.currentPost.comments.splice(currentIndex, 1);
            this.currentPost.comments.unshift(comment);
            this.$message({
                type: "success",
                message: "顶置成功",
                offset: 80,
            });
        },
        //关闭评论区
        closeComment() {
            this.currentPost.isCommentable = false;
            this.$message({
                type: "error",
                message: "评论区关闭成功,保存后生效",
                offset: 80,
            });
        },
        //打开评论区
        openComment() {
            this.currentPost.isCommentable = true;
            this.$message({
                type: "success",
                message: "评论区打开成功,保存后生效",
                offset: 80,
            });
        },
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
.comment-setting {
    display: flex;
    margin: 20px;
}
.comment-setting * {
    margin: 0 10px;
}
.comment-line {
    display: flex;
}
.comment-user-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}
.comment-content {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-start;
    line-height: 1.5;
    margin: 0 20px;
    border-right: 1px solid #d5d5d5;
    border-left: 1px solid #d5d5d5;
    padding: 20px;
}
.comment-meta {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-weight: bold;
}
.comment-operation {
    display: flex;
    flex-direction: column;
    margin-left: 20px;
    padding: 20px;
    border-left: 1px solid #d5d5d5;
}
</style>
