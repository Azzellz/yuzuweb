<template>
    <div class="center">
        <div class="title">发布</div>
        <el-divider></el-divider>
        <el-input
            v-model="postTitle"
            placeholder="请输入标题"
            style="width: 20%"
        ></el-input>
        <div class="tag-box">
            <el-tag
                v-for="tag in tags"
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
            v-model="postContent"
            placeholder="请输入内容"
            style="width: 75%"
        ></el-input>
        <div class="publish-box">
            <el-button type="primary" @click="publish">发布</el-button>
            <el-checkbox v-model="isShowContent" style="margin: 10px 20px"
                >发布后展示内容</el-checkbox
            >
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            postTitle: "",
            postContent: "",
            tags: [],
            tagValue: "",
            isShowContent: false, //发布后在列表是否展示文章内容
            showInput: false,
        };
    },
    computed: {
        user_name() {
            return localStorage.getItem("user_name");
        },
        user_id() {
            return localStorage.getItem("user_id");
        },
        avatar() {
            return localStorage.getItem("avatar");
        },
    },
    methods: {
        publish() {
            //检测内容是否为空
            if (!this.postTitle || !this.postContent) {
                this.$message({
                    showClose: true,
                    message: "标题或内容不能为空",
                    type: "error",
                });
                return;
            }
            //发送post请求
            this.$axios
                .post("http://127.0.0.1:4000/post", {
                    user_id: this.user_id,
                    user_name: this.user_name,
                    avatar: this.avatar,
                    title: this.postTitle,
                    content: this.postContent,
                    isShowContent: this.isShowContent,
                    comments:[],//评论,初始为空数组
                    support: 0, //点赞数
                    oppose: 0, //点踩数
                    tags: this.tags, //标签
                })
                .then(({ data }) => {
                    console.log(data);
                    this.$message({
                        showClose: true,
                        message: data.msg,
                        type: "success",
                    });
                })
                .catch((err) => {
                    console.log(err);
                    this.$message.error("发布失败");
                });
        },
        showInputBtn() {
            this.showInput = true;
            this.$nextTick(() => {
                this.$refs.saveTagInput.$refs.input.focus(); //获取焦点
            });
        },
        handleClose(tag) {
            this.tags.splice(this.tags.indexOf(tag), 1);
        },
        handleInputConfirm() {
            //添加标签
            let tagValue = this.tagValue;
            if (tagValue) {
                this.tags.push(tagValue);
            }
            this.showInput = false;
            this.tagValue = "";
        },
    },
    mounted() {},
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
