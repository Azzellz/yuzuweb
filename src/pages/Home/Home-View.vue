<template>
    <div class="container" v-if="isReady">
        <div class="recent-posts">
            <h1 style="text-align:center;margin:20px">最新</h1>
            <PostCard v-for="post in posts" :key="post._id" :post="post" />
        </div>
        <div class="recent-users">
            <div class="hot-user-post"></div>
            <div class="recent-visitor"></div>
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
        ...mapState("PostModule", ["posts"]),
        ...mapState("UserModule", ["user"]),
    },
    methods: {
        ...mapActions("PostModule", ["getPosts"]),
        ...mapActions("UserModule", ["getUser"]),
    },
    async created() {
        //初始化前十个帖子展现在首页
        await this.getPosts();
        await this.getUser();
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
</style>
