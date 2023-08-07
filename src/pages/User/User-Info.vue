<template>
    <span>
        <UserInfoNormal
            v-if="!isEditing"
            :isEditing.sync="isEditing"
            :user="user"
        ></UserInfoNormal>
        <UserInfoEdit
            v-else
            :isEditing.sync="isEditing"
            :user="user"
        ></UserInfoEdit>
    </span>
</template>

<script>
import UserInfoEdit from "./User-Info-Edit.vue";
import UserInfoNormal from "./User-Info-Normal.vue";
import { mapState } from "vuex";
export default {
    components: {
        UserInfoEdit,
        UserInfoNormal,
    },
    data() {
        return {
            isEditing: false, //编辑模式
        };
    },
    computed: {
        ...mapState("UserModule", ["user"]),
    },
};
</script>

<style scoped></style>
