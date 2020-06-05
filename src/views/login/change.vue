<template>
	<el-container class="change">
		<!-- 头部 -->
		<el-header>
			<HeaderWarp name="大语文学习平台" :show="false"></HeaderWarp>
		</el-header>
		<!-- 内容 -->
		<el-main>
			<div class="form">
				<p>重置密码</p>
				<!-- form表单 -->
				<el-form
					:model="ruleForm"
					status-icon
					:rules="rules"
					ref="resetForm"
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
						<label for="password">设置新密码</label>
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
							@click="submitForm('resetForm')"
							>提交</el-button
						>
					</el-form-item>
				</el-form>
			</div>
		</el-main>
	</el-container>
</template>
<script lang="ts">
import { Form as ElForm, Input } from "element-ui";
import { Component, Vue } from "vue-property-decorator";
import HeaderWarp from "@/components/login-header/header.vue";
import { checkTel, checkPasswordLength } from "@/utils/validata";
import { resetPassword, getSms } from "@/api/login/login";
@Component({
	name: "change",
	components: {
		HeaderWarp,
	},
})
export default class Change extends Vue {
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
		this.timer = setInterval(() => {
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
	// 点击注重置
	private submitForm(formName: string): void {
		(this.$refs[formName] as ElForm).validate((valid: boolean):
			| void
			| boolean => {
			if (valid) {
				this.userReset();
			} else {
				return false;
			}
		});
	}
	//获取验证码
	private getCode(tel: string): void {
		getSms({
			mobile: tel,
		});
	}
	//重置提交接口
	private userReset(): void {
		resetPassword({
			mobile: this.ruleForm.username,
			role: 1,
			code: this.ruleForm.code,
			password: this.ruleForm.password,
		}).then((res: any) => {
			if (res.data.data.status == 4) {
				this.$message({
					showClose: true,
					message: res.data.msg,
					type: "error",
				});
			} else if (res.data.data.status == 7) {
				this.$message({
					showClose: true,
					message: res.data.msg,
					type: "success",
				});
				setTimeout(() => {
					this.$router.push({
						name: "login",
					});
				}, 2000);
			} else if (res.data.data.status == 2) {
				this.$message({
					showClose: true,
					message: res.data.msg,
					type: "error",
				});
				setTimeout(() => {
					this.$router.push({
						name: "register",
					});
				}, 2000);
			} else if (res.data.data.status == 8) {
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
.change {
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
		.form {
			padding: 29px 50px;
			box-sizing: border-box;
			margin: auto;
			width: 504px;
			height: 520px;
			box-shadow: 1px 1px 10px 0px rgba(54, 54, 54, 0.36);
			border-radius: 20px;
			background: #fff;
			margin: auto;
			p {
				text-align: center;
				font-size: 30px;
				font-family: Source Han Sans CN;
				font-weight: 500;
				color: #333333;
				margin-bottom: 50px;
			}
			.submit {
				margin-top: 20px;
				width: 100%;
			}
		}
	}
}
</style>
