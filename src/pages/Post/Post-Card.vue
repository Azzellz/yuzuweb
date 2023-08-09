<template>
    <router-link
        :to="{
            path: '/post/item',
            query: {
                id: post._id,
                currentPage: currentPage,
                pageSize: pageSize,
            },
        }"
    >
        <el-card class="post-card">
            <div class="user-info">
                <template v-if="!post.isUnknown">
                    <el-avatar
                        :size="50"
                        :src="$avatarURL(post.user.avatar)"
                    ></el-avatar>
                    <div style="flex: 1">
                        {{ postInfo }}
                    </div>
                </template>
                <template v-else>
                    <el-avatar icon="el-icon-user-solid" :size="50"></el-avatar>
                    <div style="flex: 1">{{ postInfo }}</div>
                </template>
                <div style="font-size: 15px; color: #999">{{ postMeta }}</div>
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
</template>

<script>
export default {
    name: "PostCard",
    props: ["post", "currentPage", "pageSize"], //接收一个post对象参数
    computed: {
        postMeta() {
            // 打印出点赞数和点踩数
            return `👍:${this.post.support} 👎:${this.post.oppose} ⭐:${this.post.follow} 评论:${this.post.comments.length}`;
        },
        postInfo() {
            return this.post.isUnknown
                ? `匿名用户 发表于 ${this.betterFormatTime}`
                : `${this.post.user.user_name} 发表于 ${this.betterFormatTime}`;
        },
        betterFormatTime(){
            //如果是当前年份则不显示年份
            const currentYear = (new Date()).getFullYear() + ''
            if (this.post.format_time.split('-')[0]===currentYear){
                return this.post.format_time.split('-').slice(1).join('-')
            }else{
                return this.post.format_time
            }
        }
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
};
</script>

<style scoped>
a {
    display: flex;
    justify-content: center;
    text-decoration: none;
    width: fit-content;
    height: fit-content;
    width: 50vw;
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
.post-info {
    font-size: 15px;
    color: #999;
    padding: 0 20px;
}
.title {
    font-size: 30px;
    font-weight: bold;
    text-align: left;
    line-height: 1.5;
}
</style>
