<template>
    <el-container class="student-nav-container">
        <el-header class="student-nav-header">
            <studentNav
                :lists="navList"
                :navName="navName"
                :active="activeLink"
            ></studentNav>
        </el-header>
        <el-main class="pa-0" style="overflow:initial">
            <router-view></router-view>
        </el-main>
    </el-container>
</template>
<script lang="ts">
import studentNav from "@/components/student-nav/index.vue";
import { Component, Vue, Watch } from "vue-property-decorator";
@Component({
    name: "sutdent-nav-warp",
    components: { studentNav },
})
export default class StudentAnvWrap extends Vue {
    /**
     * @data
     */
    private category: string = "";
    private activeLink: string = "";
    private navName: string = "";
    private navList: Array<any> = [];
    private jambicNav: Array<{ [key: string]: string }> = [
        {
            url: "/student/jambic/classification",
            text: "分级自学",
            img: require("@/assets/images/subnav-1.png"),
        },
        {
            url: "/student/jambic/advancedStrategy",
            text: "进阶攻略",
            img: require("@/assets/images/subnav-2.png"),
        },
        {
            url: "/student/jambic/textbook",
            text: "教材考试",
            img: require("@/assets/images/subnav-3.png"),
        },
        {
            url: "/student/jambic/subjectLearning",
            text: "专题研习",
            img: require("@/assets/images/subnav-4.png"),
        },
    ];
    private historyBaseNav: Array<{ [key: string]: string }> = [
        {
            url: "/student/historyBase/classification",
            text: "分级自学",
            img: require("@/assets/images/subnav-1.png"),
        },
        {
            url: "/student/historyBase/advancedStrategy",
            text: "进阶攻略",
            img: require("@/assets/images/subnav-2.png"),
        },
        {
            url: "/student/historyBase/textbook",
            text: "教材考试",
            img: require("@/assets/images/subnav-3.png"),
        },
        {
            url: "/student/historyBase/subjectLearning",
            text: "专题研习",
            img: require("@/assets/images/subnav-4.png"),
        },
    ];
    private globalNav: Array<{ [key: string]: string }> = [
        {
            url: "/student/global/classification",
            text: "分级自学",
            img: require("@/assets/images/subnav-1.png"),
        },
        {
            url: "/student/global/advancedStrategy",
            text: "进阶攻略",
            img: require("@/assets/images/subnav-2.png"),
        },
        {
            url: "/student/global/textbook",
            text: "教材考试",
            img: require("@/assets/images/subnav-3.png"),
        },
        {
            url: "/student/global/subjectLearning",
            text: "专题研习",
            img: require("@/assets/images/subnav-4.png"),
        },
    ];
    private poetryNav: Array<{ [key: string]: string }> = [
        {
            url: "/student/poetry/classification",
            text: "分级自学",
            img: require("@/assets/images/subnav-1.png"),
        },
        {
            url: "/student/poetry/advancedStrategy",
            text: "进阶攻略",
            img: require("@/assets/images/subnav-2.png"),
        },
        {
            url: "/student/poetry/textbook",
            text: "教材考试",
            img: require("@/assets/images/subnav-3.png"),
        },
        {
            url: "/student/poetry/subjectLearning",
            text: "专题研习",
            img: require("@/assets/images/subnav-4.png"),
        },
    ];
    private writingNav: Array<{ [key: string]: string }> = [
        {
            url: "/student/writing/writingTrain",
            text: "写作训练",
            img: require("@/assets/images/subnav-5.png"),
        },
        {
            url: "/student/writing/textbookExercise",
            text: "课本习作",
            img: require("@/assets/images/subnav-6.png"),
        },
        {
            url: "/student/writing/literaryCreation",
            text: "文学创作",
            img: require("@/assets/images/subnav-7.png"),
        },
        {
            url: "/student/writing/topTeacherClass",
            text: "名师课堂",
            img: require("@/assets/images/subnav-8.png"),
        },
        {
            url: "/student/writing/writingForum",
            text: "写作论坛",
            img: require("@/assets/images/subnav-9.png"),
        },
    ];
    private studyTourNav: Array<{ [key: string]: string | boolean }> = [
        {
            url: "/student/studyTour/stWhiteDeerCave",
            text: "白鹿洞游学",
            img: require("@/assets/images/subnav-10.png"),
        },
        {
            url: "/student/studyTour/stMap",
            text: "游学地图",
            img: require("@/assets/images/subnav-11.png"),
        },
        {
            url: "/student/studyTour/stWithBook",
            text: "跟着课本游世界",
            img: require("@/assets/images/subnav-12.png"),
            isLetter: true,
        },
    ];

    mounted() {
        this.category = window.location.href.split("student/")[1].split("/")[0];
        this.activeLink = window.location.pathname;
        if (this.category === "poetry") {
            this.navName = "古诗文";
            this.navList = this.poetryNav;
        } else if (this.category === "jambic") {
            this.navName = "字词";
            this.navList = this.jambicNav;
        } else if (this.category === "historyBase") {
            this.navName = "文史基础";
            this.navList = this.historyBaseNav;
        } else if (this.category === "global") {
            this.navName = "中外文学";
            this.navList = this.globalNav;
        } else if (this.category === "writing") {
            this.navName = "写作";
            this.navList = this.writingNav;
        } else if (this.category === "studyTour") {
            this.navName = "游学";
            this.navList = this.studyTourNav;
        }
        sessionStorage.setItem("sc", this.navName);
    }
}
</script>
<style lang="scss" scoped>
.student-nav-container {
    .student-nav-header {
        width: 1200px;
        max-width: 1200px;
        margin: 34px auto 40px;
        background: url("~@/assets/images/subNav_bg.png") center center
            no-repeat;
        background-size: 100% 116px;
    }
    .student-nav-body {
        margin-bottom: 100px;
        .student-tab-content {
            background: #f6fafe;
            border-radius: 20px;
            padding: 22px;
            .tab-content-box {
                width: 100%;
                box-sizing: border-box;
                padding: 29px;
                background: #d3e9fb;
                border-radius: 16px;
            }
        }
    }
}
@media screen and (min-width: 1208px) {
    .student-nav-container .student-nav-body {
        margin: 0 121px 100px 118px;
    }
}
</style>
