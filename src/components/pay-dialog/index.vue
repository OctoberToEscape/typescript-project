<template>
	<div class="pay_content">
		<div class="pay-header">
			<h3>
				<img src="@/assets/images/pay_line.png" />
				<span>购买续费</span>
				<img src="@/assets/images/pay_line.png" />
			</h3>
			<div class="step">
				<el-steps :active="active" align-center>
					<el-step title="确认订单"></el-step>
					<el-step title="付款"></el-step>
				</el-steps>
			</div>
		</div>
		<!-- 第一页盒子 -->
		<div class="pay-content" v-if="show">
			<!-- 购买时长 -->
			<div class="pay-duration">
				<h3>购买时长</h3>
				<ul class="duration-select">
					<li
						v-for="(item, index) in dialogDate.cards"
						:key="index.id"
						@click="onYearSelect(index)"
						:class="{ active: index == selectYearNum }"
					>
						{{ item.card_title }}
					</li>
				</ul>
			</div>
			<!-- 产品类型 -->
			<div class="product-type">
				<h3>产品类型</h3>
				<el-checkbox-group v-model="checkList">
					<el-checkbox
						v-for="(item, index) in dialogDate.products"
						:key="index.id"
						:label="item.product_type"
						@change="getTypeSum(index)"
						>{{ item.title }}</el-checkbox
					>
				</el-checkbox-group>
			</div>
			<!-- 支付方式 -->
			<div class="pay-way">
				<h3>支付方式</h3>
				<ul class="way-select">
					<li
						v-for="(item, index) in pay_select"
						:key="index.id"
						@click="onPayWay(index)"
						:class="{ active: index == selectPayWayNum }"
					>
						<img :src="item.url" />
						<span>{{ item.title }}</span>
						<div
							class="select-icon"
							v-if="index == selectPayWayNum"
						>
							<img src="@/assets/images/touch_icon.png" />
						</div>
					</li>
				</ul>
			</div>
			<!-- 阅读信息 -->
			<div class="agreement">
				<div class="check_box">
					<el-checkbox v-model="checked">
						我已阅读并同意签署
					</el-checkbox>
					<router-link
						tag="a"
						target="_blank"
						:to="{ name: 'clause', query: { flag: 1 } }"
					>
						《服务协议》
					</router-link>
				</div>
				<div class="pay_sum">
					总计：<span>{{ pay_sum }}元</span>
				</div>
			</div>
			<!-- 下一步 -->
			<div class="next">
				<el-button type="primary" @click="handleNext">下一步</el-button>
			</div>
		</div>
		<!-- 第二页二维码 -->
		<div class="qrcode" v-else>
			<div :class="selectPayWayNum ? 'wx-bg' : 'zfb-bg'"></div>
			<p>请使用{{ selectPayWayNum ? "微信" : "支付宝" }}完成支付</p>
			<div :class="selectPayWayNum ? 'wx_code' : 'zfb_code'">
				<div ref="qrCodeUrl"></div>
			</div>
			<span v-if="pay_result">{{ error }}</span>
		</div>
	</div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from "vue-property-decorator";
import {
	payDialogContent,
	userPayCode,
	userPayProduct,
} from "@/api/parents/indent";
@Component({
	name: "payDialog",
})
export default class payDialog extends Vue {
	@Prop({ default: true }) private show!: boolean;
	@Prop({ default: 0 }) private active!: number;

	/**
	 * @data
	 * @return
	 */

	private my_show: boolean = this.show;
	private checkList: Array<string> = [];
	private dialogDate: {
		[key: string]: Array<{ [key: string]: string | number }>;
	} = {};
	private selectYearNum: number = -1;
	private selectPayWayNum: number = -1;
	private pay_select: Array<{ [key: string]: string | boolean }> = [
		{
			url: require("@/assets/images/zfb_pay.png"),
			title: "支付宝",
			icon: false,
		},
		{
			url: require("@/assets/images/wx_pay.png"),
			title: "微信",
			icon: false,
		},
	];
	private checked: boolean = false;
	private year_prise: number = 0;
	private qrcode_order: { [key: string]: string } = {};
	private payTimer: any = null;
	private pay_result: boolean = false;
	private error: string = "";
	private QRCode: any;
	//提交订单需要用到的字段
	private pay_sum: number = 0;
	private goods_id: string | number = "";
	private good_list: Array<{ [key: string]: any }> = [];

	created() {
		//拿弹窗数据
		payDialogContent().then((res: any) => {
			this.dialogDate = res.data.data;
		});
	}
	/**
	 * @methods
	 */
	//选择年份和计算价格
	private onYearSelect(index: number): void {
		this.selectYearNum = index;
		this.year_prise = index + 1;
		this.goods_id = this.dialogDate.cards[index].card_id;
		var sum: number = 0;
		this.checkList.map((ele: any): void => {
			sum += Number(this.dialogDate.products[ele - 1].product_price);
		});
		this.pay_sum = sum * (index + 1);
	}

