import { service } from "@/utils/request";

export const getTabs = (cId: any, data: any): any => {
	return service.get("/category/" + cId, data).then((result) => {
		return result.data;
	});
};
export const getCourseData = (cId: any, data: any): any => {
	return service.get("/products/" + cId, data).then((result) => {
		return result.data;
	});
};
