<template>
    <div class="student-course-body">
        <!-- 考试须知定位条 -->
        <router-link
            class="link-a"
            v-if="linkShow"
            target="_blank"
            tag="a"
            :to="{ name: 'aboutAs', query: { flag: 2, from: 'about' } }"
            ><img src="@/assets/images/notice.gif" /><span
                >语文教育改革的现状解读</span
            ></router-link
        >
        <div class="link-c" v-if="linkC" @click="goColumnIntro">
            <img src="@/assets/images/column.png" /><span>栏目说明</span>
        </div>
        <!-- tab导航 -->
        <CourseTab
            :styleClass="tabClass"
            :tabLists="tabLists"
            :activeTab="activeTab"
            @activeChange="tabClick"
        ></CourseTab>
        <!-- 内容列表区域 -->
        <el-container class="student-course-list">
            <div class="course-box" v-if="dataList.length">
                <!-- 有上下册 -->
                <template v-if="dataList[0].parent_category_id">
                    <div
                        class="course-type"
                        v-for="(item, index) in dataList"
                        :key="index.id"
                    >
                        <div class="course-title">
                            <span>{{ item.parent_category_name }}</span>
                        </div>
                        <div
                            class="course-list"
                            v-for="(ele, index) in item.categories"
                            :key="index.id"
                        >
                            <div class="course-title-yun">
                                {{ ele.category_name }}
                            </div>
                            <div class="course-box">
                                <div
                                    class="course-list-item"
                                    v-for="(c, index) in ele.courses"
                                    :key="index.id"
                                >
                                    <CourseItem
                                        :inf="c"
                                        @goStudy="goStudy"
                                    ></CourseItem>
                                </div>
                                <i v-for="n in ele.courses.length"></i>
                            </div>
                        </div>
                    </div>
                </template>
                <!-- 无上下册 -->
                <template v-else>
                    <div
                        class="course-type"
                        v-for="(item, index) in dataList"
                        :key="index.id"
                    >
                        <div class="course-list">
                            <div class="course-title-yun">
                                {{ item.category_name }}
                            </div>
                            <div class="course-box">
                                <div
                                    class="course-list-item"
                                    v-for="(c, index) in item.courses"
                                    :key="index.id"
                                >
                                    <CourseItem
                                        :inf="c"
                                        @goStudy="goStudy"
                                    ></CourseItem>
                                </div>
                                <i v-for="n in item.courses.length"></i>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
            <Empty text="内容生产中" padding="122" v-else />
        </el-container>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import CourseTab from "@/components/student-tag/index.vue";
import Empty from "@/components/empty/index.vue";
import CourseItem from "@/components/student-course/index.vue";
import { getTabs, getCourseData, getColumnIntro } from "@/api/student/course";
@Component({
    name: "student-course-body",
    components: {
        CourseTab,
        Empty,
        CourseItem,
    },
})
export default class CourseList extends Vue {
    /**
     * @data
     */
    private topName: string = "";
    private secondName: string = "";
    private categoryId: string | null = "";
    private tabClass: string = "student-tab1";
    private navType: number = 0;
    private linkShow: boolean = false;
    private linkC: boolean = false;
    private tabLists: Array<any> = [];
    private dataList: Array<any> = [];
    private activeTab: string | null = null;
    private navTypes: Array<{ [key: string]: string | number }> = [
        {
            name: "classification",
            type: 1,
        },
        {
            name: "advancedStrategy",
            type: 2,
        },
        {
            name: "textbook",
            type: 3,
        },
        {
            name: "subjectLearning",
            type: 4,
        },
        {
            name: "writingTrain",
            type: 5,
        },
        {
            name: "textbookExercise",
            type: 6,
        },
        {
            name: "literaryCreation",
            type: 7,
        },
        {
            name: "stWhiteDeerCave",
            type: 8,
        },
        {
            name: "stMap",
            type: 9,
        },
        {
            name: "stWithBook",
            type: 10,
        },
        {
            name: "chineseChina",
            type: 11,
        },
        {
            name: "poetryChina",
            type: 12,
        },
        {
            name: "briefHistoryChina",
            type: 13,
        },
        {
            name: "briefHistoryWorld",
            type: 14,
        },
    ];

    mounted() {
        this.init();
    }
    /**
     * @methods
     */

    //初始化变量
    private init() {
        const routerPath: string[] = window.location.href
            .split("student/")[1]
            .split("/");
        this.topName = routerPath[0];
        this.secondName = routerPath[1];
    }

    //点击tag调取列表接口
    private tabClick(val: string): void {
        this.activeTab = val;
        if (this.tabLists.length > 0) this.getData();
    }

    private change(): void {
        this.linkShow = this.secondName == "textbook" ? true : false;
        this.tabClass =
            this.secondName == "advancedStrategy"
                ? "student-tab2"
                : "student-tab1";
        this.categoryId = sessionStorage.getItem("studentCategoryId");
        // reset
        this.activeTab = null;
        this.tabLists = [];
        this.dataList = [];
        // 获取tab标签;
        this.getNavTab();
        // 获取栏目说明
        this.getColumnIntro();
    }

