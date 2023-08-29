import { post, getURL } from "@/utils/request";

// 收藏上传图片
export const uploadCollect = (data) => post(`${getURL('ATTACH')}/api-attachment/upload`, data);

// 收藏新增
export const addCollect = (data) => post(`${getURL('HHA')}/v1/collect`, data);
