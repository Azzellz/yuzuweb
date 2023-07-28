<template>
    <div class="login-container center">
        <div class="login-box">
            <h1 class="login-title">Yuzu</h1>
            <el-input
                placeholder="请输入账号"
                class="login-input"
                v-model="account"
            ></el-input>
            <el-input
                v-model="password"
                placeholder="密码"
                class="login-input"
                show-password
            ></el-input>
            <div class="login-button-box">
                <el-button type="primary" style="flex: 0.8" @click="login"
                    >登录</el-button
                >
                <el-button type="info" @click="toRegister">注册</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            account: "",
            password: "",
        };
    },
    methods: {
        login() {
            //先校验token是否合法
            this.$axios
                .post("/login", {
                    account: this.account,
                    password: this.password,
                })
                .then(({ data: { data } }) => {
                    console.log(data);
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user_id", data.user_id);
                    localStorage.setItem("user_name", data.user_name);
                    localStorage.setItem("user_account", data.user_account);
                    localStorage.setItem("avatar", data.avatar);
                    this.$router.replace("/home");
                    this.$message.success("登录成功");
                })
                .catch((err) => {
                    //登录失败
                    const errMsg = err.response.data.err;
                    this.$message.error(errMsg);
                    console.log(err);
                });
        },
        toRegister() {
            this.$router.push("/register");
        },
    },
    mounted() {
        //如果有token则直接跳转到home,不允许再进入登录页面
        localStorage.getItem("token") && this.$router.replace("/home");
    },
};
</script>

<style scoped>
.login-container {
    width: 100vw;
    height: 100vh;
    background: url("../../../public/beauty.jpg") fixed no-repeat;
    background-size: cover;
}
.login-container::before {
    content: "";
    position: absolute; /* 一定要用绝对定位 */
    width: 100%;
    height: 100%;
    backdrop-filter: blur(5px);
}
.login-box {
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
.login-box * {
    margin: 10px;
}
.login-input {
    width: 16rem;
}
.login-title {
    color: #3d5245;
    margin-bottom: 20px;
}
.login-button-box {
    width: 18rem;
    justify-content: space-around;
    display: flex;
}
</style>
