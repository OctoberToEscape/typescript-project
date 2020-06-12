<template>
	<div class="details">
		<!-- 中间 -->
		<div class="tag">
			<div class="contral" @click="handleBack">
				<img src="@/assets/images/back2.png" />
				<span>返回{{ sc }}</span>
			</div>
			<div class="title">{{ course_title }}</div>
			<div
				class="player"
				@click="user_play"
				:class="video_Lis.length ? 'player' : 'no_player'"
			>
				<img
					:src="
						video_control
							? require('@/assets/images/bofang.png')
							: require('@/assets/images/zanting.png')
					"
				/>
			</div>
		</div>

		<!-- 内容区域 -->
		<main>
			<div class="player_box">
				<!-- <div class="loading">
                    视频加载中。。。
                </div> -->
				<video
					ref="video"
					v-if="video_Lis.length"
					:src="video_Lis[index].video_url"
					autoplay
					:loop="false"
					@ended="onEnded"
					@play="onPlayer"
					@pause="onPause"
					@timeupdate="onTimeupdate"
				></video>
				<!-- 左右切换 -->
				<img
					v-show="video_Lis.length"
					v-if="index != 0"
					class="prev"
					@click="handlePrev"
					src="@/assets/images/prev.png"
				/>
				<img
					v-show="video_Lis.length"
					v-if="index != video_Lis.length - 1"
					class="next"
					@click="handleNext"
					src="@/assets/images/next.png"
				/>
				<div
					class="submit"
					v-show="video_Lis.length"
					v-if="index == video_Lis.length - 1"
					@click="handleSubmit"
				>
					完成
				</div>
			</div>
			<div class="empty" v-if="video_Lis.length == 0">
				<div class="null">
					<empty />
				</div>
			</div>
		</main>

		<!-- 知识力弹窗 -->
		<!-- <el-dialog
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
		</el-dialog> -->
	</div>
</template>