	//计算所选产品价格
	private getTypeSum(index: number): void {
		var sum: number = 0;
		this.checkList.map((ele: any): void => {
			sum += Number(this.dialogDate.products[ele - 1].product_price);
		});
		this.pay_sum = sum * this.year_prise;
	}

	//选择支付方式
	private onPayWay(index: number): void {
		this.selectPayWayNum = index;
	}

	//下一步
	private handleNext(): void {
		if (
			this.selectYearNum !== -1 &&
			this.selectPayWayNum !== -1 &&
			this.checked &&
			this.checkList.length
		) {
			this.my_show = false;
			this.$emit("changeVal", this.my_show);
			this.good_list = [];
			this.checkList.map((item: any): void => {
				this.good_list.push(this.dialogDate.products[item - 1]);
			});
			//数组去重
			this.good_list = Array.from(new Set(this.good_list));
			this.user_pay_result();
		} else {
			this.$message({
				duration: 5000,
				message: "请选择完整内容并且阅读并同意服务协议再前行购买～",
				type: "warning",
			});
		}
	}
	//拿支付链接,拿订单号
	private user_pay_result(): void {
		var pay_type: string = this.selectPayWayNum ? "wechat" : "alipay";
		userPayCode({
			pay_type: pay_type,
			goods_type: "card",
			goods_id: this.goods_id,
			pay_price: this.pay_sum,
			gateway: "scan",
			goods: this.good_list,
		}).then((res: any) => {
			this.qrcode_order = res.data.data;
			this.creatQrCode(res.data.data.code_url);
		});
	}
	//链接转二维码
	private creatQrCode(code: string): void {
		var qrcode = new this.QRCode(this.$refs.qrCodeUrl, {
			text: code, // 需要转换为二维码的内容.
			width: 196,
			height: 196,
			colorDark: "#000000",
			colorLight: "#ffffff",
			correctLevel: this.QRCode.CorrectLevel.H,
		});

		this.payTimer = setInterval((): any => {
			this.userPayProduct();
		}, 3000);

		setTimeout(() => {
			clearInterval(this.payTimer);
			this.pay_result = true;
			this.error = "支付超时，请重试～";
			setTimeout((): void => {
				this.pay_result = false;
				this.error = "";
				this.$emit("closeDailog");
			}, 2000);
		}, 60000);
	}

	//查询支付结果
	private userPayProduct(): void {
		userPayProduct(this.qrcode_order.order_sn).then((res: any): void => {
			if (res.data.data.status == 1) {
				this.$message({
					message: "支付成功",
					type: "success",
				});
				clearInterval(this.payTimer);
				//关闭弹窗，刷新状态
				this.$emit("refresh");
				// this._userStatus();
				// this._getOrderLis();
				// this.dialogTableVisible = false;
			} else if (res.data.data.status == 0) {
				this.pay_result = true;
				this.error = "支付失败,请重试";
				clearInterval(this.payTimer);
			}
		});
	}

