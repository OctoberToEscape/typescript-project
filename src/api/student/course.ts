import { service } from "@/utils/request";

export const getTabs = (id: string | null, type: string | number): any => {
    //拿学生端tab数据
    return service({
        method: "get",
        url: `/category/${id}?type=${type}`,
    });
};

export const getCourseData = (id: string | null): any => {
    //拿tab下的数据列表
    return service({
        method: "get",
        url: `/products/${id}`,
    });
};

export const getColumnIntro = (
    id: string | null | (string | null)[],
    type: number | string | (string | null)[]
): any => {
    //栏目说明
    return service({
        method: "get",
        url: `/column_intro/${id}?type=${type}`,
    });
};
