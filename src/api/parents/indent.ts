import { service } from "@/utils/request";

export const getOrderLis = (data: number | string | null): any => {
	//订单列表
	return service({
		method: "get",
		url: `orders/?page=${data}`,
	});
};

export const userBuy = (data: string): any => {
	//购买续费弹窗内容
	return service({
		method: "get",
		url: "/renewal",
		data,
	});
};

// export const userPayCode = (data: string): any => {
// 	//拿支付链接的接口
// 	return payService({
// 		method: "post",
// 		url: "/unifiedorder",
// 		data,
// 	});
// };

// export const userPayProduct = (data) => {
// 	//支付
// 	return payService({
// 		method: "get",
// 		url: "/pay_result/" + data,
// 	});
// };
