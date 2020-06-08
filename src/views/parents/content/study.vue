<template>
	<el-container class="study-class">
		<el-header>
			<StudyNav @changeList="changeList" :list="list"></StudyNav>
		</el-header>
		<el-main>
			<div
				class="course-content"
				v-for="(item, index) in courseList.categories"
				:key="index.id"
			>
				<h3>{{ item.category_name }}</h3>
				<div class="course-box">
					<div
						class="course-list"
						v-for="(ele, index) in item.courses"
						:key="index.id"
					>
						<CourseItem :inf="ele"></CourseItem>
					</div>
				</div>
			</div>
		</el-main>
	</el-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import StudyNav from "@/components/study-nav/index.vue";
import CourseItem from "@/components/study-course/index.vue";
import { getTabbars, getTabbarDetails } from "@/api/parents/study";
@Component({
	name: "study",
	components: {
		StudyNav,
		CourseItem,
	},
})
export default class indent extends Vue {
	/**
	 * @data
	 * @rturn
	 */
	private list: Array<{
		[key: string]: string | number;
	}> = [];
	private id: string = "";
	private page: number = 1;
	private courseList: Array<{ [key: string]: any }> = [];

	created() {
		const idx: any = sessionStorage.getItem("tab_item")
			? sessionStorage.getItem("tab_item")
			: 0;

		//拿nav列表数据
		getTabbars().then((res: any): void => {
			this.list = res.data.data;
			this.id = res.data.data[idx].id;
			//拿列表数据
			this.getCourseList(this.id, this.page);
		});
	}
	/**
	 * @methods
	 */

	private changeList(id: string): void {
		this.id = id;
		this.getCourseList(id, this.page);
	}

	//拿列表数据
	private getCourseList(id: string, page: number): void {
		getTabbarDetails(id, page).then((res: any): void => {
			this.courseList = res.data.data;
		});
	}
}
</script>
<style lang="scss" scoped>
.study-class {
	width: 100%;
	height: 100% !important;
	background: #f4f4f4;
	border-radius: 6px;
	min-width: 1200px;
	.el-header {
		padding: 0;
		height: 51px !important;
		margin-bottom: 13px;
	}
	.el-main {
		width: 100%;
		padding: 0px 120px;
		box-sizing: border-box;
		.course-content {
			width: 100%;
			h3 {
				font-family: PingFang SC;
				font-weight: 400;
				color: #333;
				font-size: 16px;
				line-height: 16px;
				margin-bottom: 12px;
			}
			.course-box {
				display: flex;
				flex-wrap: wrap;
				margin-bottom: 21px;
			}
			.course-list {
				flex-shrink: 0;
				display: flex;
				flex-direction: column;
				align-items: center;
				box-sizing: border-box;
				width: 224px;
				height: 314px;
				margin-right: 20px;
				margin-bottom: 20px;
				border-radius: 5px;
			}
		}
	}
}
</style>
