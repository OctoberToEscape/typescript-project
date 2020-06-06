<template>
	<el-container>
		<el-header>
			<div></div>
			<el-button type="primary" @click="onLogout">退出</el-button>
		</el-header>
		<el-container>
			<el-aside :width="leftWidth">
				<el-menu
					:default-active="activerouter"
					class="el-menu-vertical-demo"
					@select="handleRouter"
				>
					<el-menu-item index="1">
						<i class="el-icon-menu"></i>
						<span slot="title">表格一</span>
					</el-menu-item>
					<el-menu-item index="2" disabled>
						<i class="el-icon-document"></i>
						<span slot="title">导航二</span>
					</el-menu-item>
					<el-menu-item index="3">
						<i class="el-icon-setting"></i>
						<span slot="title">测试三</span>
					</el-menu-item>
				</el-menu>
			</el-aside>
			<el-main>
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
@Component({
	name: "layout",
})
export default class layout extends Vue {
	/**
	 * vue2.6 javascript
	 * @data
	 * @return
	 */

	private leftWidth: string = "200px";
	private activerouter: string = "1";

	created() {
		let pathName: string = window.location.pathname;
		if (pathName == "/table") this.activerouter = "1";
		else this.activerouter = "3";
	}

	/**
	 * vue2.6 javascript 写法
	 * @methods
	 */
	private handleRouter(key: string): void {
		if (key == "1") this.$router.push({ name: "table" });
		else this.$router.push({ name: "test" });
	}
	private onLogout(): void {
		this.$router.push({
			name: "login",
		});
	}
}
</script>
<style lang="scss" scoped>
.el-container {
	width: 100%;
	height: 100vh;
}
.el-header {
	background-color: #b3c0d1;
	color: #333;
	text-align: center;
	line-height: 60px;
	display: flex;
	justify-content: space-between;
	div {
		width: 70px;
		height: 100%;
		background-image: url(~@/assets/logo.png);
		background-size: 100% 100%;
	}
}
.el-aside {
	background-color: #d3dce6;
	color: #333;
	text-align: center;
	line-height: 200px;
}

.el-main {
	background-color: #e9eef3;
	color: #333;
	text-align: center;
	line-height: 160px;
}

body > .el-container {
	margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
	line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
	line-height: 320px;
}
</style>
