import { get, post, put, getURL } from "@/utils/request";

/**
 * 登录
 */
export const login = (data = {}) => post(`${getURL()}/auth/login`, data);
/**
 * 登出
 */
export const logout = () => post(`${getURL()}/auth/logout`);

export const IAMLogout = () => get(`${getURL()}/auth/smic-logout-url`);
/**
 * 获取用户信息
 */
export const getUser = () =>
  get(`${getURL("ADMIN")}/user/get/info/MANAGEMENT,SSA`);
/***
 * 修改用户密码
 */
export const updatePassword = (id, data = {}) =>
  put(`${getURL("ADMIN")}/user/update/password/${id}`, data);

// 获取服务器自定义配置
export const fetchConfig = () =>
  get(`${getURL("ADMIN")}/config/get/map/GLOBAL`);
