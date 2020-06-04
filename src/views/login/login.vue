<template>
	<div class="login">
		<el-button type="primary" @click="onLogin">登录</el-button>
		<el-button type="success" @click="onRegister">注册</el-button>
		<el-button type="warning" @click="onChangePassword">修改密码</el-button>
	</div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
@Component({
	name: "login",
})
export default class login extends Vue {
	/**
	 * vue2.6 javascript 写法
	 * @methods 生命周期
	 */
	private onLogin() {
		//登录成功去主页
		this.$router.push({
			name: "index",
		});
	}
	private onRegister() {
		//去注册账号
		this.$router.push({
			name: "register",
		});
	}
	private onChangePassword() {
		//去修改密码
		this.$router.push({
			name: "changePassword",
		});
	}
}
</script>
<style lang="scss" scoped>
.login {
	width: 500px;
	height: 500px;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	justify-content: space-between;
	.el-button {
		height: 40px;
	}
}
</style>
