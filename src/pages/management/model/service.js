import { get, post, del, getURL } from "@/utils/request";

// 分页列表
export const fetchModels = ({pageNo,pageSize,filterContent,mapTypeCode}) =>
  post(`${getURL("SSA")}/model/list/page/${pageNo}/${pageSize}`, {filterContent,mapTypeCode});

// 新增编辑
export const updateModelInfo = (data) =>
  post(`${getURL("SSA")}/model/info/modify`, data);

// 删除model
export const deleteModel = (id) =>
  post(`${getURL("SSA")}/model/single/remove`,{id});


  // 获取map列表
export const fetchMapTypes = () =>
get(`${getURL("SSA")}/map_type/select/list/model`);

  // save model
export const saveModelFile = (formData) =>
post(`${getURL("SSA")}/model/single/upload`,formData);

// 修改模型文件上传状态
export const updateReupload = (id) =>
post(`${getURL("SSA")}/model/state/re-upload`,{id});

// mapType下拉框查询
export const fetchMapTypesByDropDown = () =>
post(`${getURL("SSA")}/model/drop-down-box/map-type`);