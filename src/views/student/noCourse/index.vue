<template>
	<div class="noCourse">
		<Empty text="内容生产中..." padding="120" />
	</div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Empty from "@/components/empty/index.vue";
@Component({
	name: "noCourse",
	components: {
		Empty,
	},
})
export default class noCrouse extends Vue {}
</script>
<style lang="scss" scoped>
.noCourse {
	width: 85%;
	margin: auto;
	height: 600px;
	border: 22px solid #fff;
	border-radius: 20px;
	background: #bbddf9;
	padding: 27px;
	box-sizing: border-box;
}
</style>
