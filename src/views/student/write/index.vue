<template>
	<el-container class="student-write">
		<el-header>
			<Tag :backName="sc" :title="title" @_onBack="handleBack"></Tag>
		</el-header>
		<el-main>
			<div class="course-details" v-if="imgList.length">
				<!-- 左右切换 -->
				<div class="course-img">
					<div
						class="card"
						@mousedown="handleDown"
						:style="{
							backgroundImage:
								'url(' + imgList[index].banner_img + ')',
						}"
					></div>
					<img
						v-show="labelIcon"
						class="label_icon"
						src="@/assets/images/label_icon.png"
						@click="dailogLabel = true"
					/>
					<Control
						@handleReset="handleReset"
						@handleGraffiti="handleGraffiti"
						@handleWord="handleWord"
						@handleMark="handleMark"
						@recorde="handleRecorde"
						:playAudio_click="playAudio_click"
						:recorderTime="recorderTime"
					/>
					<!-- 涂鸦 -->
					<img
						class="icon"
						v-for="(item, index) in coord"
						:key="index.id"
						:src="
							item.type == 1
								? require('@/assets/images/nexine1.png')
								: item.type == 2
								? require('@/assets/images/nexine2.png')
								: item.type == 3
								? require('@/assets/images/nexine3.png')
								: require('@/assets/images/nexine4.png')
						"
						:style="{ top: item.imgY, left: item.imgX }"
					/>
					<img
						v-if="index != 0"
						class="prev"
						@click="prev"
						src="@/assets/images/prev.png"
					/>
					<img
						v-if="index != imgList.length - 1"
						class="next"
						@click="next"
						src="@/assets/images/next.png"
					/>
					<div
						class="submit"
						v-if="index == imgList.length - 1"
						@click="handleSubmit"
					>
						完成
					</div>
				</div>
			</div>
			<!-- 空 -->
			<Empty text="内容生产中..." v-if="imgList.length == 0" />
			<!-- 知识力弹窗 -->
			<el-dialog
				class="dialog-wrapper"
				:visible.sync="dialogVisible"
				width="680px"
				:close-on-click-modal="false"
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
			<!-- 标注弹窗 -->
			<el-dialog
				class="dialog-header dialog-label"
				:close-on-click-modal="false"
				:visible.sync="dailogLabel"
				title="标注"
				width="380px"
				center
			>
				<div class="label-box">
					<el-input
						type="textarea"
						:rows="7"
						placeholder="请输入标注内容~"
						v-model="labelContent"
					>
					</el-input>
				</div>
			</el-dialog>

			<!-- 单词本 -->
			<el-dialog
				class="dialog-header dialog-word-list"
				:close-on-click-modal="false"
				:visible.sync="dailogWordList"
				title="单词本"
				width="600px"
				center
			>
				<el-button
					class="add-new-word mb-1"
					type="primary"
					@click="addNewWord"
					>添加新单词</el-button
				>
				<div class="word-list" ref="wordListBox">
					<div class="no-words" v-if="wordList.length == 0">
						你还没有添加过单词哦~快去添加吧
					</div>
					<el-collapse v-else v-model="activeWord" accordion>
						<template v-for="item in wordList">
							<el-collapse-item
								:key="item.id"
								:title="item.word"
								:name="item.id"
							>
								<div class="item-li">
									词性:<span>{{ item.word_type }}</span>
								</div>
								<div class="item-li">
									定义:<span>{{ item.definition }}</span>
								</div>
								<div class="item-li">
									句子:<span>{{ item.sentence }}</span>
								</div>
								<div class="item-li">
									同义词:<span>{{ item.thesaurus }}</span>
								</div>
								<div class="item-li">
									反义词:<span>{{ item.antonyms }}</span>
								</div>
								<div class="edit-word">
									<el-button
										type="text"
										@click="deleteWord(item.id)"
										>删 除</el-button
									>
									<el-button
										type="primary"
										@click="editWord(item.id)"
										>编 辑</el-button
									>
								</div>
							</el-collapse-item>
						</template>
					</el-collapse>
				</div>
				<el-pagination
					layout="prev, pager, next"
					:total="wordListPage.total"
					:pager-count="11"
					:current-page.sync="wordListPage.page"
					:page-size="wordListPage.pageSize"
					style="text-align:center;padding:5px;"
					small
				>
				</el-pagination>
				<!-- 添加或编辑新单词 -->
				<el-dialog
					class="dialog-header dialog-edit-word"
					:close-on-click-modal="false"
					:visible.sync="dailogAddWord"
					width="605px"
					title="单词本"
					append-to-body
					center
				>
					<el-form
						label-position="top"
						:model="editWordForm"
						:rules="rules"
						ref="editWordForm"
					>
						<el-row :gutter="20">
							<el-col :span="12">
								<el-form-item label="单词" prop="word">
									<el-input
										v-model="editWordForm.word"
										:readonly="editWordId != null"
									>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="词性" prop="word_type">
									<el-select
										v-model="editWordForm.word_type"
										placeholder="请选择"
									>
										<el-option
											v-for="item in word_types"
											:key="item"
											:value="item"
										>
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="24">
								<el-form-item label="定义">
									<el-input
										v-model="editWordForm.definition"
										type="textarea"
									></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="24">
								<el-form-item label="句子">
									<el-input
										v-model="editWordForm.sentence"
										type="textarea"
									></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="同义词">
									<el-input
										v-model="editWordForm.thesaurus"
									></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="反义词">
									<el-input
										v-model="editWordForm.antonyms"
									></el-input>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
					<span slot="footer" class="dialog-footer">
						<el-button type="text" @click="dailogAddWord = false"
							>取 消</el-button
						>
						<el-button type="primary" @click="submitWord"
							>确 定</el-button
						>
					</span>
				</el-dialog>
			</el-dialog>
		</el-main>
	</el-container>