	beforeDestroy() {
		if (this.payTimer) clearInterval(this.payTimer);
	}
}
</script>
<style lang="scss" scoped>
.pay_content {
	width: 100%;
	.pay-header {
		width: 100% !important;
		background-image: url(~@/assets/images/bg.png);
		background-size: 100% 100%;
		padding: 28px 0 10px 0 !important;
		box-sizing: border-box;
		h3 {
			color: #333;
			text-align: center;
			margin-bottom: 22px;
			font-size: 18px;
			font-weight: bold;
			span {
				vertical-align: middle;
				padding: 0px 10px;
			}
			img {
				vertical-align: middle;
			}
		}
		.step {
			width: 400px;
			margin: auto;
		}
	}
	.pay-content {
		width: 100%;
		padding: 15px 30px 40px 30px;
		box-sizing: border-box;
		background: #fff;
		.pay-duration {
			width: 100%;
			margin-bottom: 25px;
			h3 {
				font-size: 14px;
				color: #333;
				position: relative;
				line-height: 14px;
				text-indent: 6px;
				margin-bottom: 15px;
				&::before {
					content: "";
					display: block;
					width: 3px;
					height: 14px;
					background: linear-gradient(
						-3deg,
						rgba(99, 167, 247, 1),
						rgba(151, 205, 249, 1)
					);
					clear: both;
					position: absolute;
					left: 0%;
					top: 0%;
				}
			}
			.duration-select {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				li {
					width: 190px;
					height: 40px;
					background: rgba(255, 255, 255, 1);
					border: 1px solid rgba(193, 193, 194, 1);
					border-radius: 5px;
					text-align: center;
					line-height: 40px;
					color: #333;
					cursor: pointer;
					font-size: 14px;
					font-weight: bold;
				}
				.active {
					width: 192px;
					height: 42px;
					background: #63a7f7;
					line-height: 42px;
					color: #fff;
					border: none;
				}
			}
		}

		.product-type {
			width: 100%;
			margin-bottom: 10px;
			h3 {
				font-size: 14px;
				color: #333;
				position: relative;
				line-height: 14px;
				text-indent: 6px;
				margin-bottom: 15px;
				&::before {
					content: "";
					display: block;
					width: 3px;
					height: 14px;
					background: linear-gradient(
						-3deg,
						rgba(99, 167, 247, 1),
						rgba(151, 205, 249, 1)
					);
					clear: both;
					position: absolute;
					left: 0%;
					top: 0%;
				}
			}
			.el-checkbox-group {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				.el-checkbox {
					width: 25%;
					margin-right: 0;
					margin-bottom: 15px;
					cursor: default;
					.el-checkbox__input {
						cursor: pointer;
					}
					.el-checkbox__label {
						cursor: pointer !important;
					}
				}
			}
		}
		.pay-way {
			width: 100%;
			margin-bottom: 29px;
			h3 {
				font-size: 14px;
				color: #333;
				position: relative;
				line-height: 14px;
				text-indent: 6px;
				margin-bottom: 15px;
				&::before {
					content: "";
					display: block;
					width: 3px;
					height: 14px;
					background: linear-gradient(
						-3deg,
						rgba(99, 167, 247, 1),
						rgba(151, 205, 249, 1)
					);
					clear: both;
					position: absolute;
					left: 0%;
					top: 0%;
				}
			}
			.way-select {
				width: 100%;
				display: flex;
				align-items: center;
				li {
					width: 190px;
					height: 40px;
					background: rgba(255, 255, 255, 1);
					border: 1px solid rgba(193, 193, 194, 1);
					border-radius: 5px;
					font-size: 14px;
					color: #333;
					display: flex;
					align-items: center;
					padding: 0px 60px;
					box-sizing: border-box;
					justify-content: space-around;
					cursor: pointer;
					margin-right: 20px;
					position: relative;
					overflow: hidden;

					img {
						width: 22px;
						height: 23px;
					}

					.select-icon {
						background: #63a7f8;
						width: 65px;
						height: 50px;
						position: absolute;
						bottom: -70%;
						right: -20%;
						border-radius: 50%;
						img {
							width: 14px;
							height: 10px;
							position: absolute;
							top: 28%;
							left: 28%;
							transform: translate(-50%, -50%);
						}
					}
				}
				.active {
					border-color: #63a7f7;
				}
			}
		}
		.agreement {
			display: flex;
			justify-content: space-between;
			margin-bottom: 75px;
			.check_box {
				display: flex;
				align-items: center;
				a {
					text-decoration: none;
					font-size: 14px;
					font-weight: bold;
					cursor: pointer;
					color: #000;
				}
			}
			.pay_sum {
				font-size: 12px;
				color: #666;
				span {
					font-size: 14px;
					font-weight: bold;
					color: #333;
				}
			}
		}
		.next {
			width: 404px;
			height: 46px;
			border-radius: 5px;
			margin: auto;
			.el-button {
				width: 100%;
				height: 100%;
			}
		}
	}
	.qrcode {
		width: 100%;
		box-sizing: border-box;
		padding: 67px 232px 108px 232px;
		.wx-bg {
			width: 55px;
			height: 50px;
			margin: auto;
			background-image: url(~@/assets/images/wx_pay.png);
			background-size: 100% 100%;
			margin-bottom: 13px;
		}
		.zfb-bg {
			width: 54px;
			height: 54px;
			margin: auto;
			background-image: url(~@/assets/images/zfb_pay.png);
			background-size: 100% 100%;
			margin-bottom: 13px;
		}
		p {
			font-size: 18px;
			font-family: PingFang SC;
			color: #333;
			line-height: 18px;
			margin-bottom: 25px;
			text-align: center;
		}
		.zfb_code {
			width: 216px;
			height: 216px;
			margin: auto;
			padding: 10px;
			box-sizing: border-box;
			margin-bottom: 15px;
			background-image: url(~@/assets/images/zfb_paybg.png);
			background-size: 100%;
		}
		.wx_code {
			width: 216px;
			height: 216px;
			margin: auto;
			padding: 10px;
			box-sizing: border-box;
			margin-bottom: 15px;
			background-image: url(~@/assets/images/wechat_paybg.png);
			background-size: 100%;
		}
		span {
			display: block;
			text-align: center;
			font-size: 16px;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(246, 55, 55, 1);
		}
	}
}
</style>
