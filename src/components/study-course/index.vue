<template>
	<div class="intro-item">
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
		</div>
		<!-- 按钮 -->
		<CourseBtn :inf="inf" @goWhere="goWhere"></CourseBtn>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import CourseBtn from "@/components/study-course-btn/index.vue";
@Component({
	name: "course-intro",
	components: {
		CourseBtn,
	},
})
export default class extends Vue {
	@Prop({ default: [] }) private inf!: Array<any>;
	/**
	 * @methods
	 */
	private goWhere(val: { [key: string]: string | number }): void {
		this.$emit("goWhere", val);
	}
}
</script>
<style lang="scss" scoped>
.intro-item {
	flex-shrink: 0;
	border-radius: 5px;
	width: 100%;
	height: 100%;
	background: #ffffff;
	.item-bg {
		width: 100%;
		height: 176px;
		img {
			width: 100%;
			height: 100%;
			display: block;
			border-radius: 5px;
		}
	}
	.item-info {
		width: 100%;
		padding: 17px 24px 0 24px;
		box-sizing: border-box;
		dl {
			width: 100%;
			dt {
				font-size: 16px;
				font-family: Source Han Sans CN;
				font-weight: bold;
				color: rgba(51, 51, 51, 1);
				line-height: 16px;
				margin-bottom: 9px;
				text-align: center;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
				height: 16px;
			}
			dd {
				font-size: 14px;
				font-family: Source Han Sans CN;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
				line-height: 14px;
				margin-bottom: 17px;
				text-align: center;
				height: 14px;
			}
		}
	}
}
</style>
