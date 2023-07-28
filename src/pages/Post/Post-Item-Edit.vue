<template>
    <div class="container">
        <el-input
            class="title"
            placeholder="修改标题"
            v-model="currentPost.title"
            style="width: 20%"
        ></el-input>
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
        <el-divider>修改内容</el-divider>
        <el-input
            class="content"
            type="textarea"
            v-model="currentPost.content"
            placeholder="修改内容"
            style="width: 75%"
            :autosize="{ minRows: 25 }"
        ></el-input>
        <el-button type="danger" @click="saveEdited" style="margin:20px">保存</el-button>
        <el-divider>评论区设置</el-divider>
        <el-card class="comment-container">
            <div class="comment-setting">
                <el-button type="danger" @click="deleteAllComments">删除所有评论</el-button>
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
            //初始化空值
            currentPost:{}
        };
    },
    computed: {
        postInfo() {
            return `${this.post.user_name} 于 ${this.post.format_time} 发布 | 👍:${this.post.support} 👎:${this.post.oppose} | 评论数:${this.post.comments.length}`;
        },
    },
    methods: {
        ...mapActions("PostModule", ["getPosts","updatePost"]),
        ...mapActions("UserModule", ["getUser"]),
        saveEdited() {
            //保存并且结束编辑模式
            this.$emit("update:isEditing", false);
            this.updatePost(this.currentPost);
            this.$message({
                type: "success",
                message: "保存成功",
                offset: 80,
            });
        },
        deleteAllComments(){
            //删除所有评论
            this.currentPost.comments = [];
            this.$message({
                type: "success",
                message: "删除成功",
                offset: 80,
            });
        }
    },
    props: ["id","post","user", "isEditing"],
    created() {
        console.log("now is editing mode");
        //初始化可编辑post数据
        this.currentPost = this.post
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
