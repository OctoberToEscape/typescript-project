<template>
	<div class="control-nav">
		<ul class="outsite">
			<li
				class="nav-1"
				v-for="(item, index) in student_control.outside"
				:key="index.id"
				:style="{
					backgroundImage: 'url(' + item.src + ')',
				}"
				@click="handleControl(index)"
			>
				<span>{{ item.text }}</span>
			</li>
		</ul>
		<!-- 录音 -->
		<ul class="recording" v-if="recordeShow">
			<li
				v-for="(item, index) in student_control.middle.radio"
				:key="index.id"
				@click="recorde(index)"
			>
				<img :src="item" />
				<img
					src="@/assets/images/audio_play.png"
					v-if="index == 2"
					class="play_audio"
					v-show="playAudio_click"
				/>
			</li>
		</ul>
		<!-- 涂鸦 -->
		<ul class="graffiti" v-if="graffiti">
			<li
				v-for="(item, index) in student_control.middle.paintbrush"
				:key="index.id"
				:style="{
					backgroundImage: 'url(' + item + ')',
				}"
				@click="graffitiNav(index)"
			></li>
		</ul>
		<!-- 涂鸦3级 -->
		<ul class="graffiti-2" v-if="graffiti2">
			<li
				v-for="(item, index) in student_control.nexine"
				:key="index.id"
				:style="{
					backgroundImage: 'url(' + item.url + ')',
				}"
				@click="handleGraffiti(item.type, index)"
				:class="{ active: index == num }"
			></li>
		</ul>
		<!-- 单词本 -->
		<ul class="word-book" v-if="wordBook">
			<li
				v-for="(item, index) in student_control.middle.notebook"
				:key="index.id"
				:style="{
					backgroundImage: 'url(' + item + ')',
				}"
				@click="handleWord(index)"
			></li>
		</ul>
	</div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({
	name: "write-control",
})
export default class WriteControl extends Vue {
	@Prop({ default: false }) private playAudio_click!: boolean;
	private recordeShow: boolean = false;
	private graffiti: boolean = false;
	private graffiti2: boolean = false;
	private wordBook: boolean = false;
	private num: number = -1;
	private type: string = "0";
	private student_control: {
		[key: string]:
			| string[]
			| { [key: string]: Array<string> }
			| Array<{ [key: string]: string }>;
	} = {
		//外层(一级菜单)
		outside: [
			{
				src: require("@/assets/images/outside1.png"),
				text: "录音",
			},
			{
				src: require("@/assets/images/outside2.png"),
				text: "涂鸦",
			},
			{
				src: require("@/assets/images/outside3.png"),
				text: "标注",
			},
			{
				src: require("@/assets/images/outside4.png"),
				text: "单词本",
			},
		],
		//中间曾(二级菜单)
		middle: {
			radio: [
				require("@/assets/images/middle_1_1.png"),
				require("@/assets/images/middle_1_2.png"),
				require("@/assets/images/middle_1_3.png"),
			],
			paintbrush: [
				require("@/assets/images/middle_2_1.png"),
				require("@/assets/images/middle_2_2.png"),
				require("@/assets/images/middle_2_3.png"),
				require("@/assets/images/middle_1_2.png"),
			],
			notebook: [
				require("@/assets/images/middle_4_1.png"),
				require("@/assets/images/middle_4_2.png"),
			],
		},
		//最里层(三级菜单)
		nexine: [
			{
				type: "1",
				url: require("@/assets/images/nexine1.png"),
			},
			{
				type: "2",
				url: require("@/assets/images/nexine2.png"),
			},
			{
				type: "3",
				url: require("@/assets/images/nexine3.png"),
			},
			{
				type: "4",
				url: require("@/assets/images/nexine4.png"),
			},
		],
	};
	//点击外层
	private handleControl(index: number): void {
		if (index == 0) {
			//录音
			this.recordeShow = !this.recordeShow;
			this.graffiti = false;
			this.graffiti2 = false;
			this.wordBook = false;
		} else if (index == 1) {
			//涂鸦
			this.graffiti = !this.graffiti;
			this.graffiti2 = false;
			this.recordeShow = false;
			this.wordBook = false;
		} else if (index == 2) {
			//标注
			this.graffiti = false;
			this.graffiti2 = false;
			this.recordeShow = false;
			this.wordBook = false;
			this.$emit("handleMark");
		} else {
			//单词本
			this.wordBook = !this.wordBook;
			this.graffiti = false;
			this.graffiti2 = false;
			this.recordeShow = false;
		}
	}
	//涂鸦2级菜单
	private graffitiNav(index: number): void {
		if (index == 2) {
			this.graffiti2 = !this.graffiti2;
		} else if (index == 3) {
			this.$emit("handleReset");
		}
	}

