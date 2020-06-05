<template>
	<el-container class="login">
		<HeaderWarp
			name="大语文学习平台"
			text="没有账号，请"
			maybe="注册"
			route="register"
		/>
	</el-container>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import HeaderWarp from "@/components/login-header/header.vue";

@Component({
	name: "login",
	components: {
		HeaderWarp,
	},
})
export default class login extends Vue {
	/**
	 * vue2.6 javascript 写法
	 * @methods 生命周期
	 */
}
</script>
<style lang="scss" scoped></style>
