<template>
    <div class="container">
        <el-input
            placeholder="搜索"
            suffix-icon="el-icon-search"
            class="search"
            v-model="keyword"
        >
        </el-input>
        <div class="title" v-if="!posts.length">暂无收藏的帖子</div>
        <PostCard
            v-for="post in posts"
            :key="post._id"
            :post="post"
            :pageSize="pageSize"
            :currentPage="currentPage"
        ></PostCard>
        <div class="page-box">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-sizes="[5, 10, 20, 50, 100]"
                :page-size="pageSize"
                :total="favoritesTotal"
                layout="total,sizes, prev, pager, next"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
import PostCard from "../Post/Post-Card.vue";
import { mapState, mapActions } from "vuex";
export default {
    components: {
        PostCard,
    },
    data() {
        return {
            keyword: "",
            pageSize: 10,
            currentPage: 1,
        };
    },
    methods: {
        //使用模块化的Vuex时,用map时要在第一个参数指定模块(要开启模块的命名空间才能生效)
        ...mapActions("UserModule", ["getUser"]),
        //处理分页的两个方法
        //TODO: 页数被用户改变时
        handleSizeChange(newPageSize) {
            console.log(`每页 ${newPageSize} 条`);
            this.pageSize = newPageSize;
            this.getUser({
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                keyword: this.keyword,
            });
        },
        //页码被用户改变时
        handleCurrentChange(currentPage) {
            console.log(`当前页: ${currentPage}`);
            console.log(this.keyword);
            this.getUser({
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                keyword: this.keyword,
            });
        },
        //懒搜索
        goSearch() {
            console.log("Go to search..", this.keyword);
            this.getUser({
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                keyword: this.keyword,
            });
        },
    },
    computed: {
        ...mapState("UserModule", ["user", "publishedTotal", "favoritesTotal"]),
        posts() {
            return this.user.favorites;
        },
    },
    watch: {
        //实时搜索
        keyword(newVal) {
            //监听关键词变化
            this.getUser({
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                keyword: newVal,
            });
        },
    },
    //路由进入前先获取用户数据
    beforeRouteEnter(to, from, next) {
        //这里传回调是为了获取组件实例
        next((vm) => {
            //TODO: 卡个渲染锁
            vm.getUser();
        });
    },
};
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}
.page-box {
    margin: 20px;
}
.search {
    width: 50%;
    margin: 20px;
    height: 40px;
}
</style>
