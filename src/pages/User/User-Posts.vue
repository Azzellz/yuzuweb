<template>
    <div class="container">
        <PostCard v-for="post in posts" :key="post._id" :post="post"></PostCard>
    </div>
</template>

<script>
import PostCard from '../Post/Post-Card.vue'
export default {
    components: {
        PostCard
    },
    data() {
        return {
            posts: [],
        };
    },
    mounted() {
        //获取用户的post信息
        //TODO:这里要做个检验,如果本地存储获取不到user_id,就跳转到登录页面
        this.$axios
            .get(
                `http://localhost:4000/user/posts?user_id=${localStorage.getItem(
                    "user_id"
                )}`
            )
            .then(({ data: { data } }) => {
                console.log(data);
                this.posts = data;
            })
            .catch((err) => {
                console.log(err);
            });
    },
};
</script>

<style scoped>
.container{
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}
</style>
