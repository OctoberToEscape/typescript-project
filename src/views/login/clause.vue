<template>
	<el-container class="clause">
		<!-- 头部 -->
		<el-header>
			<HeaderWarp name="大语文学习平台"></HeaderWarp>
		</el-header>
		<!-- 内容 -->
		<el-main>
			<div class="rich">
				<h3>{{ rich.title }}</h3>
				<div class="content" v-html="rich.content"></div>
			</div>
		</el-main>
	</el-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HeaderWarp from "@/components/login-header/header.vue";
import { getClause } from "@/api/login/login";
@Component({
	name: "clause",
	components: {
		HeaderWarp,
	},
})
export default class Clause extends Vue {
	/**
	 * @data
	 * @return
	 */
	//富文本
	private rich: { [key: string]: string | null } = {
		title: "",
		content: null,
	};

	created() {
		var flag: string | (string | null)[] = this.$route.query.flag;
		getClause(flag).then((res: any) => {
			const regex: any = new RegExp("<img", "gi");
			res.data.data.content = res.data.data.content.replace(
				regex,
				`<img style="width: 100%; height: auto"`
			);
			this.rich.title = res.data.data.title;
			this.rich.content = res.data.data.content;
		});
	}
}
</script>
<style lang="scss" scoped>
.clause {
	width: 100%;
	height: 100vh;
	min-width: 1200px;
	.el-header {
		padding: 0;
		z-index: 2;
	}
	.el-main {
		background: #f4f4f4;
		padding: 40px 120px;
		box-sizing: border-box;
		.rich {
			width: 100%;
			h3 {
				text-align: center;
				font-size: 26px;
				font-family: Source Han Sans CN;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
				margin-bottom: 20px;
			}
			.content {
				color: #333333;
				font-size: 16px;
			}
		}
	}
}
</style>
