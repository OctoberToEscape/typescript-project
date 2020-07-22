<template>
    <div class="exam-container">
        <div class="top-header">
            <div class="back" @click="back">
                <i class="el-icon-arrow-left"></i>回到{{ sc }}
            </div>
            {{ course_title }}
            <div class="status-item" @click="goRead()">
                <img class="read-img" src="@/assets/images/status/read.png" />
                <div class="status" v-if="readStatus !== 0">
                    <img
                        class="yes-end"
                        v-if="readStatus == 2"
                        src="@/assets/images/status/yes_end.png"
                    /><img
                        class="no-end"
                        v-if="readStatus == 1"
                        src="@/assets/images/status/no_end.png"
                    />
                </div>
            </div>
        </div>
        <div class="exam-content" v-if="testData.length > 0">
            <el-tabs v-model="active">
                <el-tab-pane
                    v-for="(item, index) in testData"
                    :key="item.knowledge_id"
                    :name="item.knowledge_id"
                >
                    <div
                        class="tab-inner"
                        slot="label"
                        :class="{
                            isAnswered:
                                item.is_answered == 1 || item.is_selected == 1,
                        }"
                    >
                        {{ index + 1 }}
                        <div class="result" v-if="testClick == 1">
                            <div class="aRight" v-if="item.user_is_right == 1">
                                <img src="@/assets/images/a-right.png" />
                            </div>
                            <div class="aWrong" v-if="item.user_is_right == 0">
                                <img src="@/assets/images/a-wrong.png" />
                            </div>
                        </div>
                    </div>
                    <div class="test-box">
                        <div class="test-title">
                            题目{{ index + 1 }}:{{ item.question }}
                        </div>
                        <div class="test-body" v-if="testType == 1">
                            <div
                                class="option"
                                v-for="(question, qIndex) in item.options"
                                :key="question.option_id"
                                :class="{
                                    active: question.is_user_select == 1,
                                }"
                                @click="
                                    changeOptions(qIndex, question.option_id)
                                "
                            >
                                <i class="questionI">{{ options[qIndex] }}</i
                                ><span>{{ question.option }}</span>
                            </div>
                        </div>
                        <div class="test-body" v-if="testType == 2">
                            <el-input
                                class="writing-box"
                                v-if="index == testData.length - 1"
                                type="textarea"
                                :rows="8"
                                v-model="item.user_answer"
                                :readonly="
                                    testClick == 1 && item.user_is_right == 1
                                "
                                @input="isLastWriting(item.user_answer)"
                                @blur="lastWritingSub(item.user_answer)"
                            ></el-input>
                            <el-input
                                class="writing-box"
                                v-else="v-else"
                                type="textarea"
                                :rows="8"
                                :readonly="
                                    item.is_answered == 1 &&
                                        item.user_is_right == 1
                                "
                                v-model="item.user_answer"
                            ></el-input>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane class="complete" disabled="disabled">
                    <div
                        class="tab-inner canOver"
                        slot="label"
                        v-if="canOver"
                        @click="testComplete"
                    >
                        完成
                    </div>
                    <div class="tab-inner" slot="label">完成</div>
                </el-tab-pane>
            </el-tabs>
            <div class="controlActive">
                <div class="prev" @click="prev" v-if="isPrev">
                    <img src="@/assets/images/test_prev.png" />
                </div>
                <div class="next" @click="next" v-if="isNext">
                    <img src="@/assets/images/test_next.png" />
                </div>
            </div>
        </div>
        <div class="tab-content-box" v-else="v-else">
            <empty text="测试题不见了~"></empty>
        </div>
        <el-dialog
            class="dialog-wrapper"
            :visible.sync="dialogVisible"
            width="680px"
        >
            <div class="dialog-body">
                <template v-if="dialogMess.is_finished == 1"
                    ><img
                        class="dialog-img"
                        src="@/assets/images/dialog_sucess.png"
                    />
                    <div class="tips">
                        <p>恭喜你获得</p>
                        <p class="knowledge-power">
                            {{ dialogMess.knowledge_power }}
                        </p>
                        <p>知识力</p>
                    </div>
                </template>
                <template v-if="dialogMess.is_finished == 0"
                    ><img
                        class="dialog-img"
                        src="@/assets/images/dialog_error.png"
                    />
                    <div class="tips">{{ dialogMess.error_msg }}</div>
                </template>
                <studentCourseStatus
                    :inf="dialogMess"
                    @goStudy="goStudy"
                ></studentCourseStatus>
            </div>
        </el-dialog>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Dictionary } from "vue-router/types/router";
