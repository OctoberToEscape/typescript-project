import { service } from "@/utils/request";

export const getTabbars = (): any => {
	//那导航数据
	return service({
		method: "get",
		url: "/products",
	});
};

export const getTabbarDetails = (id: string, data: number): any => {
	//导航详情
	return service({
		method: "get",
		url: `/products/${id}?page=${data}`,
	});
};
