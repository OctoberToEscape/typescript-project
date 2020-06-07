import { service, payService } from "@/utils/request";

export const getOrderLis = (data: number | string | null): any => {
	//订单列表
	return service({
		method: "get",
		url: `orders/?page=${data}`,
	});
};

export const payDialogContent = (): any => {
	//购买续费弹窗内容
	return service({
		method: "get",
		url: "/renewal",
	});
};

export const userPayCode = (data: {
	[key: string]: string | Array<any> | number;
}): any => {
	//拿支付链接的接口
	return payService({
		method: "post",
		url: "/unifiedorder",
		data,
	});
};

// export const userPayProduct = (data) => {
// 	//支付
// 	return payService({
// 		method: "get",
// 		url: "/pay_result/" + data,
// 	});
// };
