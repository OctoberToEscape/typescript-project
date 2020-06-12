<template>
	<div class="student-nav-list">
		<div class="nav-name">{{ navName }}</div>
		<el-menu
			class="nav-list"
			:default-active="active"
			active-text-color="#63A7F8"
		>
			<el-menu-item
				class="nav-item"
				v-for="(link, index) in lists"
				:key="link.url"
				:index="link.url"
			>
				<router-link class="nav-item-link" tag="div" :to="link.url"
					><img class="img" :src="link.img" />
					<div class="text" :class="{ spacing: link.isLetter }">
						{{ link.text }}
					</div>
				</router-link>
			</el-menu-item>
		</el-menu>
	</div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({
	name: "student-nav",
})
export default class StudentNav extends Vue {
	@Prop() private lists!: Array<any>;
	@Prop({ default: "" }) private navName!: string;
	@Prop() private active!: string;

	private isLetter: boolean = false;
}
</script>
<style lang="scss" scoped>
.student-nav-list {
	overflow: hidden;
	.nav-name {
		float: left;
		width: 155px;
		text-align: center;
		line-height: 150px;
		font-size: 22px;
		color: #63a7f8;
		margin-right: 85px;
	}
	.nav-list {
		display: flex;
		justify-content: space-between;
		align-items: center;
		.nav-item {
			box-sizing: border-box;
			width: 115px;
			height: 115px;
			background: #fff;
			border-radius: 10px;
			font-size: 18px;
			text-align: center;
			line-height: 30px;
			.img {
				width: 80px;
				height: 80px;
				margin-top: 5px;
			}
			.spacing {
				letter-spacing: -3px;
			}
		}
		.nav-item.is-active {
			position: relative;
			width: 153px;
			height: 153px;
			font-size: 20px;
			line-height: 34px;
			border: 1px solid #fff;
			background: #9dcdf9;
			padding: 9px !important;
			.img {
				width: 93px;
				height: 93px;
			}
		}
		.nav-item.is-active .nav-item-link {
			background: #fff;
			border-radius: 10px;
			width: 133px;
			height: 133px;
		}
	}
}
</style>
