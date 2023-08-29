import { get, post, del, getURL } from "@/utils/request";

// task列表
export const fetchTasks = (data) =>
  post(`${getURL("SSA")}/task/list`,data);

  // mapType列表
export const fetchMapTypes = () =>
  post(`${getURL("SSA")}/task/map-type/list`);
    // 获取全量map列表
export const fetchAllMapTypes = () =>
get(`${getURL("SSA")}/map_type/select/list/model`);

  // mapType列表
export const deleteModel = (data) =>
  post(`${getURL("SSA")}/model/bind/remove`,data);

  // 绑定模型
export const bindModel = (data) =>
  post(`${getURL("SSA")}/model/bind/group`,data);

// 获取log信息
export const fetchTaskLogs = ({pageNo,pageSize,modelBindId}) =>
  post(`${getURL("SSA")}/log/page/list/${pageNo}/${pageSize}`,{modelBindId});

// about操作
export const aboutTask = (data) =>
  post(`${getURL("SSA")}/task/ABORT`,data);

// pirun操作
export const pirunTask = (data) =>
  post(`${getURL("SSA")}/task/PIRUN`,data);

// PRODUCTION操作
export const productionTask = (data) =>
  post(`${getURL("SSA")}/task/PRODUCTION`,data);

  // 获取模型下拉列表 model/map-type/list 
export const modelMapTypes = (data) => 
post(`${getURL("SSA")}/model/map-type/list `,data);


  // 获取日志列表
export const fetchModelLogs = ({pageNo,pageSize,modelBindId}) => 
post(`${getURL("SSA")}/log/page/list/${pageNo}/${pageSize} `,{modelBindId});

  // 获取日志列表
export const fetchTaskMatch = () => 
post(`${getURL("SSA")}/task/match`);

  // abort按钮触发
export const matchAbortTask = (data) => 
  post(`${getURL("SSA")}/task/match/abort`,data);

  // start按钮触发
  export const matchStartTask = (data) => 
  post(`${getURL("SSA")}/task/match/start`,data);

  // 模型落表开关
  export const updateResultSwitch = (data) => 
  post(`${getURL("SSA")}/model/bind/result/switch`,data);