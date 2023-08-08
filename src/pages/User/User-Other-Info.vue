<template>
    <div v-if="isReady" class="container">
        <div class="left">
            <!-- 左侧用来展示个人资料 -->
            <el-avatar
                :size="200"
                :src="$avatarURL(otherUser.user.avatar)"
                style="margin: 50px auto"
            ></el-avatar>
            <el-button
                v-if="!isFollowed"
                style="margin: 10px auto"
                @click="follow"
                type="primary"
                >关注</el-button
            >
            <el-button
                v-else
                style="margin: 10px auto"
                type="danger"
                @click="unFollow"
                >取消关注</el-button
            >
            <h1 style="margin: 10px auto">{{ otherUser.user.user_name }}</h1>
            <h2 style="margin: 10px auto; color: #ccc; font-weight: 500">
                {{ otherUser.user.account }}
            </h2>
            <div style=" margin:10px auto;">
                帖子数:{{ otherUser.publishedTotal }} 被关注数:{{
                    otherUser.user.fans.length
                }}
            </div>
        </div>
        <div class="right">
            <!-- 右侧用来展示帖子 -->
            <h1 style="margin: 20px">作品</h1>
            <!-- 这里没做分页,可能会有性能问题 -->
            <div style="padding:20px;height:600px;overflow:auto">
                <PostCard
                    v-for="post in otherUser.user.published"
                    :key="post._id"
                    :post="post"
                ></PostCard>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import PostCard from "../Post/Post-Card.vue";
export default {
    components: {
        PostCard,
    },
    props: ["id"],
    data() {
        return {
            isReady: false,
            isFollowed: false,
        };
    },
    computed: {
        ...mapState("UserModule", ["otherUser"]),
    },
    methods: {
        ...mapActions("UserModule", ["getOtherUser"]),
        //判断是否已经关注
        checkIsFollowed() {
            return new Promise((resolve, reject) => {
                this.$axios
                    .get(
                        `/user/isFollow?user_id=${localStorage.getItem(
                            "user_id"
                        )}&follow_id=${this.id}`
                    )
                    .then(({ data: { data } }) => {
                        // console.log(data);
                        this.isFollowed = data;
                        resolve();
                    })
                    .catch((err) => {
                        console.log(err);
                        reject();
                    });
            });
        },
        follow() {
            this.$axios
                .put("/user/follow", {
                    user_id: localStorage.getItem("user_id"),
                    follow_id: this.id,
                })
                .then((result) => {
                    this.$message({
                        type: "success",
                        message: "关注成功",
                        offset: 100,
                    });
                    this.isFollowed = !this.isFollowed;
                    console.log(result);
                })
                .catch((err) => {
                    this.$message({
                        type: "error",
                        message: "关注失败",
                        offset: 100,
                    });
                    console.log(err);
                });
        },
        unFollow() {
            this.$axios
                .put("/user/unFollow", {
                    user_id: localStorage.getItem("user_id"),
                    follow_id: this.id,
                })
                .then((result) => {
                    this.$message({
                        type: "error",
                        message: "取关成功",
                        offset: 100,
                    });
                    this.isFollowed = !this.isFollowed;
                    console.log(result);
                })
                .catch((err) => {
                    this.$message({
                        type: "error",
                        message: "取关失败",
                        offset: 100,
                    });
                    console.log(err);
                });
        },
    },
    async created() {
        //根据当前query传来的id动态获取用户信息
        //先判断是否为当前用户,如果为当前用户则导航到user/info
        if (this.id === localStorage.getItem("user_id"))
            return this.$router.replace("/user/info");
        //如果不是当前用户则获取目标用户信息
        await this.getOtherUser(this.id);
        await this.checkIsFollowed();

        this.isReady = true;
    },
};
</script>

<style scoped>
.container {
    display: flex;
}
.left {
    flex: 0.3;
    margin: 50px;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 0 10px #ccc;

    display: flex;
    flex-direction: column;
    align-items: start;
}
.right {
    flex: 0.7;
    margin: 50px;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 0 10px #ccc;

    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