</template>
<script lang="ts">
import { realFormatSecond } from "@/utils/common";
import { StudentModule } from "@/store/module/student";
import { Component, Vue, Watch } from "vue-property-decorator";
import Tag from "@/components/listen-pageback/index.vue";
import Empty from "@/components/empty/index.vue";
import Control from "@/components/write-control/index.vue";
import studentCourseStatus from "@/components/student-course-btn/index.vue";
import { getKnowledgePower } from "@/api/student/index";
import { Form as ElForm, Input } from "element-ui";
import {
	getImages,
	getChildHistory,
	history_read_write,
	submitControl,
	set_history,
	getPower,
	getWords,
	addWords,
	wordDetail,
	editWords,
	deleteWords,
	setFile,
} from "@/api/student/write";
import element from "../../../plugins/element";
@Component({
	name: "student-write",
	components: { Tag, Empty, Control, studentCourseStatus },
})
export default class StudentWrite extends Vue {
	private recorder: any = new Vue.prototype.Recorder();
	private canRecorder: boolean = false;
	private recorderTime: string = "00:00";
	private resumePlay: boolean = false;
	private file: any = null;
	private playAudio_click: boolean = false;
	private sc: string = "";
	private sct: { [key: string]: string } = {};
	private title: string | (string | null)[] = "";
	private course_id: string | (string | null)[] = "";
	private isTest: string | (string | null)[] = "";
	private imgList: Array<{ [key: string]: string }> = [];
	private index: number = 0;
	private imgType: string = "0";
	private coord: Array<{ [key: string]: string }> = [];
	private timer: any = null;
	private browsingTime: number = 0;
	private dialogVisible: boolean = false;
	private dialogMess: { [key: string]: string | number } = {};
	private dailogLabel: boolean = false;
	private labelContent: string = "";
	private labelIcon: boolean = false;
	private dailogWordList: boolean = false;
	private wordList: Array<{ [key: string]: string }> = [];
	private activeWord: string = "";
	private activePage: any = null;
	private wordListPage: { [key: string]: number } = {
		page: 1,
		sumPage: 1,
		total: 1,
		pageSize: 8,
	};
	private dailogAddWord: boolean = false;
	private editWordId: string | null = null;
	private editWordForm: { [key: string]: string } = {
		word: "",
		word_type: "",
		definition: "",
		sentence: "",
		thesaurus: "",
		antonyms: "",
	};
	private word_types: Array<string> = [
		"名词",
		"动词",
		"形容词",
		"数词",
		"量词",
		"代词",
		"副词",
		"介词",
		"连词",
		"助词",
		"拟声词",
		"叹词",
	];
	private rules: {
		[key: string]: Array<{ [key: string]: string | boolean }>;
	} = {
		word: [{ required: true, message: "请输入单词" }],
		word_type: [{ required: true, message: "请选择词性" }],
	};

