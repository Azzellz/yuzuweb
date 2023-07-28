<template>
    <!-- 旧导航栏 -->
    <!-- <div class="nav-container">
        <router-link to="/home" class="nav-item">首页</router-link>
        <router-link to="/post" class="nav-item">帖子</router-link>
        <router-link to="/user" class="nav-item">个人</router-link>
    </div> -->
    
    <!-- 新导航栏 -->
    <el-menu
        :default-active="activeIndex"
        class="container"
        mode="horizontal"
        :router="true"
        @select="handleSelect"
        background-color="#fff"
        text-color="#000"
        active-text-color="#ffd04b"
    >
        <el-menu-item index="/home">首页</el-menu-item>
        <el-menu-item index="/post/list">帖子</el-menu-item>
        <el-menu-item index="/user/info">个人</el-menu-item>
    </el-menu>
</template>

<script>
export default {
    data() {
        return {
            activeIndex: "/home",
        };
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },
    },
};
</script>

<style scoped>
.nav-container {
    background-color: #000000;

    color: #fff;
    height: 50px;
    line-height: 50px;
    text-align: center;
    display: flex;
    justify-content: center;
}
.nav-item {
    margin: 0 25px;
    color: #fff;
    text-decoration: none;
}
.nav-item:hover {
    color: rgb(199, 199, 199);
}
.container {
    width: 100%;
    z-index: 10000;
    position: fixed;
    display: flex;
    justify-content: center;
    font-weight: bold;
}
</style>
