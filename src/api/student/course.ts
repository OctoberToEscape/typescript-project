import { service } from "@/utils/request";

export const getTabs = (id: string | null, data: {}): any => {
	//拿学生端tab数据
	return service({
		method: "get",
		url: `/category/${id}`,
		data,
	});
};

export const getCourseData = (id: string | null): any => {
	//拿tab下的数据列表
	return service({
		method: "get",
		url: `/products/${id}`,
	});
};
