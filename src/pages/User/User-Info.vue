<template>
    <div>
        <div class="title">个人中心</div>
        <el-divider content-position="right">自己</el-divider>
        <el-card class="user-info">
            <div class="user-item">
                <el-avatar :size="100" :src="$avatarURL(avatar)"></el-avatar>
            </div>
            <div class="user-item">
                <div>用户名:</div>
                <div>{{ userName }}</div>
            </div>
            <div class="user-item">
                <div>账号:</div>
                <div>{{ userAccount }}</div>
            </div>
            <el-button type="danger" class="quit-btn" @click="quitLogin"
                >退出登录</el-button
            >
        </el-card>
    </div>
</template>

<script>
export default {
    computed: {
        userAccount() {
            return localStorage.getItem("user_account");
        },
        userName() {
            return localStorage.getItem("user_name");
        },
        avatar(){
            return localStorage.getItem("avatar");
        }
    },
    methods: {
        quitLogin() {
            this.$confirm("此操作将退出登录, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.$message({
                        type: "success",
                        message: "退出登录!",
                        offset:80
                    });
                    localStorage.clear();//清空本地存储
                    this.$router.replace("/login");
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消退出登录",
                        offset:80
                    });
                });
        },
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
.quit-btn {
    width: 100%;
}
</style>
