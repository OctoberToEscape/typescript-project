<template>
	<el-container class="indent">
		<el-header>
			<el-row :gutter="20" align="middle" type="flex">
				<el-col :span="11">
					<div class="logo">
						<img src="@/assets/images/logo.png" alt="logo" />
						<h3>白鹿洞大语文学习平台</h3>
						<div class="cutbtn" @click="handleChild">
							<img
								src="@/assets/images/child_icon.png"
								alt="小孩"
							/>
							<p>切换学生模式</p>
						</div>
					</div>
				</el-col>
				<el-col :span="8">
					<el-menu
						:default-active="activeIndex"
						class="el-menu-demo"
						mode="horizontal"
						@select="handleSelect"
					>
						<el-menu-item index="1">订单支付</el-menu-item>
						<el-menu-item index="2">课程学习</el-menu-item>
					</el-menu>
				</el-col>
				<el-col :span="6">
					<div class="user" id="user_drop">
						<el-dropdown
							trigger="click"
							class="user"
							@command="handleCommand"
							placement="bottom-start"
						>
							<span class="el-dropdown-link">
								<div class="demo-basic--circle">
									<div class="block">
										<el-avatar
											:size="30"
											:src="circleUrl"
										></el-avatar>
										<span>{{ user_tel }}</span>
									</div>
								</div>
							</span>
							<el-dropdown-menu
								slot="dropdown"
								style="width: 100px;"
							>
								<el-dropdown-item
									command
									split-button
									style="width:100%;height40px;line-height:40px;padding:0px 10px;box-sizing: border-box;text-align:center"
								>
									<img
										src="@/assets/images/back.png"
										alt=""
										style="vertical-align:middle;margin-right:10px"
									/>
									<span style="vertical-align:middle"
										>退出</span
									>
								</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</div>
				</el-col>
			</el-row>
		</el-header>
		<el-container>
			<el-main>
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { UserModule } from "@/store/module/userInfo";
import { userStatus } from "@/api/login/login";
import { Dictionary } from "vue-router/types/router";
@Component({
	name: "layout",
})
export default class layout extends Vue {
	/**
	 * @data
	 * @return
	 */
	private activeIndex: string = "2";
	private circleUrl: string =
		"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";
	private user_tel: string | null = "";
	private user_order_type: Dictionary<
		string | (string | null)[] | null | undefined
	> = {};
	created() {
		//修改端store
		UserModule.getCharacter("parents");
		this.user_tel = localStorage.getItem("tel");

		// 刷新保持高亮
		let pathName: string = window.location.pathname;
		if (pathName == "/indent") this.activeIndex = "1";
		else this.activeIndex = "2";

		//拿到用户购买状态
		userStatus().then((res: any): void => {
			this.user_order_type = res.data.data;
		});
	}

	/**
	 * @methods
	 */

	//切换支付和学习路由
	private handleSelect(key: string): void {
		if (key == "1") {
			this.$router.push({
				name: "indent",
				query: {
					type: this.user_order_type.account_type,
					end_time: this.user_order_type.end_time,
					is_buy: this.user_order_type.is_buy,
				},
			});
		} else {
			this.$router.push({
				name: "study",
			});
		}
	}
	//退出登录
	private handleCommand(): void {
		localStorage.clear();
		this.$router.push({
			name: "login",
		});
	}
	//跳往学生端
	private handleChild(): void {
		if (this.user_order_type.is_buy) {
			UserModule.getCharacter("student");
			this.$router.push({
				path: "/student",
			});
		} else {
			this.$message({
				showClose: true,
				message: "没有权限,请先购买～",
				type: "error",
			});
		}
	}
}
</script>
<style lang="scss" scoped>
.el-container {
	width: 100%;
	height: 100vh;
}
.indent {
	width: 100%;
	height: 100vh;
	min-width: 1200px;
	.el-header {
		padding: 0px;
		z-index: 2;
		padding: 0px 120px 0 85px;
		width: 100%;
		display: flex;
		justify-content: space-between !important;
		align-items: center;
		background: #fff;
		position: relative;
		box-sizing: border-box;
		min-width: 1200px;
		.el-row {
			width: 100%;
			.logo {
				display: flex;
				align-items: center;
				height: 100% !important;
				img {
					width: 29px;
					height: 29px;
					margin-right: 10px;
				}
				h3 {
					color: #333333;
					font-size: 22px;
					margin-right: 10px;
				}
				.cutbtn {
					cursor: pointer;
					display: flex;
					padding: 0px 7px;
					box-sizing: border-box;
					align-items: center;
					width: 114px;
					height: 22px;
					background: linear-gradient(
						-87deg,
						rgba(99, 167, 248, 1),
						rgba(152, 206, 250, 1)
					);
					border-radius: 13px;
					img {
						width: 15px;
						height: 15px;
						margin: 6px;
					}
					p {
						font-size: 12px;
						color: #fff;
					}
				}
			}
			.el-menu-demo {
				width: 300px;
				display: flex;
				justify-content: space-around;
				border: none;
			}
			.user {
				height: 100%;
				.user {
					float: right;
					.block {
						display: flex;
						align-items: center;
						span {
							margin-left: 5px;
							color: #333333;
						}
					}
				}
				.el-dropdown-link {
					cursor: pointer;
					color: #409eff;
				}
				.el-icon-arrow-down {
					font-size: 12px;
				}
				.demonstration {
					display: block;
					color: #8492a6;
					font-size: 14px;
					margin-bottom: 20px;
				}
			}
		}
	}
	.el-main {
		width: 100%;
		background: #f4f4f4;
		padding: 10px 50px 30px 50px;
		box-sizing: border-box;
	}
}
</style>
