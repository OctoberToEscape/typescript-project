<template>
	<div class="study-nav">
		<ul>
			<li
				v-for="(item, index) in list"
				:key="index.id"
				@click="handleClick(index, item.id)"
				:class="{ active: index == num }"
			>
				{{ item.title }}
			</li>
		</ul>
	</div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";

@Component({
	name: "StudyNav",
})
export default class StudyNav extends Vue {
	@Prop({ default: [] }) private list!: Array<{
		[key: string]: string | number;
	}>;

	private lists: Array<{
		[key: string]: string | number;
	}> = [];

	private num: any = 0;
	private id: string = "";

	created() {
		this.lists = Object.assign({}, this.list);
		this.num = sessionStorage.getItem("tab_item")
			? sessionStorage.getItem("tab_item")
			: 0;
	}

	/**
	 * @methods
	 */
	private handleClick(index: number, id: string): void {
		this.num = index;
		this.id = id;
		this.$emit("changeList", this.id);

		sessionStorage.setItem("tab_item", String(index));
	}

	@Watch("num")
	private changeNUM(ov: number, nv: number): void {
		if (Number(ov) !== Number(nv)) {
			this.$emit("reset");
		}
	}
}
</script>

<style lang="scss" scoped>
.study-nav {
	width: 100%;
	height: 51px;
	background: #63a7f8;
	min-width: 1200px;
	ul {
		width: 42.5%;
		margin: auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		li {
			color: #e8f2fe;
			height: 49px;
			font-size: 16px;
			line-height: 51px;
			cursor: pointer;
		}
		.active {
			color: #fff;
			font-weight: bold;
			border-bottom: 2px solid #fff;
		}
	}
}
</style>
