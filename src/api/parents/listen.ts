import { service } from "@/utils/request";

export const getVideos = (data: any): any => {
	//拿听视频列表
	return service({
		method: "get",
		url: `/listen_courses/${data}`,
	});
};

export const getTestVideo = (data: any): any => {
	//拿试听视频列表
	return service({
		method: "get",
		url: `/test_listen_courses/${data}`,
	});
};

export const submitListenTime = (data: any): any => {
	//提交听课记录
	return service({
		method: "post",
		url: "/parent_listen_history",
		data,
	});
};

export const getParentListenTime = (data: any): any => {
	//拿到听课的记录
	return service({
		method: "get",
		url: `/parent_listen_history/${data}`,
	});
};

export const parentFinishListen = (data: any): any => {
	//听课完成还是没完成
	return service({
		method: "post",
		url: "/parent_finish_listen",
		data,
	});
};
