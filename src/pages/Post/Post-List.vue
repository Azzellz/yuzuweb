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
        <transition-group name="fade">
            <PostCard
                v-for="post in filteredPosts"
                :key="post._id"
                :post="post"
            ></PostCard>
        </transition-group>
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
        };
    },
    methods: {
        //使用模块化的Vuex时,用map时要在第一个参数指定模块(要开启模块的命名空间才能生效)
        ...mapActions("PostModule", ["updatePosts"]),
    },
    computed: {
        //使用模块化的Vuex时,用map时要在第一个参数指定模块(要开启模块的命名空间才能生效)
        ...mapState("PostModule", ["posts"]),
        filteredPosts() {
            //根据关键字过滤
            return this.posts
                .filter((post) => {
                    return (
                        //todo:使用正则表达式进行模糊搜索
                        post.title.includes(this.keyword) ||
                        post.content.includes(this.keyword) ||
                        post.tags.indexOf(this.keyword) !== -1
                    );
                })
                .sort((a, b) => {
                    //按照时间先后排序
                    return b.time_stamp - a.time_stamp;
                });
        },
    },
    watch: {
        filteredPosts(newVal) {
            //监听是否有搜索结果
            if (!newVal.length) {
                this.$notify.info({
                    title: "消息",
                    message: "无相关结果",
                });
            }
        },
    },
    mounted() {
        //进入界面时获取post列表
        this.updatePosts();
    },
};
</script>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}
.search {
    width: 50%;
    margin: 20px;
    height: 40px;
}

</style>
