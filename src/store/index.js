import Vue from "vue";
import Vuex from "vuex";
//模块导入
import PostModule from "./post";
import UserModule from "./user";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        PostModule,
        UserModule
    },
});
