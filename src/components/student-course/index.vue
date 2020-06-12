<template>
	<div class="course-item" :inf="inf">
		<div class="item-bg">
			<img :src="inf.cover_img" />
		</div>
		<div class="item-info">
			<dl>
				<el-tooltip
					class="item"
					effect="dark"
					:content="inf.title"
					placement="top"
				>
					<dt>{{ inf.title }}</dt>
				</el-tooltip>
				<dd>{{ inf.author }}</dd>
			</dl>
			<studentCourseStatus
				:inf="inf"
				@goStudy="goStudy"
			></studentCourseStatus>
		</div>
	</div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import studentCourseStatus from "@/components/student-course-btn/index.vue";
@Component({
	name: "course-item",
	components: {
		studentCourseStatus,
	},
})
export default class courseItem extends Vue {
	@Prop({ default: {} }) private inf!: { [key: string]: string | number };

	private goStudy(val: {}): void {
		this.$emit("goStudy", val);
	}
}
</script>
<style lang="scss" scoped>
.course-item {
	background: rgba(255, 255, 255, 1);
	border-radius: 5px;
	.item-bg {
		width: 100%;
		img {
			width: 100%;
			height: 150px;
			display: block;
			border-radius: 5px;
		}
	}
	.item-info {
		width: 100%;
		padding: 17px 0;
		box-sizing: border-box;
		dl {
			width: 100%;
			dt {
				font-size: 16px;
				font-weight: bold;
				text-align: center;
				line-height: 16px;
				color: #333;
				margin-bottom: 9px;
				height: 16px;
			}
			dd {
				font-size: 14px;
				text-align: center;
				color: #666;
				line-height: 14px;
				margin-bottom: 17px;
				height: 14px;
			}
		}
	}
}
</style>
