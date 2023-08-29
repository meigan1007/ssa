
// config页面配置项
import { get, post, getURL, } from "@/utils/request";

// 获取收藏列表
export const fetchCollection = (data) => {
  return post(`${getURL('HHA')}/v1/collect/page`, data)
};

// 查找文件列表
export const fetchImageById = (id) => get(`${getURL("ATTACH")}
/api-attachment/get/id/${id}`)