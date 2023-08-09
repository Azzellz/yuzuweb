<template>
    <div class="post-box">
        <h1 class="post-title">{{ post.title }}</h1>
        <h6 class="info-box">
            <template v-if="!post.isUnknown">
                <router-link
                    :to="{
                        path: '/user/other',
                        query: {
                            id: post.user._id,
                            title: post.user.user_name,
                        },
                    }"
                >
                    <el-avatar
                        :size="40"
                        :src="$avatarURL(post.user.avatar)"
                    ></el-avatar>
                </router-link>

                <div class="info-text">{{ postInfo }}</div>
            </template>
            <template v-else>
                <el-avatar icon="el-icon-user-solid" :size="40"></el-avatar>
                <div class="info-text">{{ unknownPostInfo }}</div>
            </template>

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
        <Post-Comment
            :post="post"
            :user="user"
            :isAuthor="isAuthor"
        ></Post-Comment>
    </div>
</template>

<script>
import PostComment from "./Post-Comment.vue";

export default {
    components: {
        PostComment,
    },
    props: ["post", "user", "isAuthor", "isEditing"], //接收文章id和是否为文章作者的布尔值参数和是否处于编辑模式的布尔值参数
    data() {
        return {};
    },
    computed: {
        //文章信息
        postInfo() {
            return `${this.post.user.user_name} 于 ${this.post.format_time} 发布 | 👍:${this.post.support} 👎:${this.post.oppose} | 评论数:${this.post.comments.length}`;
        },
        //匿名用户的文章信息
        unknownPostInfo() {
            return `匿名用户 于 ${this.post.format_time} 发布 | 👍:${this.post.support} 👎:${this.post.oppose} | 评论数:${this.post.comments.length}`;
        },
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
.close-tip {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
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
