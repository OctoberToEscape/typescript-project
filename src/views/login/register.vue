<template>
	<el-container class="register">
		<!-- 顶部 -->
		<el-header>
			<HeaderWarp
				name="大语文学习平台"
				text="已有账号，请"
				maybe="登录"
				route="login"
			/>
		</el-header>
		<!-- 内容区域 -->
		<el-main>
			<div class="register_form">
				<div class="left"></div>
				<div class="right">
					<p>注册</p>
					<div class="choose">
						<el-radio-group v-model="radio" class="radio_lis">
							<el-radio :label="3" disabled>机构</el-radio>
							<el-radio :label="2" disabled>老师</el-radio>
							<el-radio :label="1">学生家长</el-radio>
						</el-radio-group>
					</div>
					<!-- form表单 -->
					<el-form
						:model="ruleForm"
						status-icon
						:rules="rules"
						ref="registerForm"
						class="login-form"
						size="medium"
					>
						<el-form-item prop="username" class="item-from">
							<label for="username">输入手机号</label>
							<el-input
								id="username"
								type="text"
								v-model="ruleForm.username"
								autocomplete="off"
							></el-input>
						</el-form-item>
						<el-form-item prop="code" class="item-from">
							<label>输入验证码</label>
							<el-row :gutter="15">
								<el-col :span="15">
									<el-input
										v-model="ruleForm.code"
										minlength="6"
										maxlength="6"
										autocomplete="off"
									></el-input>
								</el-col>
								<el-col :span="9">
									<el-button
										style="width:100%"
										type="primary"
										class="block"
										@click="getSms"
										:disabled="codeButtonStatus.status"
										>{{ codeButtonStatus.text }}</el-button
									>
								</el-col>
							</el-row>
						</el-form-item>
						<el-form-item prop="password" class="item-from">
							<label for="password">请设置密码</label>
							<el-input
								id="password"
								type="password"
								v-model="ruleForm.password"
								autocomplete="off"
								minlength="6"
								maxlength="20"
							></el-input>
						</el-form-item>
						<el-form-item>
							<el-button
								type="primary"
								class="submit"
								@click="submitForm('registerForm')"
								>注册</el-button
							>
						</el-form-item>
						<div class="clause">
							点击注册表示已阅读同意大语文学习平台的
							<router-link
								tag="a"
								target="_blank"
								:to="{ name: 'clause', query: { flag: 1 } }"
							>
								服务条款
							</router-link>
						</div>
					</el-form>
				</div>
			</div>
		</el-main>
	</el-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HeaderWarp from "@/components/login-header/header.vue";
import { checkTel, checkPasswordLength } from "@/utils/validata";
import { Form as ElForm, Input } from "element-ui";
import { userRegister, getSms } from "@/api/login/login";

@Component({
	name: "register",
	components: {
		HeaderWarp,
	},
})
export default class Register extends Vue {
	/**
	 * @data
	 * @return
	 */
	// 验证手机号
	private validateUsername = (
		rule: any,
		value: string,
		callback: Function
	): void => {
		if (value === "") {
			callback(new Error("请输入手机号"));
		} else if (checkTel(value)) {
			callback(new Error("手机号格式有误"));
		} else {
			callback(); //true
		}
	};
	// 验证密码
	private validatePassword = (
		rule: any,
		value: string,
		callback: Function
	): void => {
		if (value === "") {
			callback(new Error("请输入密码"));
		} else if (checkPasswordLength(value)) {
			callback(new Error("密码长度要大于6位,由数字和字母组成"));
		} else {
			callback();
		}
	};

	// 验证验证码
	private validateCode = (
		rule: any,
		value: string,
		callback: Function
	): void => {
		if (value === "") {
			return callback(new Error("请输入验证码"));
		} else {
			callback();
		}
	};

	private radio: number = 1;
	private timer: any = null;
	private codeButtonStatus: { [key: string]: boolean | string } = {
		status: false,
		text: "获取验证码",
	};
	private ruleForm: { [key: string]: string } = {
		username: "",
		password: "",
		code: "",
	};
	private rules: {
		[key: string]: Array<{ [key: string]: string | Function }>;
	} = {
		username: [{ validator: this.validateUsername, trigger: "blur" }],
		password: [{ validator: this.validatePassword, trigger: "blur" }],
		code: [{ validator: this.validateCode, trigger: "blur" }],
	};