<script>
import store from "@/store";
// import studentCourseStatus from "@/components/student-course-status";
import empty from "@/components/empty/index.vue";
// import { getVideos } from "@/api/student/listen";
// import { mapMutations } from "vuex";
// import {
// 	submitListenTime,
// 	getStudentListenTime,
// 	studentFinishListen,
// } from "@/api/student/listen";
import { getKnowledgePower } from "@/api/student/index";
export default {
	components: { empty },
	data() {
		return {
			sc: "",
			sct: "",
			course_title: "",
			video_Lis: [],
			video_id: "",
			listen_Type: 0,
			timeDisplay: 0,
			video_control: false,
			index: 0,
			muted: true,
			course_id: "",
			//观看时间
			watchTime: 0,
			//定时器名字
			timer: null,
			watchData: {
				duration: 0,
				video_id: "",
			},
			dialogVisible: false,
			// dialogMess: {
			//     show_test_button: 1,
			//     is_can_test: 1
			// },
			dialogMess: {},
			touchNum: 0,
		};
	},
	created() {
		//将header换成学生
		// this.changeCharacter({
		// 	character: "student",
		// });

		//拿听课记录
		this.course_title = this.$route.query.title;
		this.course_id = this.$route.query.id;

		//拿数据
		this.getVideoList(this.course_id);

		//开启定时器观察再页面停留时间
		this.timer = setInterval(() => {
			this.watchTime++;
		}, 1000);
	},
	mounted() {
		this.sc = sessionStorage.sc;
		this.sct = JSON.parse(sessionStorage.sct);
	},
	methods: {
		// ...mapMutations(["changeCharacter"]),
		goStudy(val) {
			// 记录此刻tab
			localStorage.sct = JSON.stringify(this.sct);
			if (val.type == "listen_student") {
				this.dialogVisible = false;
			} else {
				this.$router.push({
					name: val.type,
					query: { id: val.id, title: val.title },
				});
			}
		},
		//拿视频列表
		getVideoList(id) {
			//听
			getVideos(id).then((res) => {
				this.title = res.data.data.title;
				this.video_Lis = res.data.data.videos;
				this.getVideoLocalStorage(id);
			});
		},
		//视频缓存下标
		getVideoLocalStorage(id) {
			getStudentListenTime(id).then((res) => {
				//寻找id是否存在
				var index = this.video_Lis.findIndex(
					(item) => item.video_id == res.data.data.video_id
				);
				if (index == -1) {
					this.index = 0;
				} else {
					this.index = index;
					this.watchData.video_id = res.data.data.video_id;
					this.watchData.duration = res.data.data.duration;
				}

				if (this.video_Lis.length) {
					this.video_id = this.video_Lis[this.index].video_id;
				}
			});
		},

		//返回上一页
		handleBack() {
			if (this.video_Lis.length) {
				//提交听的时间记录
				submitListenTime({
					course_id: this.course_id,
					video_id: this.video_id,
					duration: this.timeDisplay,
				});
			}

			let url =
				"/student/" + this.sct.topName + "/" + this.sct.secondName;
			this.$router.replace({ path: url });
		},

		//暂停播放
		user_play() {
			this.video_control = !this.video_control;
			this.touchNum++;
			if (!this.video_control) {
				//暂停时关闭定时器，防止不看视频继续算时间
				clearInterval(this.timer);
				this.$refs.video.pause();
			} else {
				//打开定时器继续计时
				this.timer = setInterval(() => {
					this.watchTime++;
				}, 1000);
				this.$refs.video.play();
			}
		},
		//上一个
		handlePrev() {
			if (this.index != 0 && this.index > 0) {
				this.index--;
			}
			this.video_id = this.video_Lis[this.index].video_id;
			this.video_control = true;
			this.watchData.duration = 0;
		},
		//下一个
		handleNext() {
			if (this.index < this.video_Lis.length - 1) {
				this.index++;
			}
			this.video_id = this.video_Lis[this.index].video_id;
			this.video_control = true;
			this.watchData.duration = 0;
		},

		//监听播放进度
		onTimeupdate() {
			var timeDisplay;
			//用秒数来显示当前播放进度
			if (this.$refs.video) {
				timeDisplay = Math.floor(this.$refs.video.currentTime);
				this.timeDisplay = timeDisplay;
			}
		},

		//监听结束切换下一个视频
		onEnded() {
			if (this.index < this.video_Lis.length - 1) {
				this.index++;
			} else if (this.index == this.video_Lis.length - 1) {
				this.$refs.video.currentTime =
					Math.floor(this.$refs.video.duration) - 0.1;
				this.$refs.video.pause();
			}
			this.video_control = false;
			this.watchData.duration = 0;
		},
		//提交获取知识力
		handleSubmit() {
			submitListenTime({
				course_id: this.course_id,
				video_id: this.video_id,
				duration: this.timeDisplay,
			}).then((res) => {
				if (res.data.code == 0) {
					this.listen_Finish();
				}
			});
			this.$refs.video.pause();
		},
		//重刷知识力
		// getKnowledgePower() {
		// 	//获取知识力
		// 	getKnowledgePower()
		// 		.then((res) => {
		// 			if (res.code == 0) {
		// 				// console.log(res.data.knowledge_power);
		// 				store.dispatch(
		// 					"UPDATA_KNOWLEDGE_POWER",
		// 					res.data.knowledge_power
		// 				);
		// 			} else {
		// 				this.errorMes(res.msg);
		// 			}
		// 		})
		// 		.catch((err) => {
		// 			this.errorMes("请求失败");
		// 		});
		// },
		//听，听完调接口
		listen_Finish() {
			//获取知识力
			studentFinishListen({
				course_id: this.course_id,
				seconds: this.watchTime,
			}).then((res) => {
				if (res.data.data.is_listen_complete == 2) {
					this.$refs.video.pause();
					this.$refs.video.currentTime = 0;
				}
				this.dialogMess = Object.assign(
					{
						id: this.course_id,
						title: this.course_title,
					},
					res.data.data
				);
				this.dialogVisible = true;
				// this.getKnowledgePower();
			});
		},
		//监听播放
		onPlayer() {
			this.video_control = true;
			if (this.touchNum == 0) {
				this.$refs.video.currentTime = this.watchData.duration;
			}
		},
		//监听暂停
		onPause() {
			this.video_control = false;
		},
	},
	beforeDestroy() {
		if (this.video_Lis.length) {
			//清除监听
			this.$refs.video.removeEventListener("ended", this.onEnded, true);
			this.$refs.video.removeEventListener(
				"timeupdate",
				this.onTimeupdate,
				true
			);
			this.$refs.video.removeEventListener("play", this.onPlayer, true);
			this.$refs.video.removeEventListener("pause", this.onPause, true);
		}
	},
	destroyed() {
		//移除定时器
		clearInterval(this.timer);
	},
};
</script>
<style lang="scss" scoped>
.details {
	width: 100%;
	height: calc(100% - 110px);
	// 中间
	.tag {
		width: 100%;
		height: 50px;
		background: #99cefa;
		padding: 0px 130px;
		box-sizing: border-box;
		min-width: 1200px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: "DFPWaWaW5";
		// margin-bottom: 20px;
		.contral {
			height: 100%;
			cursor: pointer;
			img {
				width: 18px;
				height: 18px;
				margin-right: 10px;
				vertical-align: middle;
			}
			span {
				color: #000;
				font-size: 16px;
				vertical-align: middle;
				line-height: 50px;
			}
		}
		.title {
			line-height: 50px;
			color: #000;
			font-size: 16px;
			font-weight: bold;
		}
		.player,
		.no_player {
			width: 36px;
			height: 36px;
			cursor: pointer;
			img {
				width: 100%;
				height: 100%;
			}
		}
		.no_player {
			opacity: 0;
			z-index: -1;
		}
	}
	//内容区
	main {
		width: 100%;
		padding: 0 220px;
		box-sizing: border-box;
		padding-top: 30px;
		min-width: 1200px;
		height: 100%;
		position: relative;
		.player_box {
			min-width: 55.8%;
			width: 1000px;
			margin: auto;
			position: relative;

			video {
				display: block;
				width: 100%;
				height: 750px;
			}
			img {
				cursor: pointer;
				width: 50px;
				height: 34px;
			}
			.prev {
				position: absolute;
				bottom: 4%;
				left: -9%;
			}
			.next {
				position: absolute;
				bottom: 4%;
				right: -9%;
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
		.empty {
			width: 100%;
			height: 100%;
			.null {
				padding-top: 200px;
				box-sizing: border-box;
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
