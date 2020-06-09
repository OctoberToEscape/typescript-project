<template>
	<div class="empty">
		<img :src="url" />
		<p>{{ text }}</p>
	</div>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
@Component({
	name: "empty",
})
export default class extends Vue {
	@Prop({ default: require("@/assets/images/student_empty.png") })
	private url!: string;
	@Prop({ default: "" }) private text!: string;
}
</script>
<style lang="scss" scoped>
.empty {
	font-size: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 285px 0 110px;
	img {
		width: 347px;
		height: 212px;
		display: block;
		margin-bottom: 24px !important;
		margin: auto;
	}
	p {
		color: #63a7f8;
		text-align: center;
	}
}
</style>
