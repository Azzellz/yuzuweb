<template>
    <div class="list">
        <el-input
            placeholder="搜索"
            suffix-icon="el-icon-search"
            class="search"
            v-model="keyword"
        >
        </el-input>
        <!-- 用组过渡每个post -->
        <transition-group name="fade">
            <router-link
                v-for="post in filteredPosts"
                :key="post._id"
                :to="{
                    path: '/post/item',
                    query: {
                        id: post._id,
                    },
                }"
            >
                <el-card class="post-card">
                    <div class="user-info">
                        <el-avatar
                            :size="50"
                            :src="avatarUrl(post.avatar)"
                        ></el-avatar>
                        <div style="flex: 1">{{ post.user_name }}</div>
                    </div>
                    <el-divider v-if="post.tags.length"></el-divider>
                    <el-tag
                        v-for="(tag, index) in post.tags"
                        :key="index"
                        :disable-transitions="false"
                        style="margin: 0 5px"
                    >
                        {{ tag }}
                    </el-tag>
                    <el-divider></el-divider>
                    <div class="title">{{ post.title }}</div>
                    <div v-if="post.isShowContent">
                        <el-divider></el-divider>
                        <div>
                            {{ post.content | toString | subStr }}
                        </div>
                    </div>
                </el-card>
            </router-link>
        </transition-group>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
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
        avatarUrl() {
            return (avatar) => {
                return `http://127.0.0.1:4000/user_avatar/${avatar}`;
            };
        },
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
        postInfo() {
            // 打印出点赞数和点踩数
            return (post) =>
                `👍:${post.support} 👎:${post.oppose} 评论数:${post.comments.length}`;
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
    filters: {
        //使用过滤器对过长内容进行过滤
        //截取字符串
        subStr: (str) => {
            return str.length > 100 ? str.substring(0, 100) + "......" : str;
        },
        toString: (str) => {
            return str + "";
        },
    },
    mounted() {
        //进入界面时获取post列表
        this.updatePosts();
    },
};
</script>

<style scoped>
.list {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
}
a {
    display: flex;
    justify-content: center;
    text-decoration: none;
    width: fit-content;
    height: fit-content;
    width: 50vw;
}
.search {
    width: 50%;
    margin: 20px;
    height: 40px;
}
.post-card {
    width: 100%;
    min-height: 200px;
    margin: 20px;
    cursor: pointer;
}
.user-info {
    display: flex;
}
.user-info div {
    display: flex;
    font-size: 20px;
    font-weight: bold;
    align-items: center;
    padding: 0 20px;
}
.title {
    font-size: 30px;
    font-weight: bold;
    text-align: left;
    line-height: 1.5;
}
</style>
