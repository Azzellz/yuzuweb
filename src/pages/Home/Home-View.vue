<template>
    <div class="container" v-if="isReady">
        <div class="recent-posts">
            <h1 style="text-align: center">最新</h1>
            <PostCard
                v-for="post in lastestPosts"
                :key="post._id"
                :post="post"
            />
        </div>
        <div class="recent-users">
            <div class="hot-user-post">
                <h1 style="text-align: center; margin: 20px">您</h1>
                <div class="user-box">
                    <router-link
                        :to="{
                            path: '/user/other',
                            query: {
                                id: user._id,
                                title: user.user_name,
                            },
                        }"
                    >
                        <el-avatar
                            :size="120"
                            :src="$avatarURL(user.avatar)"
                            style="margin: 20px"
                        ></el-avatar>
                    </router-link>

                    <div class="user-meta">
                        <h1 style="color: black">{{ user.user_name }}</h1>
                        <p>发表了{{ publishedTotal }}篇帖子</p>
                        <p>收藏了{{ favoritesTotal }}篇帖子</p>
                    </div>
                </div>
            </div>
            <div class="recent-visitor">
                <h1 style="text-align: center; margin: 20px">最近访客</h1>
                <div style="padding: 20px">
                    <!-- 这里应该套上一层router-view,点击用户头像即可跳转到目标用户界面 -->
                    <router-link
                        v-for="user in recentUsers"
                        :key="user._id"
                        :to="{
                            path: '/user/other',
                            query: {
                                id: user._id,
                                title: user.user_name,
                            },
                        }"
                        ><el-avatar
                            :size="50"
                            :src="$avatarURL(user.avatar)"
                            style="margin: 10px"
                        ></el-avatar>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PostCard from "../Post/Post-Card.vue";
import { mapActions, mapState } from "vuex";
export default {
    components: {
        PostCard,
    },
    data() {
        return {
            isReady: false,
        };
    },
    computed: {
        ...mapState("PostModule", ["lastestPosts"]),
        ...mapState("UserModule", [
            "user",
            "recentUsers",
            "publishedTotal",
            "favoritesTotal",
        ]),
    },
    methods: {
        ...mapActions("PostModule", ["getLastestPosts"]),
        ...mapActions("UserModule", ["getUser", "getRecentUsers"]),
    },
    async created() {
        //初始化前十个帖子展现在首页-->获取当前用户信息-->获取最近访客信息
        await Promise.all([
            this.getLastestPosts(),
            this.getUser(),
            this.getRecentUsers(),
        ]);
        this.isReady = true;
    },
};
</script>

<style scoped>
.container {
    margin-top: 60px;
    padding: 50px;
    display: flex;
}
.recent-posts {
    display: flex;
    flex-direction: column;
    align-content: center;
    height: 610px;
    overflow: auto;
    box-shadow: 0 0 10px #ccc;
    margin: 20px;
    padding: 50px;
    border-radius: 10px;
    flex: 0.6;
}
.recent-users {
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    flex: 0.4;
}
.hot-user-post {
    box-shadow: 0 0 10px #ccc;
    margin: 20px;
    border-radius: 10px;
    flex: 0.5;
}
.recent-visitor {
    box-shadow: 0 0 10px #ccc;
    margin: 20px;
    border-radius: 10px;
    flex: 0.5;
}

.user-box {
    display: flex;
    padding: 20px;
}
.user-meta {
    padding: 25px;
    line-height: 1.5;
    flex: 1;
    text-align: center;
    color: #999999;
}
</style>
