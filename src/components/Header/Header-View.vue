<template>
    <div class="nav-container">
        <router-link to="/home" class="nav-item">首页</router-link>
        <router-link to="/post" class="nav-item">帖子</router-link>
        <router-link to="/user" class="nav-item">个人</router-link>
    </div>
</template>

<script>
export default {};
</script>

<style scoped>
.nav-container {
    background-color: #409EFF;

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
</style>
