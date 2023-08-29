import { get, post, del, put, getURL, download } from "@/utils/request";

// 分页列表
export const fetchMapTypes = (data) =>
  post(`${getURL("SSA")}/map_type/find/list`, data);

// 新增编辑
export const updateMapType = (data) =>
  post(`${getURL("SSA")}/map_type/save`, data);

// 删除mapType
export const deleteMapType = (mapTypeCode) =>
  del(`${getURL("SSA")}/map_type/delete/${mapTypeCode}`);

  // ProcessScope分页列表
export const fetchProcessScope = (data) =>
post(`${getURL("SSA")}/map_type/item/page/list`, data);

// 删除ProcessScope
export const deleteProcessScope = (id) =>
  post(`${getURL("SSA")}/map_type/item/delete`,id);


// 新增precoss scope Set
export const updateProcessScopeSet = (mapTypeCode, mapTypeItem) =>
  post(`${getURL("SSA")}/map_type/process/scop/set`, {
    mapTypeCode,
    mapTypeItem:[mapTypeItem]
  });

// 修改precoss scope状态 map_type/item/edit/state/{id}
export const updateProcessScopeStatus = (id) =>
  get(`${getURL("SSA")}/map_type/item/edit/state/${id}`);

// 下载precoss scope模板
export const downloadProcessScopeTemplate = () =>
download(`${getURL("SSA")}/map_type/item/export`);

// 修改mapType状态
export const updateMapTypeStatus = (id) =>
get(`${getURL("SSA")}/map_type/edit/match/tool/${id}`);