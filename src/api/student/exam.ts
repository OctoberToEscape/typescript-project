import { service } from "@/utils/request";

// 获取用户知识力 knowledge_test
export const getKnowledgeTest = (
    cId: string | (string | null)[],
    data: { [key: string]: { [key: string]: string } }
): any => {
    return service.get(`/knowledge_test/${cId}`, data).then((result) => {
        return result.data;
    });
};
// 提交写作题
export const writingKnowledgeTest = (data: {
    [key: string]: string | (string | null)[];
}): any => {
    return service.post("/writing_knowledge_test", data).then((result) => {
        return result.data;
    });
};
// 提交单选题
export const knowledgeTest = (data: {
    [key: string]: string | (string | null)[];
}): any => {
    return service.post("/knowledge_test", data).then((result) => {
        return result.data;
    });
};
// 完成测试 finish_test_knowledge
export const finishTestKnowledge = (data: {
    [key: string]: string | (string | null)[];
}): any => {
    return service.post("/finish_test_knowledge", data).then((result) => {
        return result.data;
    });
};
// 获取课程听读写测状态
export const getCourseStatus = (courseId: string | (string | null)[]): any => {
    return service.get(`/course_status/${courseId}`).then((result) => {
        return result.data;
    });
};
