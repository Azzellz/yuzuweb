<template>
    <div class="center">
        <div class="title">发布</div>
        <el-divider></el-divider>
        <el-input
            v-model="post.title"
            placeholder="请输入标题"
            style="width: 20%"
        ></el-input>
        <div class="tag-box">
            <el-tag
                v-for="tag in post.tags"
                :key="tag"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
            >
                {{ tag }}
            </el-tag>
            <el-input
                class="input-new-tag"
                v-if="showInput"
                v-model="tagValue"
                ref="saveTagInput"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
                size="small"
            ></el-input>
            <el-button
                v-else
                @click="showInputBtn"
                size="small"
                class="button-new-tag"
                >+标签</el-button
            >
        </div>
        <el-input
            type="textarea"
            :autosize="{ minRows: 25 }"
            v-model="post.content"
            placeholder="请输入内容"
            style="width: 75%"
        ></el-input>
        <div class="publish-box">
            <el-button type="primary" @click="publish">发布</el-button>
            <el-checkbox v-model="meta.isShowContent" style="margin: 10px 20px"
                >发布后展示内容</el-checkbox
            >
            <el-checkbox v-model="meta.isCommentable" style="margin: 10px 10px"
                >开启评论区</el-checkbox
            >
            <el-checkbox v-model="meta.isUnknown" style="margin: 10px 10px"
                >匿名发布</el-checkbox
            >
        </div>
    </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
    data() {
        return {
            post: {
                title: "",
                content: "",
                comments: [],
                support: 0,
                oppose: 0,
                follow:0,
                tags: [],
            },
            meta: {
                isShowContent: false, //发布后在列表是否展示文章内容
                isCommentable: true, //是否允许评论
                isUnknown: false, //是否匿名发布
            },
            tagValue: "",
            showInput: false,
        };
    },
    methods: {
        ...mapActions("PostModule", ["getPosts"]),
        publish() {
            //检测内容是否为空
            if (!this.post.title || !this.post.content) {
                this.$message({
                    showClose: true,
                    message: "标题或内容不能为空",
                    type: "error",
                });
                return;
            }
            //发送post请求
            this.$axios
                .post("/post", {
                    post: {
                        ...this.post,
                        ...this.meta,
                    }, //封装post对象
                    user_id: localStorage.getItem("user_id"), //发送当前用户id
                })
                .then(({ data }) => {
                    console.log(data);
                    this.getPosts(); //更新文章列表
                    this.$message({
                        showClose: true,
                        message: data.msg,
                        type: "success",
                        offset: 80,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    this.$message({
                        showClose: true,
                        message: "发布失败",
                        type: "danger",
                        offset: 80,
                    });
                });
        },
        showInputBtn() {
            this.showInput = true;
            this.$nextTick(() => {
                this.$refs.saveTagInput.$refs.input.focus(); //获取焦点
            });
        },
        handleClose(tag) {
            this.post.tags.splice(this.post.tags.indexOf(tag), 1);
        },
        handleInputConfirm() {
            //添加标签
            let tagValue = this.tagValue;
            if (tagValue) {
                this.post.tags.push(tagValue);
            }
            this.showInput = false;
            this.tagValue = "";
        },
    },
};
</script>

<style scoped>
.tag-box {
    display: flex;
    margin: 10px;
}

.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}

.publish-box {
    display: flex;
    margin: 20px;
}
</style>
