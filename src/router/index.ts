import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const isBuy: string | null = localStorage.getItem("is_buy")
    ? "/student"
    : "/courseLearning";

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
        //服务协议
        path: "/aboutAs",
        name: "aboutAs",
        component: () => import("@/views/student/aboutAs.vue"),
    },
    {
        //听（家长端）
        path: "/listen",
        name: "listen",
        component: () => import("@/views/parents/content/listen/index.vue"),
    },

    {
        //家长端
        path: "/",
        name: "index",
        component: () => import("@/views/parents/layout.vue"),
        alias: "/home",
        redirect: isBuy,
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
    {
        //学生端
        path: "/student",
        component: () => import("@/views/student/layout.vue"),
        // redirect: isBuy,
        redirect: "/student/index",
        children: [
            {
                path: "index",
                component: () => import("@/views/student/index.vue"),
                name: "student",
                meta: {
                    title: "首页",
                    noCache: true,
                },
            },
            {
                //字词
                path: "/student/jambic",
                component: () => import("@/views/student/subNav.vue"),
                redirect: "/student/jambic/classification",
                name: "jambic",
                children: [
                    {
                        path: "classification",
                        component: () =>
                            import(
                                "@/views/student/coursrIndex/courseList.vue"
                            ),
                        name: "jambicClassification",
                        meta: {
                            title: "分级自学",
                            noCache: true,
                        },
                    },
                    {
                        path: "advancedStrategy",
                        component: () =>
                            import(
                                "@/views/student/coursrIndex/courseList.vue"
                            ),
                        name: "jambicAdvancedStrategy",
                        meta: {
                            title: "进阶攻略",
                            noCache: true,
                        },
                    },
                    {
                        path: "textbook",
                        component: () =>
                            import(
                                "@/views/student/coursrIndex/courseList.vue"
                            ),
                        name: "jambicTextbook",
                        meta: {
                            title: "教材考试",
                            noCache: true,
                        },
                    },
                    {
                        path: "subjectLearning",
                        component: () =>
                            import(
                                "@/views/student/coursrIndex/courseList.vue"
                            ),
                        name: "jambicSubjectLearning",
                        meta: {
                            title: "专题研习",
                            noCache: true,
                        },
                    },
                ],
            },

            {
                //古诗文
                path: "/student/poetry",
                component: () => import("@/views/student/subNav.vue"),
                redirect: "/student/poetry/classification",
                name: "poetry",
                children: [
                    {
                        path: "classification",
                        component: () =>
                            import(
                                "@/views/student/coursrIndex/courseList.vue"
                            ),
                        name: "poetryClassification",
                        meta: {
                            title: "分级自学",
                            noCache: true,
                        },
                    },
                    {
                        path: "advancedStrategy",
                        component: () =>
                            import(
                                "@/views/student/coursrIndex/courseList.vue"
                            ),
                        name: "poetryAdvancedStrategy",
                        meta: {
                            title: "进阶攻略",
                            noCache: true,
                        },
                    },
                    {
                        path: "textbook",
                        component: () =>
                            import(
                                "@/views/student/coursrIndex/courseList.vue"
                            ),
                        name: "poetryTextbook",
                        meta: {
                            title: "教材考试",
                            noCache: true,
                        },
                    },
                    {
                        path: "subjectLearning",
                        component: () =>
                            import(
                                "@/views/student/coursrIndex/courseList.vue"
                            ),
                        name: "poetrySubjectLearning",
                        meta: {
                            title: "专题研习",
                            noCache: true,
                        },
                    },
                ],
            },
            {
                //文学基础
                path: "/student/historyBase",
                component: () => import("@/views/student/subNav.vue"),
                redirect: "/student/historyBase/classification",
                name: "historyBase",
                children: [
                    {
                        path: "classification",
                        component: () =>
                            import(
                                "@/views/student/coursrIndex/courseList.vue"
                            ),
                        name: "historyBaseClassification",
                        meta: {
                            title: "分级自学",
                            noCache: true,
                        },
                    },
                    {
                        path: "advancedStrategy",
                        component: () =>
                            import(
                                "@/views/student/coursrIndex/courseList.vue"
                            ),
                        name: "historyBaseAdvancedStrategy",
                        meta: {
                            title: "进阶攻略",
                            noCache: true,
                        },
                    },
                    {
                        path: "textbook",
                        component: () =>
                            import(
                                "@/views/student/coursrIndex/courseList.vue"
                            ),
                        name: "historyBaseTextbook",
                        meta: {
                            title: "教材考试",
                            noCache: true,
                        },
                    },
                    {
                        path: "subjectLearning",
                        component: () =>
                            import(
                                "@/views/student/coursrIndex/courseList.vue"
                            ),
                        name: "historyBaseSubjectLearning",
                        meta: {
                            title: "专题研习",
                            noCache: true,
                        },
                    },
                ],
            },
            {
                //中外文学
                path: "/student/global",
                component: () => import("@/views/student/subNav.vue"),
                redirect: "/student/global/classification",
                name: "global",
                children: [
                    {
                        path: "classification",
                        component: () =>
                            import(
                                "@/views/student/coursrIndex/courseList.vue"
                            ),
                        name: "globalClassification",
                        meta: {
                            title: "分级自学",
                            noCache: true,
                        },
                    },
                    {
                        path: "advancedStrategy",
                        component: () =>
                            import(
                                "@/views/student/coursrIndex/courseList.vue"
                            ),
                        name: "globalBaseAdvancedStrategy",
                        meta: {
                            title: "进阶攻略",
                            noCache: true,
                        },
                    },
                    {
                        path: "textbook",
                        component: () =>
                            import(
                                "@/views/student/coursrIndex/courseList.vue"
                            ),
                        name: "globalTextbook",
                        meta: {
                            title: "教材考试",
                            noCache: true,
                        },
                    },
                    {
                        path: "subjectLearning",
                        component: () =>
                            import(
                                "@/views/student/coursrIndex/courseList.vue"
                            ),
                        name: "globalSubjectLearning",
                        meta: {
                            title: "专题研习",
                            noCache: true,
                        },
                    },
                ],
            },
            {
                //游学
                path: "/student/studyTour",
                component: () => import("@/views/student/subNav.vue"),
                redirect: "/student/studyTour/stWhiteDeerCave",
                name: "studyTour",
                children: [
                    {
                        path: "stWhiteDeerCave",
                        component: () =>
                            import(
                                "@/views/student/coursrIndex/courseList.vue"
                            ),
                        name: "stWhiteDeerCave",
                        meta: {
                            title: "白鹿洞游学",
                            noCache: true,
                        },
                    },
                    {
                        path: "stMap",
                        component: () =>
                            import(
                                "@/views/student/coursrIndex/courseList.vue"
                            ),
                        name: "stMap",
                        meta: {
                            title: "游学地图",
                            noCache: true,
                        },
                    },
                    {
                        path: "stWithBook",
                        component: () =>
                            import(
                                "@/views/student/coursrIndex/courseList.vue"
                            ),
                        name: "writingForustWithBookm",
                        meta: {
                            title: "跟着课本游世界",
                            noCache: true,
                        },
                    },
                ],
            },
            {
                //写作论坛
                path: "/student/writing",
                component: () => import("@/views/student/subNav.vue"),
                redirect: "/student/writing/writingTrain",
                name: "writing",
                children: [
                    {
                        path: "writingTrain",
                        component: () =>
                            import(
                                "@/views/student/coursrIndex/courseList.vue"
                            ),
                        name: "writingTrain",
                        meta: {
                            title: "写作训练",
                            noCache: true,
                        },
                    },
                    {
                        path: "textbookExercise",
                        component: () =>
                            import(
                                "@/views/student/coursrIndex/courseList.vue"
                            ),
                        name: "textbookExercise",
                        meta: {
                            title: "课本习作",
                            noCache: true,
                        },
                    },
                    {
                        path: "literaryCreation",
                        component: () =>
                            import(
                                "@/views/student/coursrIndex/courseList.vue"
                            ),
                        name: "literaryCreation",
                        meta: {
                            title: "文学创作",
                            noCache: true,
                        },
                    },
                    {
                        path: "topTeacherClass",
                        component: () =>
                            import("@/views/student/noCourse/index.vue"),
                        name: "topTeacherClass",
                        meta: {
                            title: "名师课堂",
                            noCache: true,
                        },
                    },
                    {
                        path: "writingForum",
                        component: () =>
                            import("@/views/student/noCourse/index.vue"),
                        name: "writingForum",
                        meta: {
                            title: "写作论坛",
                            noCache: true,
                        },
                    },
                ],
            },
            {
                //听（学生端）
                path: "listen_child",
                name: "listen_child",
                component: () => import("@/views/student/listen/index.vue"),
                meta: {
                    title: "听/试听",
                    noCache: true,
                },
            },
            {
                //测试（学生端）
                path: "exam",
                name: "exam",
                component: () => import("@/views/student/exam/index.vue"),
                meta: {
                    title: "测试",
                    noCache: true,
                },
            },
            {
                //涂鸦
                path: "write",
                name: "write",
                component: () => import("@/views/student/write/index.vue"),
                meta: {
                    title: "涂鸦",
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
        to.name === "changePassword" ||
        to.name === "clause"
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
