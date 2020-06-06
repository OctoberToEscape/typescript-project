<template>
	<div class="student-class">
		课程
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
@Component({
	name: "study",
})
export default class indent extends Vue {}
</script>
<style lang="scss" scoped>
.student-class {
	width: 100%;
	height: 100%;
	background: #ffffff;
	border-radius: 6px;
}
</style>