import { getKnowledgePower } from "@/api/student/index";
import empty from "@/components/empty/index.vue";
import studentCourseStatus from "@/components/student-course-btn/index.vue";
import {
    getKnowledgeTest,
    getCourseStatus,
    writingKnowledgeTest,
    knowledgeTest,
    finishTestKnowledge,
} from "@/api/student/exam";
import { StudentModule } from "@/store/module/student";
@Component({
    name: "student-exam",
    components: {
        studentCourseStatus,
        empty,
    },
})
export default class StudentExam extends Vue {
    private sc: string = "";
    private sct: { [key: string]: string } = {};
    private course_id: string | (string | null)[] = "";
    private course_title: string | (string | null)[] = "";
    private readStatus: string = "";
    private active: string = "";
    private testType: number = 1;
    private testClick: number = 0;
    private testData: Array<any> = [];
    private canOver: boolean = false;
    private dialogVisible: boolean = false;
    private dialogMess: { [key: string]: string | number } = {};
    private options: Array<string> = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
    ];

    mounted() {
        this.sc = sessionStorage.sc;
        this.sct = JSON.parse(sessionStorage.sct);
        this.course_id = this.$route.query.id;
        this.course_title = this.$route.query.title;
        this.getKnowledgeTest();
        this.getCourseStatus();
    }

    // 获取测试题
    private getKnowledgeTest(): void {
        getKnowledgeTest(this.course_id, {
            params: {
                type: this.sct.navTab,
                category_id: this.sct.categoryId,
            },
        }).then((res: any) => {
            if (res.code == 0) {
                this.testType = res.data.type;
                this.testClick = res.data.is_click;
                this.testData = res.data.list;
                if (this.testData.length > 0) {
                    this.whichNum();
                }
            }
        });
    }

    private whichNum(): void {
        let aIndex = 0;
        const sum = this.testData.length;
        if (this.testClick == 0) {
            // 没交过卷---默认到未作答的那一题
            for (var i = 0; i < sum; i++) {
                if (
                    this.testData[i].is_selected == 0 ||
                    this.testData[i].is_answered == 0
                ) {
                    aIndex = i;
                    break;
                }
            }
            let answerwdNum = 0;
            for (var i = 0; i < sum; i++) {
                if (
                    this.testData[i].is_selected == 1 ||
                    this.testData[i].is_answered == 1
                ) {
                    answerwdNum++;
                }
            }
            if (answerwdNum == sum) {
                this.canOver = true;
            }
        } else if (this.testClick == 1) {
            // 交过卷
            for (var i = 0; i < sum; i++) {
                if (this.testData[i].user_is_right == 0) {
                    aIndex = i;
                    break;
                }
            }
            this.canOver = true;
        }
        this.active = this.testData[aIndex].knowledge_id;
    }

    private getCourseStatus() {
        getCourseStatus(this.course_id).then((res: any): void => {
            if (res.code == 0) {
                this.readStatus = res.data.is_writing_complete;
            }
        });
    }

    private changeOptions(qIndex: number, id: string): void {
        // 单选选项
        const activeIndex = this.activeIndex;
        const testList = this.testData;
        const examList = testList[activeIndex];
        if (this.testClick == 1 && examList.user_is_right == 1) {
            this.$message("该测试题已经答对~不可修改哦");
        } else {
            // 未答对的状态
            examList.options.forEach((item: any, ind: number): void => {
                if (ind == qIndex) {
                    item.is_user_select = 1;
                } else {
                    item.is_user_select = 0;
                }
            });
            examList.is_selected = 1;
            testList.splice(activeIndex, 1, examList);
            // 提交单选题
            knowledgeTest({
                course_id: this.course_id,
                knowledge_id: this.active,
                option_id: id,
            }).then((res: any): void => {
                if (res.code == 0) {
                    if (!res.data) {
                        this.$message({
                            message: "提交失败",
                            type: "error",
                        });
                    } else {
                        // 判断是否答完最后一题  完成按钮可点
                        this.isAnsweredAll();
                    }
                }
            });
        }
    }

    private submitWriting(activeId: string | null): void {
        let activeIndex = this.activeIndex;
        if (Boolean(activeId)) {
            this.testData.forEach((item, indx) => {
                if (item.knowledge_id == activeId) {
                    activeIndex = indx;
                }
            });
        }
        if (this.testData[activeIndex].user_is_right == 0) {
            // 本题未答对
            writingKnowledgeTest({
                course_id: this.course_id,
                knowledge_id: activeId ? activeId : this.active,
                user_answer: this.testData[activeIndex].user_answer,
            }).then((res: any): void => {
                if (res.code == 0) {
                    if (!res.data) {
                        this.$message({
                            message: "提交写作失败",
                            type: "error",
                        });
                    } else {
                        const examList = this.testData[activeIndex];
                        examList.is_answered = 1;
                        this.testData.splice(activeIndex, 1, examList);
                        // 是否都答过  可以去点击完成
                        this.isAnsweredAll();
                    }
                }
            });
        }
    }

    private isAnsweredAll(): void {
        let isAnsweredAll = this.testData.filter((item) => {
            return item.is_selected == 0 || item.is_answered == 0;
        });
        if (isAnsweredAll.length == 0) this.canOver = true;
    }

    private prev(): void {
        let activeIndex = this.activeIndex - 1;
        this.active = this.testData[activeIndex].knowledge_id;
    }

    private next(): void {
        let activeIndex = this.activeIndex + 1;
        this.active = this.testData[activeIndex].knowledge_id;
    }

    private back(): void {
        let url = "/student/" + this.sct.topName + "/" + this.sct.secondName;
        this.$router.replace({ path: url });
    }

    private isLastWriting(v: any): void {
        console.log(v);
        // 监听写作题最后一道，一旦写字，即可点击完成
        if (v.length > 0) {
            this.canOver = true;
        } else {
            this.canOver = false;
        }
    }

    private lastWritingSub(): void {
        this.submitWriting(null);
    }

    private testComplete(): void {
        // 刷新试题数据
        this.getKnowledgeTest();
        // 获取知识力
        finishTestKnowledge({
            course_id: this.course_id,
            category_id: this.sct.categoryId,
            type: this.sct.navTab,
        }).then((res: any) => {
            if (res.code == 0) {
                this.dialogMess = Object.assign(
                    {
                        show_test_button: 1,
                        is_can_test: 1,
                        id: this.course_id,
                        title: this.course_title,
                    },
                    res.data
                );
                this.dialogVisible = true;
                // 重新刷新知识力
                this.getKnowledgePower();
            }
        });
    }

    private getKnowledgePower(): void {
        //获取知识力
        getKnowledgePower().then((res: any) => {
            if (res.code == 0) {
                StudentModule.UPDATA_KNOWLEDGE_POWER(res.data.knowledge_power);
            }
        });
    }

    private goStudy(val: { [key: string]: string }): void {
        // 记录此刻tab
        sessionStorage.sct = JSON.stringify(this.sct);

        if (val.type == "exam") this.dialogVisible = false;
        else if (val.type == "write")
            this.$router.push({
                name: val.type,
                query: { id: val.id, title: val.title, isTest: "isTest" },
            });
        else
            this.$router.push({
                name: val.type,
                query: { id: val.id, title: val.title },
            });
    }
    private goRead(): void {
        var data: Dictionary<any> = {
            id: this.course_id,
            title: this.course_title,
            isTest: 1,
        };
        this.$router.push({
            name: "write",
            query: data,
        });
    }

    private get isPrev(): boolean {
        let firstId = "0";
        if (this.testData.length > 0) {
            firstId = this.testData[0].knowledge_id;
        }
        return this.active != firstId;
    }

    private get isNext(): boolean {
        let next = false;
        if (this.testData.length > 0) {
            next =
                this.active !=
                this.testData[this.testData.length - 1].knowledge_id;
        }
        return next;
    }

    private get activeIndex(): number {
        let activeIndex = 0;
        this.testData.forEach((item, indx) => {
            if (item.knowledge_id == this.active) {
                activeIndex = indx;
            }
        });
        return activeIndex;
    }

    @Watch("active")
    private changeActive(newVal: string, oldVal: string): void {
        if (oldVal && this.testData.length > 0) {
            if (this.testType == 2) {
                this.submitWriting(oldVal);
            }
        }
    }

    @Watch("dialogVisible")
    private changeDialogVisible(v: boolean) {
        if (!v) {
            // 关闭弹窗刷新试题
            this.getKnowledgeTest();
            this.dialogMess = {};
        }
    }

    beforeDestroy() {
        if (this.testType == 2 && this.testData.length > 0)
            this.submitWriting(null);
    }
}
</script>
<style lang="scss" scoped>
.exam-container {
    .top-header {
        box-sizing: border-box;
        height: 51px;
        background: #99cefa;
        padding: 5px 220px 6px 130px;
        text-align: center;
        line-height: 40px;
        overflow: hidden;
        .back {
            float: left;
            cursor: pointer;
        }
        .status-item {
            float: right;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
            width: 40px;
            height: 40px;
            border: 1px solid #63a7f8;
            border-radius: 2px;
            margin: 0 10px;
            cursor: pointer;
            .read-img {
                width: 23px;
                height: 19px;
            }
            .status {
                position: absolute;
                top: 0;
                right: 0;
                width: 16px;
                height: 16px;
                background: #63a7f8;
                border-radius: 0 0 0 16px;
                .yes-end {
                    float: right;
                    width: 9px;
                    height: 6px;
                    margin: 4px 1px 0 0;
                }
                .no-end {
                    float: right;
                    width: 9px;
                    height: 9px;
                    margin: 3px 1px 0 0;
                }
            }
        }
    }
    .exam-content {
        width: 1000px;
        box-sizing: border-box;
        margin: 40px auto 50px;
        font-size: 24px;
        .el-tabs__content {
            .test-box {
                width: 100%;
                height: 560px;
                background: url("~@/assets/images/exam-bg.png") no-repeat;
                background-size: cover;
                .test-title {
                    box-sizing: border-box;
                    padding: 21px 68px 0 27px;
                    height: 106px;
                    overflow-y: auto;
                    color: #fff;
                    line-height: 30px;
                    margin-bottom: 34px;
                }
                .test-body {
                    box-sizing: border-box;
                    max-height: 400px;
                    padding: 0 40px 20px 27px;
                    overflow-y: auto;
                    .option {
                        display: flex;
                        color: #63a7f8;
                        line-height: 38px;
                        margin-top: 45px;
                        margin-left: 80px;
                        cursor: pointer;
                        .questionI {
                            display: inline-block;
                            width: 38px;
                            height: 38px;
                            border: 2px solid #63a7f8;
                            border-radius: 50%;
                            text-align: center;
                            line-height: 38px;
                            margin-right: 35px;
                            background-color: #fff;
                        }
                        span {
                            max-width: 650px;
                        }
                    }
                    .option.active {
                        .questionI {
                            background: #63a7f8;
                            color: #fff;
                        }
                    }
                    .writing-box {
                        .el-textarea__inner {
                            border: none;
                            line-height: 44px;
                            font-size: 24px;
                            color: #333;
                            background-color: transparent;
                            background: url("~@/assets/images/textarea_bg.png")
                                repeat;
                        }
                    }
                }
            }
        }
        .controlActive {
            margin-top: 34px;
            overflow: hidden;
            .prev {
                float: left;
            }
            .next {
                float: right;
            }
            .img {
                display: inline-block;
                width: 50px;
                height: 33px;
            }
        }
    }
    .dialog-wrapper {
        .dialog-body {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            .dialog-img {
                display: inline-block;
                width: 345px;
                height: 266px;
                margin-bottom: 30px;
            }
            .tips {
                width: 390px;
                text-align: center;
                font-size: 20px;
                color: #666;
                line-height: 40px;
                margin-bottom: 60px;
                .knowledge-power {
                    font-size: 30px;
                    color: #ffd328;
                    line-height: 60px;
                }
            }
        }
    }
}
</style>
