<template>
    <el-card shadow="hover" style="margin: 20px">
        <div class="comment-line">
            <div class="comment-user-info">
                <router-link
                    :to="{
                        path: '/user/other',
                        query: {
                            id: comment.user._id,
                            title: comment.user.user_name,
                        },
                    }"
                >
                    <el-avatar
                        :size="50"
                        :src="$avatarURL(comment.user.avatar)"
                    ></el-avatar>
                </router-link>

                <div>{{ comment.user.user_name }}</div>
            </div>
            <div class="comment-content">{{ comment.content }}</div>
            <div class="comment-meta">
                <div>{{ comment.format_time }}</div>
                <div>{{ index + 1 }} 楼</div>
                <div>
                    <el-button
                        type="success"
                        @click="supportComment(comment)"
                        plain
                        size="mini"
                        >👍:{{ comment.support }}</el-button
                    >
                    <el-button
                        type="danger"
                        @click="opposeComment(comment)"
                        plain
                        size="mini"
                        >👎:{{ comment.oppose }}</el-button
                    >
                </div>
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
</template>

<script>
export default {
    name: "Post-Comment-Card-Edit",
    props: ["comment", "index"],
    methods: {
        //给评论点赞
        supportComment(comment) {
            const comment_id = comment._id;
            const post_id = comment.post._id;
            //给评论点赞
            this.$axios
                .put("/post/comment/support", {
                    comment_id,
                    post_id,
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
        //给评论点踩
        opposeComment(comment) {
            const comment_id = comment._id;
            const post_id = comment.post._id;
            //给评论点赞
            this.$axios
                .put("/post/comment/oppose", {
                    comment_id,
                    post_id,
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
        //删除某个评论
        deleteOneComment(index) {
            //在这里触发父组件的回调函数
            this.$emit("deleteOneComment", index);
        },
        //顶置评论
        topComment(comment, currentIndex) {
            //在这里触发父组件的回调函数
            this.$emit("topComment", comment, currentIndex);
        },
    },
};
</script>

<style scoped>
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
