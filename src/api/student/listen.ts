import { service } from "@/utils/request";

export const getVideoList = (id: string | (string | null)[]): any => {
    //学生端拿听的详情
    return service({
        method: "get",
        url: `/listen_courses/${id}`,
    });
};

export const getStudentListenTime = (id: string | (string | null)[]): any => {
    //拿到听课的记录
    return service({
        method: "get",
        url: `/listen_history/${id}`,
    });
};

export const submitListenTime = (data: {
    [key: string]: string | number | (string | null)[];
}): any => {
    //提交听课记录
    return service({
        method: "post",
        url: "/listen_history",
        data,
    });
};

export const studentFinishListen = (data: {
    [key: string]: string | number | (string | null)[];
}) => {
    //听课完成还是没完成
    return service({
        method: "post",
        url: "/finish_listen_knowledge",
        data,
    });
};