	/**
	 * @methods
	 */

	//跳往登录页面
	private goLogin(): void {
		this.$router.push({
			name: "login",
		});
	}
	// 获取验证码
	private getSms(): any {
		if (this.ruleForm.username == "") {
			this.$message.error("手机号不能为空！！");
			return false;
		}
		if (checkTel(this.ruleForm.username)) {
			this.$message.error("手机号有误，请重新输入！！");
			return false;
		}

		// 定时器
		var s = 60;
		if (this.timer) {
			clearInterval(this.timer);
		}
		this.timer = setInterval((): void => {
			s--;
			if (s == 0) {
				clearInterval(this.timer);
				this.codeButtonStatus.status = false;
				this.codeButtonStatus.text = "再次获取";
			} else {
				this.codeButtonStatus.status = true;
				this.codeButtonStatus.text = `倒计时${s}秒`;
			}
		}, 1000);

		//调取接口
		this.getCode(this.ruleForm.username);
	}
	// 点击注册
	private submitForm(formName: string): void {
		(this.$refs[formName] as ElForm).validate((valid: boolean):
			| void
			| boolean => {
			if (valid) {
				this.user_register();
			} else {
				return false;
			}
		});
	}
	//拿验证码
	private getCode(tel: string): void {
		getSms({
			mobile: tel,
		});
	}
	//提交注册信息
	private user_register(): void {
		userRegister({
			mobile: this.ruleForm.username,
			code: this.ruleForm.code,
			password: this.ruleForm.password,
			role: this.radio,
		}).then((res: any): void => {
			if (res.data.data.status == 4) {
				this.$message({
					showClose: true,
					message: res.data.msg,
					type: "error",
				});
				this.ruleForm.code = "";
			} else if (res.data.data.status == 5) {
				this.$message({
					showClose: true,
					message: res.data.msg,
					type: "warning",
				});
				setTimeout((): void => {
					this.$router.push({
						name: "login",
					});
				}, 2000);
			} else if (res.data.data.status == 6) {
				this.$message({
					showClose: true,
					message: res.data.msg,
					type: "success",
				});
				setTimeout((): void => {
					this.$router.push({
						name: "login",
					});
				}, 2000);
			} else if (res.data.data.status == 9) {
				//注册失败
				this.$message({
					showClose: true,
					message: res.data.msg,
					type: "error",
				});
			}
		});
	}
}
</script>
<style lang="scss" scoped>
.register {
	width: 100%;
	min-width: 1200px;
	height: 100vh;
	.el-header {
		padding: 0;
		z-index: 2;
	}
	.el-main {
		background: #f4f4f4;
		padding-top: 120px;
		box-sizing: border-box;
		.register_form {
			width: 800px;
			height: 550px;
			background: #fff;
			box-shadow: 1px 1px 10px 0px rgba(54, 54, 54, 0.36);
			border-radius: 20px;
			margin: auto;
			display: flex;
			.left {
				width: 310px;
				height: 100%;
				background-image: url(~@/assets/images/zhuce-bg.png);
				background-size: 100% 100%;
				background-repeat: no-repeat;
			}
			.right {
				padding: 29px 40px;
				box-sizing: border-box;
				width: calc(100% - 310px);
				height: 10%;
				p {
					font-size: 30px;
					font-family: Source Han Sans CN;
					font-weight: 500;
					color: rgba(51, 51, 51, 1);
					text-align: center;
					margin-bottom: 29px;
				}
				.choose {
					width: 100%;
					.radio_lis {
						display: flex;
						justify-content: space-around;
						margin-bottom: 30px;
					}
				}
				.submit {
					width: 100%;
					margin-top: 10px;
				}
				.clause {
					font-size: 14px;
					text-align: center;
					color: #666666;
					a {
						text-decoration: none;
						color: #333;
						cursor: pointer;
						font-weight: bold;
					}
				}
			}
		}
	}
}
</style>
