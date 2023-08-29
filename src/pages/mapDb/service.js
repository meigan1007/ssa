import { get, post, del, put, getURL, download } from "@/utils/request";

// 分页列表
export const fetchMapTypeDB = (data) =>
  post(`${getURL("SSA")}/map_type_db/page/image`, data);

// 获取map列表
export const fetchMapTypes = (type) =>
get(`${getURL("SSA")}/map_type/select/list/${type}`);

// 添加分类
export const addSampleType = (type,data) =>
post(`${getURL("SSA")}/map_type_db/add/${type}/type`,data);

// 移除simple type
export const removeSampleType = (type,data) =>
post(`${getURL("SSA")}/map_type_db/remove/${type}/type`,data);

// delete Map
export const deleteMap = (data) =>
post(`${getURL("SSA")}/map_type_db/remove/image`,data);

// add mapdb
export const addMarkMapType = (data) =>
post(`${getURL("SSA")}/map_type_db/add/mark/map/type`,data);