    //获取tab标签内容
    private getNavTab(): void {
        getTabs(this.categoryId, this.navType).then((res: any): void => {
            if (res.data.data.length > 0) {
                // 是否从测试、听、读写等页返回,切换到指定tab
                if (sessionStorage.sct) {
                    const sct = JSON.parse(sessionStorage.sct);
                    if (
                        this.topName == sct.topName &&
                        this.secondName == sct.secondName
                    ) {
                        this.activeTab = sct.tab;
                    } else {
                        this.activeTab = res.data.data[0].id;
                    }
                    sessionStorage.removeItem("sct");
                } else {
                    this.activeTab = res.data.data[0].id;
                }
            }
            this.tabLists = res.data.data;
        });
    }

    //获取tab下的数据列表
    private getData(): void {
        getCourseData(this.activeTab).then((res: any): void => {
            console.log(res.data.data);
            this.dataList = res.data.data;
        });
    }

    //弹窗按钮的跳转
    private goStudy(val: any): void {
        let stObj = {
            topName: this.topName,
            secondName: this.secondName,
            categoryId: this.categoryId,
            navTab: this.navType,
            tab: this.activeTab,
        };
        sessionStorage.sct = JSON.stringify(stObj);
        this.$router.push({
            name: val.type,
            query: { id: val.id, title: val.title },
        });
    }

    //展示专栏与否
    private getColumnIntro() {
        getColumnIntro(this.categoryId, this.navType).then((res: any): void => {
            if (res.data.code == 0) {
                this.linkC = res.data.data.status == 1;
            }
        });
    }

    //跳转专栏介绍
    private goColumnIntro() {
        let routeData = this.$router.resolve({
            name: "aboutAs",
            query: {
                id: this.categoryId,
                type: String(this.navType),
                from: "column",
            },
        });
        window.open(routeData.href, "_blank");
    }

    @Watch("$route")
    //监听路由变化
    private changeRoute(val: string): void {
        this.init();
    }

    //监听二级路由变化
    @Watch("secondName")
    private changeVal(val: string): void {
        const arr = this.navTypes.filter((item) => {
            return item.name === val;
        });
        this.navType = Number(arr[0].type);
        this.change();
    }
}
</script>

<style lang="scss" scoped>
.student-course-body {
    width: 100%;
    position: relative;
    .link-a {
        position: absolute;
        top: -35px;
        right: 135px;
        width: 240px;
        height: 30px;
        border-radius: 13px;
        font-size: 16px;
        color: #f77a2f;
        margin-top: 1px;
        background: #fff;
        line-height: 30px;
        text-decoration: none;
        cursor: pointer;
        img {
            width: 23px;
            height: 20px;
            margin: 0 10px;
            vertical-align: -4px;
        }
    }
    .link-c {
        position: absolute;
        top: -35px;
        left: 135px;
        padding-right: 10px;
        height: 30px;
        font-size: 16px;
        color: #f77a2f;
        line-height: 30px;
        text-decoration: none;
        cursor: pointer;
        background: #fff;
        border-radius: 13px;
        img {
            width: 20px;
            height: 20px;
            margin: 0 10px;
            vertical-align: -4px;
        }
    }
    .student-course-list {
        width: 85%;
        margin: auto;
        border: 22px solid #fff;
        border-radius: 20px;
        background: #bbddf9;
        padding: 27px;
        box-sizing: border-box;
        .course-box {
            width: 100%;
            .course-type {
                width: 100%;
                .course-title {
                    text-align: center;
                    font-size: 20px;
                    color: #333;
                    position: relative;
                    margin-bottom: 27px;
                    &:after {
                        content: "";
                        height: 1px;
                        width: 43%;
                        display: block;
                        background: #fff;
                        clear: both;
                        position: absolute;
                        left: 0%;
                        top: 50%;
                        transform: translate (-50%, -50%);
                    }
                    &::before {
                        content: "";
                        height: 1px;
                        width: 43%;
                        display: block;
                        background: #fff;
                        clear: both;
                        position: absolute;
                        right: 0%;
                        top: 50%;
                        transform: translate (-50%, -50%);
                    }
                }
                .course-list {
                    width: 100%;
                    margin-bottom: 26px;
                    &:last-child {
                        margin-bottom: 0;
                    }
                    .course-title-yun {
                        box-sizing: border-box;
                        line-height: 50px;
                        width: 152px;
                        height: 50px;
                        padding: 0 30px;
                        background: url("~@/assets/images/course_title.png")
                            no-repeat;
                        background-size: contain;
                        margin-bottom: 20px !important;
                        font-size: 18px;
                        margin: auto;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        text-align: center;
                        color: #63a7f8;
                    }

                    .course-box {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: space-between;
                        .course-list-item {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            box-sizing: border-box;
                            width: 206px;
                            height: 292px;
                            overflow: hidden;
                            background: #fff;
                            border-radius: 5px;
                            margin-bottom: 17px;
                        }
                    }
                    i {
                        width: 206px;
                    }
                }
            }
        }
    }
}
</style>
