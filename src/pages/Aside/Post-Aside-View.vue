<template>
    <div class="container">
        <el-menu
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            style="border: none"
            router
            default-active="/post/list"
        >
            <el-menu-item index="/post/list">
                <i class="el-icon-location"></i>
                <span slot="title">最近</span>
            </el-menu-item>
            <el-menu-item index="/post/publish">
                <i class="el-icon-edit"></i>
                <span slot="title">发布</span>
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
    background-color: #545c64;
    font-weight: bold;
}
</style>
