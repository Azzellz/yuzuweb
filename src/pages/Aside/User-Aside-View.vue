<template>
    <div class="container">
        <el-menu
            background-color="#434343"
            active-text-color="#fff"
            text-color="black"
            style="border: none"
            router
            default-active="/user/info"
        >
            <el-menu-item index="/user/info">
                <i class="el-icon-location"></i>
                <span>个人</span>
            </el-menu-item>
            <el-menu-item index="/user/friends">
                <i class="el-icon-location"></i>
                <span>好友</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
export default {};
</script>

<style scoped>
.container {
    width: 100px;
    background-color: #434343;
    font-weight: bold;
}
</style>
