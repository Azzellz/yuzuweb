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
        <Post-Comment-Edit :post="currentPost"></Post-Comment-Edit>
    </div>
</template>

<script>
import { mapActions } from "vuex";
import PostCommentEdit from "./Post-Comment-Edit.vue";
export default {
    components: {
        PostCommentEdit,
    },
    props: ["post"],
    data() {
        return {
            //props对象,可以通过引用修改
            //引用文章数据
            currentPost: this.post,
        };
    },
    computed: {
        //文章数据
        postInfo() {
            return `${this.post.user.user_name} 于 ${this.post.format_time} 发布 | 👍:${this.post.support} 👎:${this.post.oppose} | 评论数:${this.post.comments.length}`;
        },
    },
    methods: {
        ...mapActions("PostModule",["updatePost"]),
        //保存修改
        async saveEdited() {
            //保存并且结束编辑模式
            try {
                //等待更新完毕后再结束编辑模式
                await this.updatePost(this.currentPost);
                this.$bus.$emit("updateIsEditing", false);
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
