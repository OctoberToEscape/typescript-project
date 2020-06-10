import { service } from "@/utils/request";

// 获取用户知识力 knowledge_power
export const getKnowledgePower = (): any => {
	return service.get("/knowledge_power").then((result) => {
		return result.data;
	});
};
// 获取产品分类 products
export const getProducts = (): any => {
	return service.get("/products").then((result) => {
		return result.data;
	});
};
