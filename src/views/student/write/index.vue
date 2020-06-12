<template>
	<el-container class="student-write">
		<el-header>
			<Tag :backName="sc" :title="title" @_onBack="handleBack"></Tag>
		</el-header>
		<el-main> </el-main>
	</el-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Tag from "@/components/listen-pageback/index.vue";
import Empty from "@/components/empty/index.vue";
@Component({
	name: "student-write",
	components: { Tag, Empty },
})
export default class StudentWrite extends Vue {
	private sc: string = "";
	private sct: { [key: string]: string } = {};
	private title: string | (string | null)[] = "";
	private course_id: string | (string | null)[] = "";
	private isTest: string | (string | null)[] = "";

	created() {
		this.isTest = this.$route.query.isTest;
		this.sc = this.isTest ? "测试" : sessionStorage.sc;
		this.sct = JSON.parse(sessionStorage.sct);
		this.title = this.$route.query.title;
		this.course_id = this.$route.query.id;
	}

	//返回
	private handleBack(): void {
		let url = this.isTest
			? "/student/exam?id=" + this.course_id + "&title=" + this.title
			: "/student/" + this.sct.topName + "/" + this.sct.secondName;

		this.$router.replace({ path: url });
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
}
</style>
