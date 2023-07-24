import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import { nanoid } from "nanoid";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "animate.css";

Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
    render: (h) => h(App),
    router,
    store,
    beforeCreate() {
        Vue.prototype.$bus = this;
        Vue.prototype.$axios = axios;
        Vue.prototype.$nanoid = nanoid;
    }
}).$mount("#app");