	created() {
		this.isTest = this.$route.query.isTest;
		this.sc = this.isTest ? "测试" : sessionStorage.sc;
		this.sct = JSON.parse(sessionStorage.sct);
		this.title = this.$route.query.title;
		this.course_id = this.$route.query.id;
		this.getCourseImg(this.$route.query.id);
		//开启定时器记录停留时间
		this.timer = setInterval((): void => {
			this.browsingTime++;
		}, 1000);
	}

	//拿数据列表
	private getCourseImg(id: string | (string | null)[]): void {
		getImages(id).then((res: any): void => {
			this.imgList = res.data.data.images;
			this.getHistory();
		});
	}
	//拿到历史记录
	private getHistory(): void {
		history_read_write(this.course_id).then((res: any): void => {
			this.find_Index(res.data.data.img_id);
		});
	}
	//寻找下标
	private find_Index(id: string | (string | null)[]): void {
		getImages(this.course_id).then((res: any) => {
			var index = res.data.data.images.findIndex(
				(item: any) => item.banner_id == id
			);
			if (index == -1) {
				this.index = 0;
			} else {
				this.index = index;
			}
			this.getChildHistory();
		});
	}

	//拿到小学生的操作历史
	private getChildHistory(): void {
		if (this.imgList.length) {
			const data = {
				course_id: this.course_id, //课程的id
				img_id: this.imgList[this.index].banner_id, //当前图片的id
			};
			//置空贴画数据
			this.coord = [];
			getChildHistory(data).then((res: any): void => {
				//小学生涂鸦
				this.coord = res.data.data.graffities;
				this.labelContent = res.data.data.content;
				this.labelIcon = res.data.data.content != "";
			});
		}
	}

	//提交小学生操作
	private addChildControl(where: string): void {
		var num: number = 0;
		if (where == "next") num = -1;
		else num = 1;
		//提交标注录音等
		submitControl({
			course_id: this.course_id, //课程的id
			img_id: this.imgList[this.index + num].banner_id, //当前图片的id
			content: this.labelContent, //标注内容
			graffities: this.coord, //小学生涂鸦数组
		});

		//提交操作图片下标记
		set_history({
			course_id: this.course_id,
			img_id: this.imgList[this.index].banner_id,
		});
	}

	//返回
	private handleBack(): void {
		if (this.imgList.length) {
			//提交标注录音等
			submitControl({
				course_id: this.course_id, //课程的id
				img_id: this.imgList[this.index].banner_id, //当前图片的id
				content: this.labelContent, //标注内容
				graffities: this.coord, //小学生涂鸦数组
			});
			//提交操作图片下标记
			set_history({
				course_id: this.course_id,
				img_id: this.imgList[this.index].banner_id,
			});
		}
		let url = this.isTest
			? "/student/exam?id=" + this.course_id + "&title=" + this.title
			: "/student/" + this.sct.topName + "/" + this.sct.secondName;
		this.$router.replace({ path: url });
	}

	//上一个
	private prev(): void {
		if (this.index != 0 && this.index > 0) this.index--;
		this.addChildControl("prev");
		this.getChildHistory();
	}

	//下一个
	private next(): void {
		if (this.index < this.imgList.length - 1) this.index++;
		this.addChildControl("next");
		this.getChildHistory();
	}

	//录音部分
	private handleRecorde(val: number): void {
		if (val == 0) {
			this.canRecorder = !this.canRecorder;
			if (this.canRecorder) {
				this.resumePlay = false;
				this.recorder.start().then(() => {
					//监听时长
					this.recorder.onprocess = (duration: number): void => {
						this.recorderTime = realFormatSecond(duration);
					};
					//监听播放结束
					this.recorder.onplayend = (): void => {
						this.playAudio_click = false;
						this.resumePlay = false;
					};
				});
			} else {
				this.file = this.recorder.getWAVBlob();
				this.$message({
					type: "info",
					message: "结束录音",
				});

				var reader = new FileReader();
				var rs = reader.readAsDataURL(this.file);

				reader.onload = (e: any) => {
					// console.log(e.target.result);
					var recorderSrc = e.target.result;
					let recorderFile = this.dataURLtoFile(recorderSrc, "file");
					let fd: any = new FormData();
					fd.append("file", recorderFile);
					setFile(fd).then((res: any) => {
						console.log(res);
					});
					// const instance = axios.create();
					// instance
					// 	.post(process.env.VUE_APP_BASE_API + "/upload", fd)
					// 	.then((res) => {
					// 		this.audio_url = res.data.data.audio_url;
					// 	});
				};
			}
		} else if (val == 1) {
			this.canRecorder = false;
			this.recorder.stop();
			this.recorder.destroy().then((): void => {
				this.recorderTime = "00:00";
			});
		} else if (val == 2) {
			//判断有录音与否
			if (this.recorderTime !== "00:00") {
				//判断录音录完与否
				if (this.canRecorder) {
					this.$message({
						type: "info",
						message: "正在录音中,请先结束录音",
					});
				} else {
					this.playAudio_click = !this.playAudio_click;
				}
			} else {
				this.$message({
					type: "info",
					message: "暂无录音",
				});
			}

			if (this.playAudio_click) {
				//有录音
				if (this.canRecorder) {
					this.$message({
						type: "info",
						message: "正在录音中,请先结束录音",
					});
				} else {
					//暂停后的继续播放
					if (this.resumePlay) {
						this.recorder.resumePlay();
					} else {
						//一开始播放
						this.recorder.play();
					}
				}
			} else {
				//暂停
				this.resumePlay = true;
				this.recorder.pausePlay();
			}
		}
	}

