import { get, post, getURL } from "@/utils/request";

// 分页列表
export const fetchMapTypeDB = (data) =>
  post(`${getURL("SSA")}/map_type_db/page/image`, data);
