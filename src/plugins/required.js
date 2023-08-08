import axios from "axios";
import { nanoid } from "nanoid";

export default {
    install(Vue) {
        //配置axios的根路径
        axios.defaults.baseURL = "http://localhost:4000/";
        //关闭Vue的生产提示
        Vue.config.productionTip = false;
        Vue.prototype.$bus = new Vue(); //总线
        Vue.prototype.$axios = axios;
        Vue.prototype.$nanoid = nanoid;
        Vue.prototype.$avatarURL = (avatar) => {
            return `http://localhost:4000/user_avatar/${avatar}`;
        };
        //全局枚举变量
        Vue.prototype.$enum = {
            //post数据来源
            POST_FROM: {
                USER_POSTS: Symbol("用户自己的POST"),
                LASTEST_POSTS: Symbol("来自主页的最新的POST"),
                LIST_POSTS: Symbol("来自于列表的POST"),
                FOLLOWING_POSTS: Symbol("来自于用户关注的人的post"),
            },
        };
        //全局防抖函数构造函数
        Vue.prototype.$debounce = (func, delay) => {
            let timer;
            return function (...args) {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    func.apply(this, args);
                }, delay);
            };
        };
    },
};
