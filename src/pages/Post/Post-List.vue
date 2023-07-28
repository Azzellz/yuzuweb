<template>
    <div class="container">
        <el-input
            placeholder="搜索"
            suffix-icon="el-icon-search"
            class="search"
            v-model="keyword"
        >
        </el-input>
        <!-- 用组过渡每个post -->
        <transition-group name="el-fade-in">
            <PostCard
                v-for="post in posts"
                :key="post._id"
                :post="post"
            ></PostCard>
        </transition-group>
        <div class="page-box">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-sizes="[5,10, 20, 50, 100]"
                :page-size="pageSize"
                :total="total"
                layout="total,sizes, prev, pager, next"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import PostCard from "./Post-Card.vue";
export default {
    components: {
        PostCard,
    },
    data() {
        return {
            keyword: "",
            pageSize: 10,
            currentPage:1
        };
    },
    methods: {
        //使用模块化的Vuex时,用map时要在第一个参数指定模块(要开启模块的命名空间才能生效)
        ...mapActions("PostModule", ["getPosts"]),
        //处理分页的两个方法
        //TODO: 页数被用户改变时
        handleSizeChange(newPageSize) {
            console.log(`每页 ${newPageSize} 条`);
            this.pageSize = newPageSize;
            this.getPosts({
                currentPage: this.currentPage - 1,
                pageSize: this.pageSize,
                keyword: this.keyword,
            });
        },
        //页码被用户改变时
        handleCurrentChange(currentPage) {
            console.log(`当前页: ${currentPage}`);
            console.log(this.keyword)
            this.getPosts({
                currentPage: this.currentPage - 1,
                pageSize: this.pageSize,
                keyword: this.keyword,
            });
        },
        //懒搜索
        goSearch(){
            console.log("Go to search..",this.keyword)
            this.getPosts({
                currentPage: this.currentPage - 1,
                pageSize: this.pageSize,
                keyword: this.keyword,
            });
        }
    },
    computed: {
        //使用模块化的Vuex时,用map时要在第一个参数指定模块(要开启模块的命名空间才能生效)
        ...mapState("PostModule", ["posts", "total"]),
    },
    watch: {

        //实时搜索
        keyword(newVal){
            //监听关键词变化
            this.getPosts({
                currentPage: this.currentPage - 1,
                pageSize: this.pageSize,
                keyword: newVal,
            });
        }
    },
    mounted() {},
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
