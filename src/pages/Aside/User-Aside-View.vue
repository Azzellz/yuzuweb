<template>
    <div class="container">
        <el-menu
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            style="border: none"
            router
            :default-active="activeIndex"
        >
            <el-menu-item index="/user/info">
                <i class="el-icon-tickets"></i>
                <span>资料</span>
            </el-menu-item>
            <el-menu-item index="/user/friends">
                <i class="el-icon-s-custom"></i>
                <span>好友</span>
            </el-menu-item>
            <el-menu-item index="/user/posts">
                <i class="el-icon-chat-dot-square"></i>
                <span>帖子</span>
            </el-menu-item>
            <el-menu-item index="/user/favorites">
                <i class="el-icon-star-off"></i>
                <span slot="title">收藏</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
export default {
    data() {
        return {
            activeIndex: this.$route.path,
        };
    },
};
</script>

<style scoped>
.container {
    width: 100px;
    height: 100%;
    margin-top: 60px;
    background-color: #545c64;
    font-weight: bold;
    overflow-y: auto;
    position: fixed;
}
</style>
