import axios from "axios";
import { nanoid } from "nanoid";

export default {
    install(Vue) {
        console.log("install required plugin", this);
        //配置axios
        axios.defaults.baseURL = "http://localhost:4000";
        //关闭Vue的生产提示
        Vue.config.productionTip = false;
        Vue.prototype.$bus = new Vue(); //总线
        Vue.prototype.$axios = axios;
        Vue.prototype.$nanoid = nanoid;
        Vue.prototype.$avatarURL = (avatar) => {
            return `http://127.0.0.1:4000/user_avatar/${avatar}`;
        };
    },
};
