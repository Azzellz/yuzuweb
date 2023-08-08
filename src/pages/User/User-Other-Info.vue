<template>
    <div v-if="isReady">
        <h1>HELLO</h1>
    </div>
</template>

<script>
import { mapActions,mapState } from "vuex";
export default {
    props: ["id"],
    data() {
        return {
          isReady:false,
        };
    },
    computed: {
      ...mapState("UserModule", ["otherUser"]),
    },
    methods: {
      ...mapActions("UserModule", ["getOtherUser"]),
    },
    async created() {
      //根据当前query传来的id动态获取用户信息
      //先判断是否为当前用户,如果为当前用户则导航到user/info
      if (this.id===localStorage.getItem("user_id")) return this.$router.replace("/user/info");
      //如果不是当前用户则获取目标用户信息
      await this.getOtherUser(this.id);
      this.isReady = true;
    },
};
</script>

<style scoped></style>
