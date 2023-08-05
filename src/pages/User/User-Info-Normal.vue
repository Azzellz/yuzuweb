<template>
    <div>
        <div class="title">个人中心</div>
        <el-divider content-position="right">自己</el-divider>
        <el-card class="user-info">
            <div class="user-item">
                <el-avatar :size="100" :src="$avatarURL(user.avatar)"></el-avatar>
            </div>
            <div class="user-item">
                <div>用户名:</div>
                <div>{{ user.user_name }}</div>
            </div>
            <div class="user-item">
                <div>账号:</div>
                <div>{{ user.account }}</div>
            </div>
            <div class="btn-box">
                <el-button type="warning" style="flex: 1" @click="quitLogin"
                    >退出登录</el-button
                >
                <el-button type="danger" style="flex: 1" @click="deregistration"
                    >注销</el-button
                >
                <el-button type="primary" style="flex: 1" @click="goingEdit"
                    >编辑</el-button
                >
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    props: [ "user"],
    data() {
        return {};
    },
    methods: {
        //退出登录
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
                        offset: 80,
                    });
                    localStorage.clear(); //清空本地存储
                    this.$router.replace("/login");
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消退出登录",
                        offset: 80,
                    });
                });
        },
        //注销
        deregistration() {
            this.$confirm("此操作将永久注销当前用户, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.$axios
                        .delete(`/user?id=${localStorage.getItem("user_id")}`, {
                            headers: {
                                Authorization: localStorage.getItem("token"),
                            },
                        })
                        .then(({ data: { data } }) => {
                            localStorage.clear(); //清空本地存储
                            this.$router.replace("/login"); //导航至登录页面
                            console.log(data);
                            this.$message({
                                type: "success",
                                message: "注销成功!",
                                offset: 80,
                            });
                        })
                        .catch((err) => {
                            this.$message({
                                type: "danger",
                                message: "注销失败",
                                offset: 80,
                            });
                            console.log(err);
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消注销",
                        offset: 80,
                    });
                });
        },
        //修改用户信息
        goingEdit() {
            //修改父组件传来的isEditing值
            this.$emit("update:isEditing", true);
            this.$message({
                type: "success",
                message: "进入编辑模式!",
                offset: 80,
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
.btn-box {
    display: flex;
}
</style>
