import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import install from "./utils";
import Element from "@/plugins/element.ts";
import "element-ui/lib/theme-chalk/index.css";
import "@/assets/styles/main.scss";
import "@/icons";

const QRCode = require("qrcodejs2");
Vue.prototype.QRCode = QRCode;
const Recorder = require("js-audio-recorder");
Vue.prototype.Recorder = Recorder;

Vue.use(Element);
Vue.use(install);

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount("#app");
