import { service } from "@/utils/request";

export const getImages = (id: string | (string | null)[]): any => {
	//拿读写列表
	return service({
		method: "get",
		url: `/writing_courses/${id}`,
	});
};

export const history_read_write = (id: string | (string | null)[]): any => {
	//拿到读写历史
	return service({
		url: `/writing_history/${id}`,
		method: "get",
	});
};

export const submitControl = (data: {
	[key: string]:
		| string
		| (null | string)[]
		| Array<{ [key: string]: string }>;
}): any => {
	//添加录音和贴画
	return service({
		method: "post",
		url: "/mark_audio",
		data,
	});
};

export const getChildHistory = (data: {
	[key: string]: string | (null | string)[];
}): any => {
	//拿标注录音等
	return service({
		method: "get",
		url: `/mark_audio/${data.course_id}/${data.img_id}`,
	});
};

export const set_history = (data: {
	[key: string]: string | (string | null)[];
}): any => {
	//提交操作历史下标
	return service({
		url: "/writing_history",
		method: "post",
		data,
	});
};

export const getPower = (data: {
	[key: string]: string | number | (string | null)[];
}): any => {
	//读写获取知识力
	return service({
		method: "post",
		url: "/finish_writing_knowledge",
		data,
	});
};

// 获取单词本;
export const getWords = (data: any): any => {
	return service.get("/words", data).then((result) => {
		return result.data;
	});
};
// 添加单词
export const addWords = (data: any): any => {
	return service.post("/words", data).then((result) => {
		return result.data;
	});
};
// 单词详情
export const wordDetail = (wordId: any): any => {
	return service.get("/words/" + wordId).then((result) => {
		return result.data;
	});
};
// 编辑单词
export const editWords = (wordId: any, data: any): any => {
	return service.put("/words/" + wordId, data).then((result) => {
		return result.data;
	});
};
// 删除单词
export const deleteWords = (wordId: any): any => {
	return service.delete("/words/" + wordId).then((result) => {
		return result.data;
	});
};

// export const setFile = (data) => {
// 	//录音上传获得链接
// 	return uploadService({
// 		method: "post",
// 		url: "/upload",
// 		data,
// 	});
// };

// export const uploadAudio = (data) => {
// 	//添加录音
// 	return service({
// 		method: "post",
// 		url: "/tape_audio",
// 		data,
// 	});
// };
