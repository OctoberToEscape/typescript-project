<template>
    <el-container class="student-listen">
        <!-- 二级tag -->
        <el-header>
            <Tag
                :backName="sc"
                :title="title"
                @_onBack="handleBack"
                :show="show"
                @_onVideoClick="handleControlClick"
                :controlShow="controlShow"
            />
        </el-header>
        <!-- video区域 -->
        <el-main>
            <div class="video-box" v-if="videoList.length">
                <video
                    ref="video"
                    :src="videoList[index].video_url"
                    autoplay
                    :loop="false"
                    @ended="onEnded"
                    @play="onPlayer"
                    @pause="onPause"
                    @timeupdate="onTimeupdate"
                ></video>
                <!-- 左右切换 -->
                <img
                    v-if="index !== 0"
                    class="prev"
                    @click="prev"
                    src="@/assets/images/prev.png"
                />
                <img
                    v-if="index != videoList.length - 1"
                    class="next"
                    @click="next"
                    src="@/assets/images/next.png"
                />
                <div
                    class="submit"
                    v-if="index == videoList.length - 1"
                    @click="handleSubmit"
                >
                    完成
                </div>
            </div>
            <!-- 空状态 -->
            <Empty text="内容生产中..." v-if="videoList.length == 0"></Empty>
        </el-main>

        <!-- 弹窗 -->
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
    </el-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Empty from "@/components/empty/index.vue";
import Tag from "@/components/listen-pageback/index.vue";
import studentCourseStatus from "@/components/student-course-btn/index.vue";
import {
    getVideoList,
    getStudentListenTime,
    submitListenTime,
    studentFinishListen,
} from "@/api/student/listen";
import { getKnowledgePower } from "@/api/student/index";
import { StudentModule } from "@/store/module/student";
@Component({
    name: "student-listen",
    components: { Tag, Empty, studentCourseStatus },
})
export default class StudentListen extends Vue {
    private sc: string = "";
    private sct: { [key: string]: string } = {};
    private title: string | (string | null)[] = "";
    private show: boolean = false;
    private videoList: Array<{ [key: string]: string }> = [];
    private index: number = 0;
    private controlShow: boolean = false;
    private timer: any = null;
    private watchTime: number = 0;
    private video_id: string = "";
    private watchData: { [key: string]: number | string } = {
        duration: 0,
        video_id: "",
    };
    private timeDisplay: number = 0;
    private dialogVisible: boolean = false;
    private dialogMess: { [key: string]: string | number } = {};
    created() {
        this.sc = sessionStorage.sc;
        this.sct = JSON.parse(sessionStorage.sct);
        this.title = this.$route.query.title;
        //拿视频列表
        this.getCourseList(this.$route.query.id);
        //开启定时器
        this.timer = setInterval((): void => {
            this.watchTime++;
        }, 1000);
    }

    //拿听课视频列表详情
    private getCourseList(id: string | (string | null)[]): void {
        getVideoList(id).then((res: any) => {
            this.videoList = res.data.data.videos;
            if (res.data.data.videos.length) this.controlShow = true;
            this.getVideoLocalStorage(id);
        });
    }

    //从后端拿上次听的位置
    private getVideoLocalStorage(id: string | (string | null)[]): void {
        getStudentListenTime(id).then((res: any) => {
            //寻找id是否存在
            var index = this.videoList.findIndex(
                (item) => item.video_id == res.data.data.video_id
            );
            if (index == -1) {
                this.index = 0;
            } else {
                this.index = index;
                this.watchData.video_id = res.data.data.video_id;
                this.watchData.duration = res.data.data.duration;
            }
            if (this.videoList.length) {
                this.video_id = this.videoList[this.index].video_id;
            }
        });
    }

    //返回上一页
    private handleBack(): void {
        if (this.videoList.length) {
            //提交
            submitListenTime({
                course_id: this.$route.query.id,
                video_id: this.video_id,
                duration: this.timeDisplay,
            });
        }

        let url = "/student/" + this.sct.topName + "/" + this.sct.secondName;
        this.$router.replace({ path: url });
    }

    //播放暂停
    private handleControlClick(val: boolean): void {
        this.show = val;
        if (!this.show) {
            //暂停播放
            clearInterval(this.timer);
            (this.$refs.video as any).pause();
        } else {
            //打开定时器继续计时
            this.timer = setInterval(() => {
                this.watchTime++;
            }, 1000);
            (this.$refs.video as any).play();
        }
    }

