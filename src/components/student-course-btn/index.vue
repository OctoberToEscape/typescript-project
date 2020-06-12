<template>
	<div class="student-course-status status-list">
		<div
			class="status-item listen"
			@click="goEmit('listen_child', stateInfo.id, stateInfo.title)"
		>
			<img src="@/assets/images/status/listen.png" />
			<div
				class="status yes-end"
				v-if="
					stateInfo.is_listen_complete == 2 ||
						stateInfo.is_listen_once == 2
				"
			>
				<img src="@/assets/images/status/yes_end.png" />
			</div>
			<div class="status no-end" v-if="stateInfo.is_listen_complete == 1">
				<img src="@/assets/images/status/no_end.png" />
			</div>
		</div>
		<div
			class="status-item write"
			@click="goEmit('write', stateInfo.id, stateInfo.title)"
		>
			<img src="@/assets/images/status/read.png" />
			<div
				class="status yes-end"
				v-if="
					stateInfo.is_writing_complete == 2 ||
						stateInfo.is_writing_once == 2
				"
			>
				<img src="@/assets/images/status/yes_end.png" />
			</div>
			<div
				class="status no-end"
				v-if="stateInfo.is_writing_complete == 1"
			>
				<img src="@/assets/images/status/no_end.png" />
			</div>
		</div>
		<div
			class="status-item exam"
			v-if="stateInfo.show_test_button == 1"
			:class="{ disabled: stateInfo.is_can_test == 0 }"
		>
			<img
				v-if="stateInfo.is_can_test == 1"
				@click="goEmit('exam', stateInfo.id, stateInfo.title)"
				src="@/assets/images/status/exam_sel.png"
			/><img v-else="v-else" src="@/assets/images/status/exam_no.png" />
			<div
				class="status yes-end"
				v-if="
					stateInfo.is_can_test == 1 &&
						(stateInfo.is_test_complete == 2 ||
							stateInfo.is_test_once == 2)
				"
			>
				<img src="@/assets/images/status/yes_end.png" />
			</div>
			<div
				class="status no-end"
				v-if="
					stateInfo.is_can_test == 1 &&
						stateInfo.is_test_complete == 1
				"
			>
				<img src="@/assets/images/status/no_end.png" />
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: "studentCourseStatus",
	props: ["inf"],
	data() {
		return {
			stateInfo: {},
		};
	},
	methods: {
		goEmit(type, id, title) {
			let emitObj = {
				type,
				id,
				title,
			};
			this.$emit("goStudy", emitObj);
		},
	},
	watch: {
		inf: {
			handler: function(val) {
				this.stateInfo = Object.assign({}, this.inf);
			},
			deep: true,
		},
	},
	created() {
		this.stateInfo = Object.assign({}, this.inf);
	},
};
</script>
<style lang="scss">
.student-course-status.status-list {
	display: flex;
	justify-content: center;
}
.status-item {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	box-sizing: border-box;
	width: 45px;
	height: 45px;
	border: 1px solid #63a7f8;
	border-radius: 2px;
	margin: 0 10px;
	cursor: pointer;
	.status {
		position: absolute;
		width: 16px;
		height: 16px;
		background: #63a7f8;
		img {
			float: right;
			width: 9px;
		}
	}
	.status.yes-end {
		top: 0;
		right: 0;
		border-radius: 0 0 0 16px;
		img {
			height: 6px;
			margin: 4px 1px 0 0;
		}
	}
	.status.no-end {
		left: 0;
		bottom: 0;
		border-radius: 0 16px 0 0;
		img {
			height: 9px;
			margin: 6px 6px 0 0;
		}
	}
}
.exam.disabled {
	border-color: #dbdbdb;
}
</style>
