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
			title="提示"
			:visible.sync="dialogVisible"
			width="30%"
			:before-close="handleClose"
		>
			<span>这是一段信息</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="dialogVisible = false"
					>确 定</el-button
				>
			</span>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Dictionary } from "vue-router/types/router";
import { getOrderLis } from "@/api/parents/indent";
@Component({
	name: "indent",
})
export default class indent extends Vue {
	/**
	 * @data
	 * @return
	 */

	//用户订单属性
	private user_order_type: Dictionary<
		string | (string | null)[] | null | undefined
	> = {};

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

	created() {
		// 用户当前属性
		this.user_order_type.type = this.$route.query.type;
		this.user_order_type.end_time = this.$route.query.end_time;
		this.user_order_type.is_buy = this.$route.query.is_buy;

		//解决刷新问题
		this.pagination.currentPage = localStorage.getItem("pagination")
			? Number(localStorage.getItem("pagination"))
			: 1;

		// 拿数据列表
		getOrderLis(this.pagination.currentPage).then((res: any): void => {
			this.tableData = res.data.data.orders;
			this.pagination.total = res.data.data.total_count;
		});
	}

	/**
	 * @method
	 */
	//切换页数展示不同内容
	private handleCurrentChange(val: string) {
		this.pagination.currentPage = Number(val);
		localStorage.setItem("pagination", val);
		getOrderLis(val).then((res: any): void => {
			this.tableData = res.data.data.orders;
			this.pagination.total = res.data.data.total_count;
		});
	}
	//用户购买按钮
	private user_buy() {
		this.dialogVisible = true;
	}

	//关闭弹窗
	private handleClose(done: Function) {
		this.$confirm("确认关闭？")
			.then((_) => {
				done();
			})
			.catch((_) => {});
	}
}
</script>

<style lang="scss" scoped>
.indent {
	width: 100%;
	height: 100% !important;
	border-radius: 6px;
	padding: 20px 70px;
	box-sizing: border-box;
	background: #ffffff;
	.user_attribute {
		width: 100%;
		// height: 400px;
		// height: 30px;
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
}
</style>
