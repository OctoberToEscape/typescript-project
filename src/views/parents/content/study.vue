<template>
	<el-container class="study-class">
		<el-header>
			<StudyNav
				@changeList="changeList"
				:list="list"
				@reset="onReset"
			></StudyNav>
		</el-header>
		<el-main ref="main" id="main">
			<div
				v-if="courseList.total_count !== 0"
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
						<CourseItem :inf="ele" @goWhere="goWhere"></CourseItem>
					</div>
				</div>
			</div>
			<!-- 无内容 -->
			<Empty
				text="内容生产中..."
				v-if="courseList.total_count == 0"
			></Empty>
		</el-main>
	</el-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import StudyNav from "@/components/study-nav/index.vue";
import CourseItem from "@/components/study-course/index.vue";
import Empty from "@/components/empty/index.vue";
import { getTabbars, getTabbarDetails } from "@/api/parents/study";
import { Dictionary } from "vue-router/types/router";
@Component({
	name: "study",
	components: {
		StudyNav,
		CourseItem,
		Empty,
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
	private courseList: { [key: string]: any } = {
		categories: [],
		total_count: 0,
	};

	created() {
		const idx: any = sessionStorage.getItem("tab_item")
			? sessionStorage.getItem("tab_item")
			: 0;

		//拿nav列表数据
		getTabbars().then((res: any): void => {
			this.list = res.data.data;
			this.id = res.data.data[idx].id;
			sessionStorage.setItem("back-title", res.data.data[idx].title);
			//拿列表数据
			this.getCourseList(this.id, this.page);
		});
	}
	mounted() {
		/**
		 * @event 触发的事件名
		 * @function 触发事件方法
		 * @boolean 重点！！！ 想要监听子组件的事件，需要设置为true,因为滚动事件只能在父组件触发
		 */
		window.addEventListener("scroll", this.onScroll, true);
	}
	/**
	 * @methods
	 */
	private onScroll(event: any): void {
		/**
		 * @event
		 * event.bubbles 子组件滚动是捕获事件为false，父组件滚动是冒泡事件为true
		 * event.target  事件的目标节点
		 */

		//子组件滚动
		if (!event.bubbles) {
			// 变量scrollTop是滚动条滚动时，距离顶部的距离
			var scrollTop: number = event.target.scrollTop;
			// 变量windowHeight是可视区的高度
			var windowHeight: number = event.target.clientHeight;
			// 变量scrollHeight是滚动条的总高度
			var scrollHeight: number = event.target.scrollHeight;
			// 滚动条到底部的条件
			if (scrollTop + windowHeight >= scrollHeight) {
				// 写后台加载数据的函数;
				if (this.page < this.courseList.total_count / 13) {
					this.page++;
					// 调用请求函数
					getTabbarDetails(this.id, this.page).then((res: any) => {
						this.courseList.total_count = res.data.data.total_count;
						this.courseList.categories = [
							...this.courseList.categories,
							...res.data.data.categories,
						];
					});
				}
			}
		}
	}

	//watchtab变化重置page
	private onReset(): void {
		this.page = 1;
		this.getCourseList(this.id, this.page);
	}

	//赋值
	private changeList(id: string, index: number): void {
		sessionStorage.setItem("back-title", String(this.list[index].title));
		this.id = id;
	}

	//拿列表数据
	private getCourseList(id: string, page: number): void {
		getTabbarDetails(id, page).then((res: any): void => {
			this.courseList = res.data.data;
			var main: any = document.querySelector("#main");
			main.scrollTop = 0;
		});
	}

	//跳往哪个页面
	private goWhere(val: { [key: string]: number | string }): void {
		if (val.type == "test-listen" || (val.type == "listen" && val.buy)) {
			var data: Dictionary<any> = {
				title: val.title,
				id: val.id,
				type: val.type,
			};
			this.$router.push({
				name: "listen",
				query: data,
			});
		}
	}

	//销毁监听
	destroyted() {
		window.removeEventListener("scroll", this.onScroll);
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
	}
	.el-main {
		width: 100%;
		padding: 13px 120px 0 130px;
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
