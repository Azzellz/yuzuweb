<template>
    <div class="post-box">
        <h1 class="post-title">{{ post.title }}</h1>
        <h6 class="info-box">
            <el-avatar :size="40" :src="$avatarURL(post.avatar)"></el-avatar>
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
        <el-divider>内容</el-divider>
        <el-card class="content-box">{{ post.content }}</el-card>
        <el-divider>评论</el-divider>
        <el-card class="comment-container">
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
                <el-button type="success" @click="supportPost">👍</el-button>
                <el-button type="danger" @click="opposePost">👎</el-button>
                <el-button
                    v-if="!isFavorite"
                    type="warning"
                    icon="el-icon-star-off"
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
                    >编辑</el-button
                >
            </div>
            <el-divider></el-divider>
            <div class="comment-display-box">
                <el-card
                    v-for="(comment, index) in post.comments"
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
                    </div>
                </el-card>
            </div>
        </el-card>
    </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
    data() {
        return {
            comment: "",
        };
    },
    computed: {
        postInfo() {
            return `${this.post.user_name} 于 ${this.post.format_time} 发布 | 👍:${this.post.support} 👎:${this.post.oppose} | 评论数:${this.post.comments.length}`;
        },
        getOption(){
            return {
                pageSize:this.pageSize,
                currentPage:this.currentPage,
            }
        },
        isFavorite() {
            //如果favorites中含有当前post,则返回true,否则返回false
            return (
                this.user.favorites.filter((post) => post._id === this.post._id)
                    .length !== 0
            );
        },
    },
    methods: {
        ...mapActions("PostModule", ["getPosts"]),
        ...mapActions("UserModule", ["getUser"]),
        publishComment() {
            //应该发布后刷新一次界面让Vuex能获取到最新的值
            if (!this.comment) return this.$message.error("评论不能为空");
            //要求内容：post_id,comment_id(由前端自己生成),user_id,user_name,avatar,content
            const comment = {
                post_id: this.post._id,
                comment_id: this.$nanoid(),
                user_id: localStorage.getItem("user_id"),
                user_name: localStorage.getItem("user_name"),
                avatar: localStorage.getItem("avatar"),
                content: this.comment,
            };
            this.$axios
                .post("/comment", comment)
                .then((res) => {
                    console.log(res);
                    //成功后调用一下更新列表的方法,根据是否为作者来决定更新哪个列表
                    this.isFromUser ? this.getUser() : this.getPosts();
                    //TODO: 这里也可以更新下用户信息,但是不知道会不会有性能问题
                    this.$message({
                        type: "success",
                        message: "评论成功",
                        offset: 80,
                    });
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
                    //更新列表
                    this.isFromUser ? this.getUser() : this.getPosts();
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
        opposePost() {
            //给帖子点踩
            this.$axios
                .post("/oppose/post", {
                    post_id: this.post._id,
                })
                .then(({ data: { data } }) => {
                    console.log(data);
                    this.$message.error("点踩成功");
                    //更新列表
                    this.isFromUser ? this.getUser() : this.getPosts();
                })
                .catch((err) => {
                    console.log(err);
                    this.$message.error("点踩失败");
                });
        },
        favoritePost() {
            //收藏帖子
            this.$axios
                .post("/favorite/post", {
                    post_id: this.post._id,
                    user_id: localStorage.getItem("user_id"),
                })
                .then(({ data: { data } }) => {
                    console.log(data);
                    this.$message({
                        type: "success",
                        message: "收藏成功",
                        offset: 80,
                    });
                    //更新用户信息以便获取最新的收藏列表
                    this.getUser(this.getOption);
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
        unfavoritePost() {
            //收藏帖子
            this.$axios
                .post("/unfavorite/post", {
                    post_id: this.post._id,
                    user_id: localStorage.getItem("user_id"),
                })
                .then(({ data: { data } }) => {
                    console.log(data);
                    this.$message.error("取消收藏成功");
                    //更新用户信息以便获取最新的收藏列表
                    this.getUser(this.getOption);
                })
                .catch((err) => {
                    console.log(err);
                    this.$message.error("取消收藏失败");
                });
        },
        goingToEditMode() {
            //触发父组件的事件更新isEditing的值为true
            this.$emit("update:isEditing", true);
            this.$message({
                type: "warning",
                message: "编辑模式开启,点击编辑按钮退出编辑模式",
                offset: 80,
            });
        },
    },
    props: [
        "post",
        "user",
        "isAuthor",
        "isEditing",
        "isFromUser",
        "currentPage",
        "pageSize",
    ], //接收文章id和是否为文章作者的布尔值参数和是否处于编辑模式的布尔值参数
    created() {
        console.log(this.getOption)
    },
};
</script>

<style scoped>
.post-box {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.content-box {
    white-space: pre-line;
    width: 80%;
    min-height: 600px;
    overflow: hidden;
}

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
.post-title {
    text-align: center;
    line-height: 60px;
    min-width: 100px;
    border-bottom: 1px solid #ccc;
    font-weight: bold;
    margin: 30px;
}
</style>
