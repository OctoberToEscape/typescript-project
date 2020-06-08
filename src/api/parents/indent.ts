import { service, payService } from "@/utils/request";

export const userStatus = (): any => {
	//用户购买状态
	return service({
		method: "get",
		url: "/user_card",
	});
};

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

export const userPayProduct = (data: string): any => {
	//支付结果
	return payService({
		method: "get",
		url: `/pay_result/${data}`,
	});
};