    //监听播放
    private onPlayer(): void {
        this.show = true;
        (this.$refs.video as any).currentTime = this.watchData.duration;
    }

    //监听暂停
    private onPause(): void {
        this.show = false;
    }

    //监听播放进度
    private onTimeupdate(): void {
        var timeDisplay;
        //用秒数来显示当前播放进度
        if (this.$refs.video) {
            timeDisplay = Math.floor((this.$refs.video as any).currentTime);
            this.timeDisplay = timeDisplay;
        }
    }

    //监听结束切换下一个视频
    private onEnded(): void {
        if (this.index < this.videoList.length - 1) {
            this.index++;
        } else if (this.index == this.videoList.length - 1) {
            (this.$refs.video as any).currentTime =
                Math.floor((this.$refs.video as any).duration) - 0.1;
            (this.$refs.video as any).pause();
            this.listen_Finish();
        }
        this.show = false;
        this.watchData.duration = 0;
    }

    //听完调取接口
    private listen_Finish(): void {
        //获取知识力
        studentFinishListen({
            course_id: this.$route.query.id,
            seconds: this.watchTime,
        }).then((res: any) => {
            if (res.data.data.is_listen_complete == 2) {
                (this.$refs.video as any).pause();
                (this.$refs.video as any).currentTime = 0;
            }
            this.dialogMess = Object.assign(
                {
                    id: this.$route.query.id,
                    title: this.$route.query.title,
                },
                res.data.data
            );
            this.dialogVisible = true;
            this.getKnowledgePower();
        });
    }

    //刷新知识力
    private getKnowledgePower(): void {
        getKnowledgePower().then((res: any) => {
            if (res.code == 0) {
                StudentModule.UPDATA_KNOWLEDGE_POWER(res.data.knowledge_power);
            }
        });
    }

    //上一个
    private prev(): void {
        if (this.index !== 0 && this.index > 0) {
            this.index--;
            this.video_id = this.videoList[this.index].video_id;
            this.show = false;
            this.watchData.duration = 0;
        }
    }

    //下一个
    private next(): void {
        if (this.index < this.videoList.length - 1) {
            this.index++;
            this.video_id = this.videoList[this.index].video_id;
            this.show = false;
            this.watchData.duration = 0;
        }
    }

    //完成按钮
    private handleSubmit(): void {
        submitListenTime({
            course_id: this.$route.query.id,
            video_id: this.video_id,
            duration: this.timeDisplay,
        }).then((res: any) => {
            if (res.data.code == 0) {
                this.listen_Finish();
            }
        });
        (this.$refs.video as any).pause();
    }

    //跳转哪个页面
    private goStudy(val: any): void {
        // 记录此刻tab
        sessionStorage.sct = JSON.stringify(this.sct);

        if (val.type == "listen_child") {
            this.dialogVisible = false;
        } else {
            this.$router.push({
                name: val.type,
                query: { id: val.id, title: val.title },
            });
        }
    }

    destroyed() {
        //移除定时器
        if (this.timer) clearInterval(this.timer);
    }
}
</script>
<style lang="scss" scoped>
.student-listen {
    width: 100%;
    .el-header {
        padding: 0;
        height: 50px !important;
    }
    .el-main {
        padding: 0;
        height: calc(100vh - 110px);
        .video-box {
            width: 1000px;
            height: 750px;
            margin: auto;
            margin-top: 20px !important;
            position: relative;
            video {
                width: 100%;
                height: 100%;
            }
            img {
                width: 50px;
                height: 34px;
                position: absolute;
                bottom: 5%;
                cursor: pointer;
            }
            .prev {
                left: -10%;
            }
            .next {
                right: -10%;
            }
            .submit {
                width: 70px;
                height: 46px;
                background: #63a7f8;
                line-height: 46px;
                border-radius: 5px;
                color: #fff;
                font-size: 28px;
                font-weight: bold;
                text-align: center;
                position: absolute;
                bottom: 4%;
                right: -9%;
                cursor: pointer;
            }
        }
    }
    .dialog-wrapper {
        .el-dialog__header {
            padding: 0;
            .el-dialog__headerbtn {
                top: -4px;
                right: -20px;
                .el-dialog__close {
                    color: #fff;
                }
            }
        }
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
                text-align: center;
                padding: 0 50px;
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
