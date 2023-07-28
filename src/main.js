import Vue from "vue";
import App from "./App.vue";

import router from "./router";
import store from "./store";
import required from "./plugins/required";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "animate.css";

Vue.use(ElementUI);
Vue.use(required);

new Vue({
    render: (h) => h(App),
    router,//启动路由
    store,//启动Vuex
    beforeCreate() {
        // Vue.prototype.$bus = this;  //总线
        // Vue.prototype.$axios = axios;
        // Vue.prototype.$nanoid = nanoid;
        // Vue.prototype.$avatarURL = (avatar) => {
        //     return `http://127.0.0.1:4000/user_avatar/${avatar}`;
        // };
    },
}).$mount("#app");
