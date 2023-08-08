<template>
    <div class="container">
        <el-input
            class="title"
            placeholder="修改标题"
            v-model="currentPost.title"
            style="width: 20%"
        ></el-input>
        <h6 class="info-box">
            <el-avatar
                :size="40"
                :src="$avatarURL(post.user.avatar)"
            ></el-avatar>
            <div class="info-text">{{ postInfo }}</div>
            <div class="info-tags">
                <el-tag
                    v-for="(tag, index) in post.tags"
                    :key="index"
                    :disable-transitions="false"
                    style="margin: 5px"
                >
                    {{ tag }}
                </el-tag>
            </div>
        </h6>
        <el-divider>修改内容</el-divider>
        <el-input
            class="content"
            type="textarea"
            v-model="currentPost.content"
            placeholder="修改内容"
            style="width: 75%"
            :autosize="{ minRows: 25 }"
        ></el-input>
        <el-popover
            placement="top"
            width="200"
            title="保存"
            trigger="hover"
            content="保存当前修改的所有内容"
        >
            <el-button
                type="danger"
                @click="saveEdited"
                style="margin: 20px"
                slot="reference"
                >保存</el-button
            >
        </el-popover>

        <el-divider>评论区设置</el-divider>
        <el-card
            class="comment-container"
            v-if="this.currentPost.isCommentable"
        >
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
            <div class="comment-display-box">
                <el-card
                    v-for="(comment, index) in currentPost.comments"
                    :key="comment.comment_id"
                    shadow="hover"
                    style="margin: 20px"
                >
                    <div class="comment-line">
                        <div class="comment-user-info">
                            <el-avatar
                                :size="50"
                                :src="$avatarURL(comment.avatar)"
                            ></el-avatar>
                            <div>{{ comment.user_name }}</div>
                        </div>
                        <div class="comment-content">{{ comment.content }}</div>
                        <div class="comment-meta">
                            <div>{{ comment.format_time }}</div>
                            <div>{{ index + 1 }} 楼</div>
                        </div>
                        <div class="comment-operation">
                            <el-button
                                type="primary"
                                icon="el-icon-upload2"
                                @click="topComment(comment, index)"
                                style="margin: 5px"
                                >顶置</el-button
                            >
                            <el-button
                                type="danger"
                                icon="el-icon-delete"
                                @click="deleteOneComment(index)"
                                style="margin: 5px"
                                >删除</el-button
                            >
                        </div>
                    </div>
                </el-card>
            </div>
        </el-card>
    </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
    props: ["id", "post", "user", "isEditing", "from"],
    data() {
        return {
            //引用文章数据
            currentPost: this.post,
        };
    },
    computed: {
        //文章数据
        postInfo() {
            return `${this.post.user.user_name} 于 ${this.post.format_time} 发布 | 👍:${this.post.support} 👎:${this.post.oppose} | 评论数:${this.post.comments.length}`;
        },
        getOption() {
            return {
                pageSize: this.pageSize,
                currentPage: this.currentPage,
                keyword: "",
            };
        },
    },
    methods: {
        ...mapActions("PostModule", ["getPosts", "updatePost", "deletePost"]),
        ...mapActions("UserModule", ["getUser"]),
        //比较来源后更新不同数据源
        async confirmUpdate() {
            //枚举判断来源
            switch (this.from) {
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
        //保存修改
        async saveEdited() {
            //保存并且结束编辑模式
            try {
                await this.updatePost(this.currentPost);
                this.$emit("update:isEditing", false);
                this.$message({
                    type: "success",
                    message: "保存成功",
                    offset: 80,
                });
            } catch (err) {
                console.log(err);
                this.$message({
                    type: "error",
                    message: "保存失败,请重试",
                    offset: 80,
                });
            }
        },
        //删除当前文章
        async deleteCurrentPost() {
            try {
                await this.deletePost(this.currentPost._id);
                this.confirmUpdate();
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
        closeComment() {
            this.currentPost.isCommentable = false;
        },
    },
};
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.title {
    text-align: center;
    line-height: 60px;
    min-width: 100px;
    margin: 30px;
}
.content {
    white-space: pre-line;
    width: 80%;
    overflow: hidden;
}

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
.info-box {
    color: grey;
    display: flex;
}
.info-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 10px;
}

.info-tags {
    display: flex;
    margin-left: 10px;
}
</style>
