import axios from "axios";
import router from "@/router/index";
import { Loading, Message } from "element-ui";

const api = process.env.VUE_APP_BASE_API;
const payApi = process.env.VUE_APP_PAY_API;

// api service
const service = axios.create({
    // 设置超时时间
    timeout: 60000,
    baseURL: api,
    headers: {
        Accept: "application/json; charset=utf-8",
        "Content-Type": "application/json; charset=utf-8",
    },
});

let loading: any = null;

service.interceptors.request.use(
    (config) => {
        // console.log(config)
        loading = Loading.service({
            text: "请稍等...",
        });
        //处理
        if (localStorage.getItem("Authorization")) {
            config.headers.Authorization = localStorage.getItem(
                "Authorization"
            );
        }
        //家长学生
        if (localStorage.getItem("character")) {
            config.headers.character = localStorage.getItem("character");
        } else {
            config.headers.character = "parents";
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

service.interceptors.response.use(
    (response) => {
        if (loading) {
            setTimeout(() => {
                loading.close();
            }, 500);
        }
        const responseCode = response.status;
        //token 过期重新登录
        if (response.data.code == 100401) {
            router.replace({
                path: "/login",
            });
        }

        if (responseCode == 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    (error) => {
        if (loading) {
            loading.close();
        }
        if (error.response) {
            Message.error(error.response.statusText);
            return Promise.reject(error);
        }
    }
);

// payApi service
const payService = axios.create({
    // 设置超时时间s
    timeout: 60000,
    baseURL: payApi,
    headers: {
        Accept: "application/json; charset=utf-8",
        "Content-Type": "application/json; charset=utf-8",
    },
});
payService.interceptors.request.use(
    (config) => {
        //处理
        if (localStorage.getItem("Authorization")) {
            config.headers.Authorization = localStorage.getItem(
                "Authorization"
            );
        }
        //家长学生
        if (localStorage.getItem("character")) {
            config.headers.character = localStorage.getItem("character");
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

payService.interceptors.response.use(
    (response) => {
        const responseCode = response.status;

        //token 过期重新登录
        if (response.data.code == 100401) {
            router.replace({
                path: "/login",
            });
        }

        if (responseCode == 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    (error) => {
        if (loading) {
            loading.close();
        }
        if (error.response) {
            Message.error(error.response.statusText);
            return Promise.reject(error);
        }
    }
);
export { axios, service, payService };
