// config页面配置项
import { get, post, del, put, getURL, download } from "@/utils/request";

// 新增config数据
// type为config的类型,data为需要添加的数据
export const insertConfig = (type, data) =>
  post(`${getURL("HHA")}/config/${type}/insert`, data);

// 修改config数据
export const updateConfig = (type, data) =>
  put(`${getURL("HHA")}/config/${type}/update/${data.id}`, data);
// 修改config数据
export const updateYmsConfig = (type, data) =>
  put(`${getURL("YMS")}/setup/${type}/update${data.id}`, data);
// 删除config数据
export const deleteConfig = (type, ids) =>
  del(`${getURL("HHA")}/config/${type}/delete/${ids}`);

// 查看列表数据,过滤，排序，分页
export const fetchConfig = (type, data, pageData) => {
  const { pageNo, pageSize } = pageData;
  return post(
    `${getURL("HHA")}/config/${type}/page/filter/${pageNo}/${pageSize}`,
    data
  );
};

// 根据主键查询列表
export const fetchConfigById = (type, data) =>
  post(`${getURL("HHA")}/config/${type}`, data);

// 批量导出
export const downFile = (type, data) =>
  download(`${getURL("HHA")}/config/${type}`, { method: 'post', data });

// timeConfig配置
export const fetchUserTimeConfig = () => get(`${getURL("ADMIN")}/api-time-config/find/HHA`);

// 更新timeConfig配置
export const updateUserTimeConfig = (data) =>
  post(`${getURL("ADMIN")}/api-time-config/setting`, data);

// 获取模板列表
export const fetchPptTemplate = (data) =>
  post(`${getURL("HHA")}/v1/report/slide/master/page`, data);

// 下载模板
export const fetchPptTemplateFile = (attachmentId) =>
  download(`${getURL("ATTACH")}/api-attachment/download/${attachmentId}`, { method: 'get', 'Content-Type': 'application/json' });


// 修改模板名称
export const updatePptTemplate = (data) => put(`${getURL("HHA")}/v1/report/slide/master/${data.id}`, data);


// 删除模板
export const deletePptTemplate = (id) => del(`${getURL("HHA")}/v1/report/slide/master/${id}`);

// 获取模板列表
export const fetchReportTemplate = (data) =>
  post(`${getURL("HHA")}/v1/report/template/page`, data);

// 获取department列表
export const fetchDepartment = (pageParams, data) =>
  post(`${getURL()}/hha-gcr-org/department/page/filter/${pageParams.pageNo}/${pageParams.pageSize}`, data);

// 新增department
export const insertDepartment = (data) =>
  post(`${getURL()}/hha-gcr-org/department/insert`, data);

// 编辑department
export const updateDepartment = (data) =>
  post(`${getURL()}/hha-gcr-org/department/update/${data.id}`, data);

// 删除department
export const deleteDepartment = (id) =>
  del(`${getURL()}/hha-gcr-org/department/delete/${id}`);

// department分配保存
export const insertAllocation = (data) =>
  post(`${getURL()}/hha-gcr-org/department/save-members`, data);

// department获取已分配组织/员工
export const fetchAllocation = (data) =>
  post(`${getURL()}/hha-gcr-org/department/getMembersByType`, data);

// department获取未分配组织
export const fetchOrganization = (pageParams, data) =>
  post(`${getURL()}/hha-gcr-org/organization/page/filter/${pageParams.pageNo}/${pageParams.pageSize}`, data);

// department获取未分配员工
export const fetchEmployee = (pageParams, data) =>
  post(`${getURL()}/hha-gcr-org/employee/page/filter/${pageParams.pageNo}/${pageParams.pageSize}`, data);

// 获取report模板列表
export const updateReportTemplate = (data) =>
  post(`${getURL("HHA")}/v1/report/template`, data);

// 获取report模板详情
export const fetchReportTemplateById = (id) =>
  get(`${getURL("HHA")}/v1/report/template/${id}`);

// 获取report模板详情
export const delReportTemplateById = (id) =>
  del(`${getURL("HHA")}/v1/report/template/${id}`);


export const fetchDefectType = (pageParams, data) =>
  post(`${getURL("YMS")}/common/manual/page/filter/${pageParams.pageNo}/${pageParams.pageSize}`, data);

export const fetchAdder = (type, pageParams, data,) =>
  post(`${getURL("YMS")}/setup/${type}/page/filter/${pageParams.pageNo}/${pageParams.pageSize}`, data);


// 删除defectType数据
export const deleteDefectType = (ids) =>
  del(`${getURL("YMS")}/common/manual/delete/${ids}`);


// 删除defectType数据
export const deleteOther = (type, ids) =>
  del(`${getURL("YMS")}/setup/${type}/delete/${ids}`);

export const addDefectType = (data) =>
  post(`${getURL("YMS")}/common/manual/insert`, data);


export const updateDefectType = (data) =>
  put(`${getURL("YMS")}/common/manual/update/${data.id}`, data);

export const updateAdder = (data) =>
  post(`${getURL("YMS")}/setup/adder/update/${data.id}`, data);

export const updateReticle = (data) =>
  post(`${getURL("YMS")}/setup/reticle/update`, data);

export const insertDefectType = (data) =>
  post(`${getURL("YMS")}/common/manual/insert`, data);

export const insertAdder = (data) =>
  post(`${getURL("YMS")}/setup/adder/insert`, data);

export const insertReticle = (data) =>
  post(`${getURL("YMS")}/setup/reticle/save`, data);

// 上次保存ppt模板
export const addSildeMaster = (data) =>
  post(`${getURL("HHA")}/v1/report/slide/master`, data);

  // 切换是否可用
  export const changeDepartStatus = ({id,isAvailable}) =>
  post(`${getURL("ORG")}/department/change-status/${id}/${isAvailable}`);