<template>
    <div>
        <div class="title">个人中心</div>
        <el-divider content-position="right">自己</el-divider>
        <el-card class="user-info">
            <div class="user-item">
                <el-avatar :size="100" :src="$avatarURL(currentUser.avatar)"></el-avatar>
            </div>
            <div class="user-item">
                <el-input
                    v-model="currentUser.user_name"
                    placeholder="用户名"
                    maxlength="8"
                    show-word-limit
                ></el-input>
            </div>
            <div class="btn-box">
                <el-button type="danger" @click="save">保存</el-button>
            </div>
            
        </el-card>
    </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
    props: ["isEditing", "user"],
    data() {
        return {
            currentUser: this.user,
        };
    },
    methods: {
        ...mapActions("UserModule", ["updateUser", "getUser"]),
        //同步本地存储
        updateLocalStroage() {
            localStorage.setItem("user_name", this.user.user_name);
        },
        //检查编辑输入
        checkInput() {
            if (this.currentUser.user_name.trim() === "") {
                this.$message({
                    type: "error",
                    message: "用户名不能为空!",
                    offset: 80,
                });
                return false;
            } else if(this.currentUser.user_name.trim()===this.user.user_name) {
                //用户信息未被修改
                this.$message({
                    type: "success",
                    message: "保存成功!",
                    offset: 80,
                });
                this.$emit("update:isEditing", false);
                return false;
            }else{
                return true;
            }
        },
        async save() {
            //检查输入
            if (!this.checkInput()) return;
            try {
                //更新用户信息
                await this.updateUser(this.currentUser);
                //刷新用户信息
                await this.getUser();
                //同步本地存储
                this.updateLocalStroage();
                //退出编辑状态
                this.$emit("update:isEditing", false);
                //弹窗提示
                this.$message({
                    type: "success",
                    message: "保存成功!",
                    offset: 80,
                });
            } catch ({response: {data: {err}}}) {
                this.$message({
                    type: "error",
                    message: err,
                    offset: 80,
                });
            }
        },
    },
    created() {
        //删除不需要的字段
        delete this.currentUser.published;
        delete this.currentUser.favorites;
    },
};
</script>

<style scoped>
.user-info {
    display: flex;
    flex-direction: column;
    width: 80%;
    min-height: 500px;
    margin: 0 auto;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
}
.user-item {
    margin: 30px;
    display: flex;
    justify-content: center;
    font-size: 30px;
    font-weight: bold;
}
.btn-box {
    display: flex;
    justify-content: center;
}
</style>
