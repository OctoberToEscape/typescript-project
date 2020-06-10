<template>
	<svg :class="svgClass" aria-hidden="true">
		<use :xlink:href="iconName" />
	</svg>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({
	name: "svg-icon",
})
export default class SvgIcon extends Vue {
	@Prop({ required: true }) private iconClass!: string;
	@Prop({ default: "" }) private className!: string;
	/**
	 * @computed
	 */
	private get iconName(): string {
		return `#icon-${this.iconClass}`;
	}

	private get svgClass(): string {
		if (this.className) {
			return "svg-icon " + this.className;
		} else {
			return "svg-icon";
		}
	}
}
</script>

<style scoped>
.svg-icon {
	width: 1em;
	height: 1em;
	vertical-align: -0.15em;
	fill: currentColor;
	overflow: hidden;
}
</style>