	//录音
	private recorde(index: number): void {
		this.$emit("recorde", index);
	}

	//选择贴画
	private handleGraffiti(type: string, index: number): void {
		this.num = index;
		this.type = type;
		this.$emit("handleGraffiti", type);
	}
	//单词本
	private handleWord(index: number): void {
		if (index == 0) {
			this.$emit("handleWord");
		}
	}
}
</script>
<style lang="scss" scoped>
.control-nav {
	width: 42px;
	height: 210px;
	border: 1px solid #dfe1e5;
	background: #ffffff;
	position: absolute;
	right: -7%;
	top: 10%;
	padding: 10px 0;
	box-sizing: border-box;
	.outsite {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.nav-1 {
			width: 100%;
			height: 40px;
			background-repeat: no-repeat;
			background-size: contain;
			background-position: top center;
			position: relative;
			span {
				width: 56px;
				height: 26px;
				background: #ffffff;
				text-align: center;
				line-height: 26px;
				border-radius: 3px;
				color: #666;
				display: block;
				position: absolute;
				left: -68px;
				bottom: 0px;
				display: none;
				padding: 0px 5px;
			}
			&:hover {
				transition: background 0.5s ease;
				background: #e0e2e5;
				background-repeat: no-repeat;
				background-size: contain;
				background-position: top center;
				span {
					display: block;
				}
			}
		}
	}
	.recording {
		width: 42px;
		height: 160px;
		border: 1px solid #dfe1e5;
		background: #ffffff;
		padding: 10px 0;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: absolute;
		right: -45px;
		top: 0px;
		li {
			width: 100%;
			height: 40px;
			cursor: pointer;
			position: relative;
			img {
				width: 100%;
				height: 100%;
				display: block;
			}
			.play_audio {
				width: 100%;
				height: 100%;
				position: absolute;
				bottom: 1%;
				left: 0%;
			}
		}
	}
	.graffiti {
		width: 42px;
		height: 210px;
		border: 1px solid #dfe1e5;
		background: #ffffff;
		padding: 10px 0;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: absolute;
		right: -45px;
		top: 58px;
		li {
			width: 100%;
			height: 40px;
			background-repeat: no-repeat;
			background-size: contain;
			background-position: top center;
			cursor: pointer;
		}
	}
	.graffiti-2 {
		width: 42px;
		height: 210px;
		border: 1px solid #dfe1e5;
		background: #ffffff;
		padding: 10px 0;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: absolute;
		right: -89px;
		top: 165px;
		li {
			width: 100%;
			height: 40px;
			background-repeat: no-repeat;
			background-size: contain;
			background-position: top center;
			cursor: pointer;
		}
		.active {
			background: #f1f1f1;
			background-repeat: no-repeat;
			background-size: contain;
			background-position: top center;
		}
	}
	.word-book {
		width: 42px;
		height: 110px;
		border: 1px solid #dfe1e5;
		background: #ffffff;
		padding: 10px 0;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: absolute;
		right: -45px;
		bottom: -59px;
		li {
			width: 100%;
			height: 40px;
			background-repeat: no-repeat;
			background-size: contain;
			background-position: top center;
			cursor: pointer;
		}
	}
}
</style>
