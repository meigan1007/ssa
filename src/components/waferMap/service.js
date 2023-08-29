import { post, getURL } from "@/utils/request";

// 获取画图数据
export const fetchSingleMap = (data) => post(`${getURL('YMS')}/map-single/map`, data);

// 获取图片链接
export const fetchMapImage = (data) => post(`${getURL('YMS')}/image-gallery/single`, data);

