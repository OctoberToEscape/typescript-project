<template>
    <el-container class="test-listen">
        <el-header>
            <ListenHeader />
        </el-header>
        <el-main>
            <tag
                :backName="backName"
                :title="componentsTitle"
                :show="show"
                :controlShow="controlShow"
                @_onBack="onBack"
                @_onVideoClick="handleControlClick"
            />
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
            </div>
            <!-- 空状态 -->
            <Empty text="内容生产中..." v-if="videoList.length == 0"></Empty>
        </el-main>
    </el-container>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import ListenHeader from "@/components/listen-header/index.vue";
import Empty from "@/components/empty/index.vue";
import tag from "@/components/listen-pageback/index.vue";
import {
    getVideos,
    getTestVideo,
    submitListenTime,
    getParentListenTime,
    parentFinishListen,
} from "@/api/parents/listen";
@Component({
    name: "test-listen",
    components: {
        ListenHeader,
        tag,
        Empty,
    },
})
export default class extends Vue {
    /**
     * @data
     * @return
     */
    private controlShow: boolean = false;
    private backName: string | null = "";
    private componentsTitle: string | (string | null)[] = "";
    private show: boolean = false;
    private id: string | (string | null)[] = "";
    private video_id: string = "";
    private videoList: Array<{ [key: string]: string }> = [];
    private index: number = 0;
    private watchTime: number = 0;
    private timer: any = null;
    private watchData: { [key: string]: number | string } = {
        duration: 0,
        video_id: "",
    };
    private timeDisplay: number = 0;

    created() {
        this.backName = sessionStorage.getItem("back-title");
        this.componentsTitle = this.$route.query.title;
        this.id = this.$route.query.id;
        this.$route.query.type == "listen"
            ? this.getListen(this.$route.query.id)
            : this.getTestListen(this.$route.query.id);

        this.timer = setInterval((): void => {
            this.watchTime++;
        }, 1000);
    }

    /**
     * @methods
     */

    //拿试听列表
    private getTestListen(id: string | (string | null)[]): void {
        getTestVideo(id).then((res: any): void => {
            this.videoList = res.data.data.videos;
            if (res.data.data.videos.length) this.controlShow = true;
        });
    }

    //拿听的列表
    private getListen(id: string | (string | null)[]): void {
        getVideos(id).then((res: any): void => {
            this.videoList = res.data.data.videos;
            if (res.data.data.videos.length) this.controlShow = true;
            this.getVideoLocalStorage(id);
        });
    }

    //从后端拿上次听的位置
    private getVideoLocalStorage(id: string | (string | null)[]): void {
        getParentListenTime(id).then((res: any) => {
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
    private onBack(): void {
        if (this.videoList.length) {
            //家长是否完成听课
            parentFinishListen({
                course_id: this.id,
                type: this.$route.query.type == "listen" ? 2 : 1,
                seconds: this.watchTime,
            });
            if (this.$route.query.type == "listen") {
                //提交听课记录
                submitListenTime({
                    course_id: this.id,
                    video_id: this.videoList[this.index].video_id,
                    duration: this.timeDisplay,
                });
            }
        }
        this.$router.go(-1);
    }

    //暂停播放按钮
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
        if (this.$route.query.type == "listen") {
            (this.$refs.video as any).currentTime = this.watchData.duration;
        }
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

    //试听||听，听完调接口
    private listen_Finish(): void {
        parentFinishListen({
            type: this.$route.query.type == "listen" ? 2 : 1,
            course_id: this.id,
            seconds: this.watchTime,
        }).then((res: any): void => {
            this.$message(res.data.msg);
        });
    }

    //上一张
    private prev(): void {
        if (this.index !== 0 && this.index > 0) {
            this.index--;
            this.video_id = this.videoList[this.index].video_id;
            this.show = false;
            this.watchData.duration = 0;
        }
    }
    //下一张
    private next(): void {
        if (this.index < this.videoList.length - 1) {
            this.index++;
            this.video_id = this.videoList[this.index].video_id;
            this.show = false;
            this.watchData.duration = 0;
        }
    }

    destroyed() {
        //移除定时器
        if (this.timer) clearInterval(this.timer);
    }
}
</script>
<style lang="scss" scoped>
.test-listen {
    width: 100%;
    min-width: 1200px;
    .el-header {
        padding: 0;
        height: 60px;
    }
    .el-main {
        padding: 0;
        height: calc(100vh - 60px);
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
        }
    }
}
</style>
