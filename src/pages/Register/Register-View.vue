<template>
    <div class="container center">
        <div class="box">
            <h1 class="title">Yuzu</h1>
            <!-- 头像 -->
            <el-upload
                class="avatar-uploader"
                action="http://127.0.0.1:4000/register"
                ref="upload"
                :data="{
                    user_name,
                    account,
                    password,
                }"
                name="avatar"
                :show-file-list="false"
                :on-error="handleAvatarError"
                :on-change="showAvatar"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :auto-upload="false"
            >
                <img v-if="imgUrl" :src="imgUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-input
                maxlength="8"
                minlength="1"
                show-word-limit
                placeholder="请输入用户名"
                class="input"
                v-model="user_name"
            ></el-input>
            <el-input
                maxlength="14"
                minlength="6"
                show-word-limit
                placeholder="请输入账号"
                class="input"
                v-model="account"
            ></el-input>
            <el-input
                v-model="password"
                minlength="6"
                placeholder="密码"
                class="input"
                show-password
            ></el-input>
            <div class="button-box">
                <el-button type="primary" style="flex: 0.8" @click="register"
                    >注册</el-button
                >
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user_name: "",
            account: "",
            password: "",
            imgUrl: "",
        };
    },
    methods: {
        //检查用户是否已经完成信息填写
        check() {
            if (!this.imgUrl) this.$message.error("请上传头像");
            else if (!this.user_name) this.$message.error("用户名不得为空");
            else if (this.account.length < 6)
                this.$message.error("账号长度不得小于6位");
            else if (this.password.length < 6)
                this.$message.error("密码长度不得小于6位");
            else return true;
        },
        //注册
        register() {
            //检查用户是否已经完成信息填写
            if (this.check()) this.$refs.upload.submit();
        },
        //展示上传的头像
        showAvatar(file) {
            this.imgUrl = URL.createObjectURL(file.raw);
        },
        //处理注册成功
        handleAvatarSuccess({ data }) {
            console.log(data);
            //向本地存储加东西
            localStorage.setItem("avatar", data.avatar);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user_id", data._id); //这里要用_id
            localStorage.setItem("user_name", data.user_name);
            localStorage.setItem("user_account", data.account);
            //跳转至home
            this.$router.replace("/home"); //这里提示要放路由跳转后面,不然有延迟很难看
            this.$message({
                type: "success",
                message: "注册成功",
                offset: 80,
            });
        },
        handleAvatarError() {
            this.$message.error("用户名或账号已存在");
        },
        //上传头像之前的校验
        beforeAvatarUpload(file) {
            //限制文件类型和大小
            const isJPG =
                file.type === "image/jpeg" || file.type === "image/png";
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
            }
            if (!isLt2M) {
                this.$message.error("上传头像图片大小不能超过 2MB!");
            }
            return isJPG && isLt2M;
        },
    },
    mounted() {
        //如果有token则直接跳转到home,不允许再进入注册页面
        localStorage.getItem("token") && this.$router.replace("/home");
    },
};
</script>

<style scoped>
.container {
    width: 100vw;
    height: 100vh;
    background: url("../../../public/beauty.jpg") fixed no-repeat;
    background-size: cover;
}
.container::before {
    content: "";
    position: absolute; /* 一定要用绝对定位 */
    width: 100%;
    height: 100%;
    backdrop-filter: blur(5px);
}
.box {
    padding: 50px 80px;
    border: none;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.box * {
    margin: 10px;
}
.input {
    width: 16rem;
}
.title {
    color: #3d5245;
    margin-bottom: 20px;
}
.button-box {
    width: 18rem;
    justify-content: space-around;
    display: flex;
}

.avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader:hover {
    border-color: #409eff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
