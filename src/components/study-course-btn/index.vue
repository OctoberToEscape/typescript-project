<template>
	<div class="course-btns">
		<div
			class="test-listen"
			@click="goWhere(inf.id, inf.is_buy, inf.title, 'test-listen')"
		>
			<img class="icon" src="@/assets/images/listen_1.png" />
			<div class="top-right" v-if="inf.is_test_listen_once">
				<img src="@/assets/images/touch_icon.png" />
			</div>
			<div class="bottom-left" v-if="inf.is_test_listen_complete == 1">
				<img src="@/assets/images/time.png" />
			</div>
		</div>
		<div
			:class="inf.is_buy ? 'official-listen-buy' : 'official-listen-not'"
			@click="goWhere(inf.id, inf.is_buy, inf.title, 'listen')"
		>
			<img
				class="icon"
				:src="
					inf.is_buy
						? require('@/assets/images/listen_2.png')
						: require('@/assets/images/listen_2_not.png')
				"
			/>
			<div class="top-right" v-if="inf.is_listen_once">
				<img src="@/assets/images/touch_icon.png" />
			</div>
			<div class="bottom-left" v-if="inf.is_listen_complete == 1">
				<img src="@/assets/images/time.png" />
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({
	name: "course-btn",
})
export default class extends Vue {
	@Prop({ default: [] }) private inf!: Array<any>;

	created() {
		// console.log(this.inf);
	}
	/**
	 * @methods
	 */
	private goWhere(
		id: string,
		buy: number,
		title: string,
		type: string
	): void {
		let data: { [key: string]: string | number } = { id, buy, title, type };
		this.$emit("goWhere", data);
	}
}
</script>
<style lang="scss" scoped>
.course-btns {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-around;
	padding: 0px 20px;
	box-sizing: border-box;
	div {
		width: 49px;
		height: 49px;
		background: rgba(255, 255, 255, 1);
		border-radius: 2px;
		cursor: pointer;
	}
	.test-listen,
	.official-listen-buy,
	.official-listen-not {
		border: 1px solid #63a7f8;
		position: relative;
		overflow: hidden;
		.icon {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
		.top-right {
			width: 34px;
			height: 34px;
			background: #63a7f8;
			position: absolute;
			top: -35%;
			right: -35%;
			border-radius: 50%;
			img {
				position: absolute;
				bottom: 17%;
				left: 17%;
			}
		}
		.bottom-left {
			width: 34px;
			height: 34px;
			background: #63a7f8;
			position: absolute;
			bottom: -35%;
			left: -35%;
			border-radius: 50%;
			img {
				position: absolute;
				top: 17%;
				right: 17%;
			}
		}
	}
	.official-listen-not {
		border: 1px solid #dbdbdb;
		cursor: default;
	}
}
</style>
