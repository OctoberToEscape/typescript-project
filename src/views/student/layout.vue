<template>
	<el-container class="student-layout">
		<el-header class="header">
			<div class="logo fLeft">
				<router-link class="fLeft" :to="{ path: '/student' }" tag="div">
					<div class="logo-img fLeft"></div>
					<h1 class="fLeft">白鹿洞大语文学习平台</h1>
					<div class="back-home fLeft" v-show="!isIndex">
						<img src="@/assets/images/home.png" />
					</div>
				</router-link>
				<router-link
					class="fLeft change-model"
					:to="{ name: 'courseLearning' }"
					tag="div"
					><img src="@/assets/images/ic_change_model.png" /><span
						>切换至家长模式</span
					></router-link
				>
			</div>
			<div class="user-info">
				<div class="knowlege-score fLeft">
					<img
						class="score-img"
						src="@/assets/images/knowledge_score.png"
					/>
					<div class="score">
						<p>{{ knowledge_power }}</p>
						<p>知识力</p>
					</div>
				</div>
				<el-dropdown
					class="fLeft user-name"
					trigger="click"
					@command="handleCommand"
				>
					<div>
						<img v-show="userAvatar" :src="userAvatar" /><img
							v-show="!userAvatar"
							src="@/assets/images/default.png"
						/><span class="name">{{ userName }}</span>
					</div>
					<el-dropdown-menu
						class="user-info-dropdown"
						slot="dropdown"
					>
						<el-dropdown-item disabled="disabled"
							>白鹿来信</el-dropdown-item
						>
						<el-dropdown-item disabled="disabled"
							>学习记录</el-dropdown-item
						>
						<el-dropdown-item disabled="disabled"
							>我的书信</el-dropdown-item
						>
						<el-dropdown-item command="logout"
							>退出</el-dropdown-item
						>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
		</el-header>
		<el-main class="pa-0 student-bg">
			<router-view></router-view>
		</el-main>
	</el-container>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { StudentModule } from "@/store/module/student";
import { UserModule } from "@/store/module/userInfo";
import { getKnowledgePower } from "@/api/student/index";
@Component({
	name: "student-layout",
})
export default class StudentLayout extends Vue {
	/**
	 * @data
	 * @return
	 */
	private userName: string = "";
	private userAvatar: string = "";
	private isIndex: boolean = true;

	/**
	 * @methods
	 */
	private handleCommand(command: any) {
		if (command == "logout") {
			this.logout();
		}
	}
	//退出登录
	private logout() {
		localStorage.clear();
		this.$router.push({ name: "login" });
	}

	/**
	 * @computed
	 */
	//计算知识力
	private get knowledge_power(): any {
		return StudentModule.knowledge_power;
	}

	mounted() {
		// 切换
		UserModule.getCharacter("student");
		// 获取用户名
		this.userName = localStorage.tel;
		// 判断是否是首页
		const routerPath = window.location.href
			.split("student/")[1]
			.split("/")[0];
		this.isIndex = routerPath === "index";
		//获取知识力
		getKnowledgePower().then((res: any) => {
			StudentModule.UPDATA_KNOWLEDGE_POWER(res.data.knowledge_power);
		});
	}

	@Watch("$route")
	private changeRoute(val: string): void {
		const routerPath = window.location.href
			.split("student/")[1]
			.split("/")[0];
		this.isIndex = routerPath === "index";
	}
}
</script>
<style lang="scss" scoped>
.student-layout {
	height: 100vh;
	width: 100%;
	min-width: 1200px;
	overflow-x: scroll;
	font-family: "DFPWaWaW5";
	color: #333;
	.fLeft {
		float: left;
	}
	.header {
		padding: 0 120px 0 85px;
		background-color: #367bce;
		height: 60px;
		overflow: hidden;
		.logo {
			display: flex;
			align-items: center;
			margin-top: 16px;
			cursor: pointer;
			.logo-img {
				width: 29px;
				height: 29px;
				background: url(~@/assets/images/logo2.png) no-repeat;
				background-size: contain;
			}
			h1 {
				font-size: 22px;
				font-weight: 500;
				color: #fff;
				line-height: 29px;
				margin: 0 10px 0 9px;
			}
			.change-model {
				width: 114px;
				height: 22px;
				border-radius: 13px;
				font-size: 12px;
				color: #63a7f8;
				margin-top: 1px;
				background: #fff;
				line-height: 22px;
				img {
					width: 15px;
					height: 14px;
					margin: 0 3px 0 7px;
					vertical-align: -3px;
				}
			}
		}
		.user-info {
			float: right;
			color: #fff;
			line-height: 60px;
			.knowlege-score {
				display: flex;
				text-align: right;
				color: #c2c8d0;
				line-height: 16px;
				margin-right: 50px;
				margin-top: 14px;
				.score-img {
					width: 39px;
					height: 33px;
					margin-right: 9px;
				}
			}
			.el-dropdown.user-name {
				color: #fff;
				line-height: 30px;
				margin-top: 15px;
				img {
					width: 30px;
					height: 30px;
					margin-right: 10px;
				}
				.el-dropdown-selfdefine {
					cursor: pointer;
				}
			}
		}
	}
	.student-bg {
		background: url("~@/assets/images/student_bg.jpg") no-repeat;
		background-size: cover;
	}
}
</style>
