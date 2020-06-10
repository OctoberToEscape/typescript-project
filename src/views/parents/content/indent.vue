<template>
	<div class="indent">
		<!-- 用户类型 -->
		<div class="user_attribute">
			<div class="order_type">
				<span>账户类型：</span>
				<span>{{ user_order_type.type }}</span>
			</div>
			<div class="order_deadline">
				<span>到期时间：</span>
				<span>{{ user_order_type.end_time }}</span>
				<el-button type="primary" size="mini" @click="user_buy"
					>购买续费</el-button
				>
			</div>
		</div>
		<!-- 下方表格 -->
		<el-table :data="tableData" border style="margin-bottom:26px" stripe>
			<el-table-column
				v-for="(item, index) in table"
				:key="index.id"
				:prop="item.prop"
				:label="item.label"
				:width="item.width"
				:resizable="false"
			>
			</el-table-column>
			<div id="empty" slot="empty">
				<img src="@/assets/images/order_null.png" />
				<span>暂无订单数据</span>
			</div>
		</el-table>
		<!-- 分页 -->
		<el-pagination
			v-if="pagination.total"
			@current-change="handleCurrentChange"
			:current-page="pagination.currentPage"
			:page-size="15"
			layout="total, prev, pager, next, jumper"
			:total="pagination.total"
		>
		</el-pagination>

		<!-- 支付弹窗 -->
		<el-dialog
			:visible.sync="dialogVisible"
			:before-close="handleClose"
			:close-on-click-modal="false"
			width="680px"
			id="indent-dialog"
		>
			<IndentPayDialog
				v-if="dialogVisible"
				:show="show"
				:active="active"
				@changeVal="changeVal"
				@closeDailog="handleClose"
				@refresh="refresh"
			></IndentPayDialog>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Dictionary } from "vue-router/types/router";
import { getOrderLis, userStatus } from "@/api/parents/indent";
import IndentPayDialog from "@/components/pay-dialog/index.vue";
@Component({
	name: "indent",
	components: {
		IndentPayDialog,
	},
})
export default class indent extends Vue {
	/**
	 * @data
	 * @return
	 */

	//用户订单属性
	private user_order_type: Dictionary<
		string | (string | null)[] | null | undefined
	> = {
		type: "",
		end_time: "",
		is_buy: "",
	};

	// 表头数组
	private table: Array<{ [key: string]: string }> = [
		{
			label: "订单号",
			width: "",
			prop: "order_sn",
		},
		{
			label: "订单内容",
			width: "",
			prop: "order_content",
		},
		{
			label: "订单金额",
			width: "",
			prop: "order_price",
		},
		{
			label: "订单时间",
			width: "300",
			prop: "create_time",
		},
	];
	// 订单信息
	private tableData: Array<{ [key: string]: string }> = [];

	//分页器属性
	private pagination: { [key: string]: string | number | null } = {
		currentPage: 1,
		total: 0,
	};

	//弹框
	private dialogVisible: boolean = false;

	private show: boolean = true;
	private active: number = 0;

	created() {
		// 用户当前属性
		this._user_buy_type();

		// 拿数据列表
		this._getOrderLis();

		//解决刷新问题
		this.pagination.currentPage = sessionStorage.getItem("pagination")
			? Number(sessionStorage.getItem("pagination"))
			: 1;
	}

	/**
	 * @method
	 */

	//拿表格数据
	private _getOrderLis(): void {
		getOrderLis(this.pagination.currentPage).then((res: any): void => {
			this.tableData = res.data.data.orders;
			this.pagination.total = res.data.data.total_count;
		});
	}

	//用户购买信息
	private _user_buy_type(): void {
		userStatus().then((res: any): void => {
			this.user_order_type.type = res.data.data.account_type;
			this.user_order_type.end_time = res.data.data.end_time;
			this.user_order_type.is_buy = res.data.data.is_buy;
		});
	}

	//切换页数展示不同内容
	private handleCurrentChange(val: string): void {
		this.pagination.currentPage = Number(val);
		sessionStorage.setItem("pagination", val);
		getOrderLis(val).then((res: any): void => {
			this.tableData = res.data.data.orders;
			this.pagination.total = res.data.data.total_count;
		});
	}
	//用户购买按钮
	private user_buy(): void {
		this.dialogVisible = true;
	}

	//关闭弹窗
	private handleClose(): void {
		this.dialogVisible = false;
		setTimeout(() => {
			this.show = true;
			this.active = 0;
		}, 300);
	}

	//帮助子组件改变数值
	private changeVal(val: boolean): void {
		if (!val) {
			this.active = 1;
			this.show = false;
		}
	}

	//支付成功后刷新接口
	private refresh(): void {
		//刷新表格订单信息
		this._getOrderLis();
		//刷新用户信息
		this._user_buy_type();
		this.dialogVisible = false;
		this.show = true;
	}
}
</script>

<style lang="scss" scoped>
.indent {
	margin-top: 10px !important;
	width: calc(100% - 100px);
	margin: auto;
	height: calc(100% - 30px) !important;
	border-radius: 6px;
	padding: 20px 70px;
	box-sizing: border-box;
	background: #ffffff;
	.user_attribute {
		width: 100%;
		.order_type {
			width: 100%;
			span {
				font-size: 14px;
				line-height: 14px;

				&:first-child {
					color: #666;
					margin-right: 5px;
				}
				&:last-child {
					color: #333;
					font-weight: bold;
				}
			}
		}
		.order_deadline {
			width: 100%;
			display: flex;
			align-items: flex-end;
			margin-bottom: 16px;
			span {
				font-size: 14px;
				line-height: 14px;
				&:first-child {
					color: #666;
					margin-right: 5px;
				}
				&:nth-child(2) {
					color: #333;
					font-weight: bold;
					margin-right: 31px;
				}
			}
		}
	}
	#empty {
		display: flex;
		align-items: center;
		justify-content: center;
		span {
			margin-left: 5px;
		}
	}
	// 支付弹窗
	.el-dialog__wrapper {
		min-width: 1200px;
	}
}
</style>
