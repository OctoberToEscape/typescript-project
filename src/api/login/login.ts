import { service } from "@/utils/request";

export const getSms = (data: any): any => {
	//获取验证码
	return service({
		method: "post",
		url: "/send",
		data,
	});
};

export const codeLogin = (data: any): any => {
	//验证码登陆
	return service({
		method: "post",
		url: "/code_login",
		data,
	});
};

export const passwordLogin = (data: any): any => {
	//密码登录
	return service({
		method: "post",
		url: "/account_login",
		data,
	});
};

export const resetPassword = (data: any): any => {
	//修改密码
	return service({
		method: "post",
		url: "/modify",
		data,
	});
};

export const userRegister = (data: any): any => {
	//用户注册
	return service({
		method: "post",
		url: "/register",
		data,
	});
};

export const getClause = (data: string | (string | null)[]): any => {
	//服务条款
	return service({
		method: "get",
		url: `/terms/?flag=${data}`,
	});
};

export const userStatus = (): any => {
	//用户购买状态
	return service({
		method: "get",
		url: "/user_card",
	});
};
