import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
	{
		//登录
		path: "/login",
		name: "login",
		component: () => import("@/views/login/login.vue"),
	},
	{
		//注册
		path: "/register",
		name: "register",
		component: () => import("@/views/login/register.vue"),
	},
	{
		//修改密码
		path: "/changePassword",
		name: "changePassword",
		component: () => import("@/views/login/change.vue"),
	},
	{
		//服务协议
		path: "/clause",
		name: "clause",
		component: () => import("@/views/login/clause.vue"),
	},
	{
		path: "/",
		name: "index",
		component: () => import("@/views/parents/layout.vue"),
		alias: "/home",
		redirect: "courseLearning",
		children: [
			{
				path: "indent",
				component: () => import("@/views/parents/content/indent.vue"),
				name: "indent",
				meta: {
					title: "indent",
					noCache: true,
				},
			},
			{
				path: "courseLearning",
				component: () => import("@/views/parents/content/study.vue"),
				name: "courseLearning",
				meta: {
					title: "courseLearning",
					noCache: true,
				},
			},
		],
	},
];

//防止路由多次重复点击报错问题
const originalPush: any = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location: any) {
	return originalPush.call(this, location).catch((err: any) => err);
};

const router = new VueRouter({
	routes,
	mode: "history",
	linkActiveClass: "active",
	linkExactActiveClass: "active",
});

// 路由守卫;
router.beforeEach((to, from, next) => {
	if (
		to.path === "/login" ||
		to.name === "register" ||
		to.name === "changePassword"
	) {
		next();
	} else {
		let token = localStorage.getItem("Authorization");
		if (token === null || token === "") {
			next("/login");
		} else {
			next();
		}
	}
});

export default router;