	//将base64转换为文件
	private dataURLtoFile(dataurl: any, filename: string): object {
		var arr = dataurl.split(","),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]),
			n = bstr.length,
			u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new File([u8arr], filename, { type: mime });
	}
	//贴画撤销
	private handleReset(): void {
		if (this.coord.length) this.coord.pop();
		else
			this.$message({
				showClose: true,
				message: "已经没有小贴画啦～",
				type: "error",
			});
	}

	//贴贴画
	private handleGraffiti(val: string): void {
		this.imgType = val;
	}

	//提交按钮
	private handleSubmit(): void {
		//提交标注录音等
		submitControl({
			course_id: this.course_id, //课程的id
			img_id: this.imgList[this.index].banner_id, //当前图片的id
			content: this.labelContent, //标注内容
			graffities: this.coord, //小学生涂鸦数组
		});
		//提交操作图片下标记
		set_history({
			course_id: this.course_id,
			img_id: this.imgList[this.index].banner_id,
		});
		this.interaction();
	}

	//提交按钮跟后端传参数
	private interaction(): void {
		getPower({
			course_id: this.course_id,
			seconds: this.browsingTime,
		}).then((res: any): void => {
			this.dialogMess = Object.assign(
				{ id: this.course_id, title: this.$route.query.title },
				res.data.data
			);
			this.dialogVisible = true;
			this.getKnowledgePower();
		});
	}

	//刷新知识力
	private getKnowledgePower(): void {
		getKnowledgePower().then((res: any): void => {
			if ((res.code = 0)) {
				StudentModule.UPDATA_KNOWLEDGE_POWER(res.data.knowledge_power);
			}
		});
	}

	//小学生贴画
	private handleDown(e: any): void {
		e = e || window.event;
		if (this.imgType !== "0") {
			var arr = {
				imgX: e.offsetX + "px",
				imgY: e.offsetY + "px",
				type: this.imgType,
			};
			this.coord.push(arr);
		}
	}

	//单词本
	private handleWord(): void {
		this.dailogWordList = true;
	}

	//标注
	private handleMark(): void {
		this.dailogLabel = true;
	}

	//知识力弹窗底部按钮
	private goStudy(val: { [key: string]: string }): void {
		sessionStorage.sct = JSON.stringify(this.sct);
		// 去考试
		if (val.type == "write") {
			this.dialogVisible = false;
		} else {
			this.$router.push({
				name: val.type,
				query: { id: val.id, title: val.title },
			});
		}
	}

	//拿单词之前操作的单词表
	private getWordList(): void {
		getWords({
			params: {
				page: this.wordListPage.page,
			},
		}).then((res: any): void => {
			if (res.code == 0) {
				// reset
				this.editWordId = null;
				this.wordListPage.total = res.data.total_num;
				this.wordListPage.sumPage = Math.ceil(
					res.data.total_num / this.wordListPage.pageSize
				);
				this.wordList = res.data.words;
			}
		});
	}

	// 去添加单词
	private addNewWord(): void {
		this.dailogAddWord = true;
		this.editWordId = null;
	}

	// 去编辑单词
	private editWord(id: string, index: number): void {
		this.dailogAddWord = true;
		this.editWordId = id;
		wordDetail(this.editWordId).then((res: any): void => {
			if (res.code == 0) {
				this.editWordForm = res.data;
			}
		});
	}

	//删除单词
	private deleteWord(id: string): void {
		deleteWords(id).then((res: any): void => {
			if (res.code == 0) {
				// 删除成功
				this.getWordList();
			}
		});
	}

	//重置表单
	private resetForm(): void {
		(this.$refs["editWordForm"] as ElForm).resetFields();
	}

	// 提交单词表单
	private submitWord(): void {
		(this.$refs["editWordForm"] as ElForm).validate((valid: boolean):
			| void
			| boolean => {
			if (valid) {
				let data = {
					word: this.editWordForm.word,
					word_type: this.editWordForm.word_type,
					definition: this.editWordForm.definition,
					sentence: this.editWordForm.sentence,
					thesaurus: this.editWordForm.thesaurus,
					antonyms: this.editWordForm.antonyms,
				};
				if (this.editWordId) {
					// 编辑单词
					editWords(this.editWordId, data).then((res: any): void => {
						if (res.code == 0) {
							// 编辑成功
							this.dailogAddWord = false;
							this.getWordList();
						}
					});
				} else {
					// 添加单词
					addWords(data).then((res: any): void => {
						if (res.code == 0) {
							// 添加成功
							this.dailogAddWord = false;
							this.wordListPage.page = 1;
							this.getWordList();
						}
					});
				}
			} else {
				return false;
			}
		});
	}

	@Watch("dailogLabel")
	//监听标注弹窗
	private changeDailogLabel(v: boolean): void {
		if (!v) {
			// 提交标注 并 置空
			submitControl({
				course_id: this.course_id, //课程的id
				img_id: this.imgList[this.index].banner_id, //当前图片的id
				content: this.labelContent, //标注内容
				graffities: this.coord, //小学生涂鸦数组
			}).then((res: any): void => {
				if (res.data.code == 0) {
					//标注成功
					this.labelIcon = true;
				}
			});
		}
	}

	@Watch("dailogWordList")
	//监听单词本弹窗
	private changeDailogWordList(v: boolean): void {
		if (v) {
			// 获取单词本
			this.getWordList();
		} else {
			this.wordListPage.page = 1;
			this.activeWord = "";
		}
	}

	@Watch("dailogAddWord")
	//监听添加编辑单词弹窗
	private changeDailogAddWord(v: boolean): void {
		if (!v) {
			this.resetForm();
		}
	}

	@Watch("wordListPage.page")
	//监听切换页数
	private changePage(v: boolean): void {
		this.getWordList();
	}

	destroyed() {
		//关闭定时器
		if (this.timer) clearInterval(this.timer);
	}
}
</script>
<style lang="scss" scoped>
.student-write {
	width: 100%;
	.el-header {
		padding: 0;
		height: 50px !important;
	}
	.el-main {
		width: 100%;
		height: calc(100vh - 110px) !important;
		.course-details {
			width: 100%;
			height: 100%;
			.course-img {
				width: 1000px;
				height: 750px;
				margin: auto;
				position: relative;
				.card {
					width: 100%;
					height: 100%;
					background-repeat: no-repeat;
					background-size: contain;
					background-position: top center;
				}
				.label_icon {
					position: absolute;
					top: 0px;
					left: 50px;
				}
				.icon {
					width: 20px;
					height: 20px;
					position: absolute;
				}
				.prev {
					position: absolute;
					bottom: 3%;
					left: -10%;
					cursor: pointer;
					width: 50px;
					height: 34px;
				}
				.next {
					position: absolute;
					bottom: 3%;
					right: -10%;
					cursor: pointer;
					width: 50px;
					height: 34px;
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
					bottom: 3%;
					right: -10%;
					cursor: pointer;
				}
			}
		}
		//知识力弹窗
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
		//标注弹窗
		.dialog-label {
			.label-box {
				box-sizing: border-box;
				width: 100%;
				height: 370px;
				overflow: hidden;
				padding: 0 15px;
				background: url("~@/assets/images/label_bg.png") no-repeat;
				background-size: contain;
			}
		}

		//单词本弹窗
		.dialog-word-list {
			.add-new-word {
				font-family: "DFPWaWaW5";
				font-size: 16px;
				border-radius: 5px;
				background-color: #63a7f8;
				border: none;
			}
			.word-list {
				border: 1px solid #e0e2e5;
				border-radius: 5px;
				padding: 1px;
				height: 336px;
				overflow-y: auto;
				.no-words {
					width: 100%;
					text-align: center;
					line-height: 80px;
				}
				.el-collapse {
					border-radius: 5px;
					.item-li {
						display: flex;
						span {
							max-width: 450px;
						}
					}
				}
			}
		}
	}
}
</style>
