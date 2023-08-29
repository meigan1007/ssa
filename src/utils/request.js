// @ts-nocheck
import axios from "axios";
import Cookies from "js-cookie";
import { message } from "ant-design-vue";
import { delay } from "./web";
import _ from "lodash";
// import Massage from "@/components/message";

// 超过LOADING_DELAY时间，才显示Loading
// const LOADING_DELAY = 50;
// let timer = null;

/**
 * Todo
 * token失效后，跳转的链接
 * 本地开发，直接跳/login
 * 生产部署，取/admin/config/get/map/GLOBAL配置的【Portal】登录页
 */
 const LOGIN_URL = "/login";
// const LOGIN_URL = process.env.NODE_ENV === 'development' ? "/login" : "http://10.0.81.161:30050/";

// HTTP错误代码
const HTTP_ERROR_CODE = {
  400: "请求错误(400)",
  401: "未授权，请重新登录(401)",
  403: "拒绝访问(403)",
  404: "请求出错(404)",
  406: "请求参数错误(406)",
  408: "请求超时(408)",
  500: "服务器错误(500)",
  501: "服务未实现(501)",
  502: "网络错误(502)",
  503: "服务不可用(503)",
  504: "网络超时(504)",
  505: "HTTP版本不受支持(505)",
};
// 服务器错误代码
export const SERVER_ERROR_CODE = {
  50000: "服务器错误!",
  51000: "未授权，请重新登录",
};
// 90024: 'No Data' 允许无数据

// 全局axios配置
// axios.defaults.baseURL = '/api';
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.timeout = 5 * 60 * 1000;

// request拦截器
axios.interceptors.request.use((config) => {
  // console.log('request拦截器', config);
  // 过滤访问状态接口
  if (config.url && !NO_LOADING_URL.includes(config.url)) {
    // loading
  }
  // 需要权限的接口的token验证
  const token = Cookies.get("AI_YEI_TOKEN");
  if (token) config.headers.common.token = token;
  return config;
});

// response拦截器
axios.interceptors.response.use(
  (res) => {
    // console.log('response拦截器', res);
    // remove loading
    return res;
  },
  async (err) => {
    // remove loading
    const status = _.get(err, "response.status", 400);
    if (status === 401) {
      message.warning(
        _.get(err, "response.data.message") || SERVER_ERROR_CODE[51000]
      );
      Cookies.remove("AI_YEI_TOKEN");
      localStorage.removeItem("AI_YEI_USER");
      await delay(500);
      window.location.href = LOGIN_URL;
      return Promise.reject(HTTP_ERROR_CODE[401]);
    }
    const errorMessage =
      (err && err.response && HTTP_ERROR_CODE[err.response.status]) ||
      "连接服务器失败!";
    message.error(errorMessage);
    return Promise.reject(errorMessage);
  }
);

const permissionParser = (res) =>
  new Promise((resolve, reject) => {
    const { data, status } = res;
    if (status === 401 || (data && data && data.code && data.code === 51000)) {
      message.warning(data.message || SERVER_ERROR_CODE[51000]);
      Cookies.remove("AI_YEI_TOKEN");
      localStorage.removeItem("AI_YEI_USER");
      setTimeout(() => {
        window.location.href = LOGIN_URL;
      }, 500);
      reject(SERVER_ERROR_CODE[51000]);
    } else {
      resolve(res);
    }
  });

const defaultParser = (res, _FLOW) =>
  new Promise((resolve, reject) => {
    res = res.data;
    if (res) {
      const { code, data } = res;
      if (code === 20000) {
        resolve(data);
      } else if (code === 20001 || _FLOW) {
        // message.error(res.message);
        resolve(res);
      } else if (code === 50000) {
        MSG({ msg: res.message, type: "error" });
        reject(res.message);
      } else if (code === 52000) {
        resolve(res);
      } else {
        MSG({ msg: res.message, type: "warning" });
        reject(res.message);
      }
    } else {
      message.error("接口错误!");
      reject("接口错误!");
    }
  });

const downloadParser = (res) =>
  new Promise((resolve, reject) => {
    // 二进制流下载文件处理【'application/vnd.ms-excel'为MapGallery页面使用的特殊类型】
    const contentType = res.headers["content-type"] || "";
    console.log(res);
    const acceptType = [
      "octet-stream",
      "vnd.ms-excel",
      "x-zip-compressed",
      "vnd.openxmlformats",
    ];
    if (
      contentType.includes(acceptType[0]) ||
      contentType.includes(acceptType[1]) ||
      contentType.includes(acceptType[2]) ||
      contentType.includes(acceptType[3])
    ) {
      let fileName =
        decodeURI(res.headers["content-disposition"].match(/filename=(\S*)/)[1] )|| "NA"; // 下载后文件名
      const defineName = _.get(res, "config.query.fileName");
      console.log(defineName,fileName);
      if (defineName) {
        const [, type] = fileName.split(".");
        fileName = `${defineName}.${type}`;
      }
      const blob = new Blob([res.data], { type: "charset=utf-8" });
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, fileName);
      } else {
        const downloadElement = document.createElement("a");
        const href = window.URL.createObjectURL(blob);
        downloadElement.href = href;
        downloadElement.download = fileName;
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
      }
      resolve();
    } else {
      const enc = new TextDecoder("utf-8");
      res = JSON.parse(enc.decode(new Uint8Array(res.data))); //转化成json对象
      if (res.code === 90024) {
        message.warning("No Data.");
        return;
      }
      MSG({ msg: res.message, type: "error" });
      reject("文件下载失败!");
    }
  });

export const MSG = ({ msg, type }) => {
  if (msg === null || msg === [] || msg === "") {
    return;
  }
  if (msg.length > 1) {
    // message.open({
    //   content: Massage({ msg, type, title }),
    //   icon: null,
    //   duration,
    // });
    // todo
    message.info(msg[0]);
  } else {
    message[type](msg[0]);
  }
};

export const get = (url, query) =>
  new Promise((resolve) => {
    axios(url, {
      method: "GET",
      params: {
        ...query,
        time: new Date().getTime(),
      },
    })
      .then(permissionParser)
      .then((r) => defaultParser(r, query ? query._FLOW : false))
      .then((r) => resolve(r))
      .catch((e) => console.error(e));
  });

export const post = (url, data, query) =>
  new Promise((resolve,reject) => {
    axios(url, {
      method: "POST",
      data,
      params: query,
    })
      .then(permissionParser)
      .then((r) => defaultParser(r, query ? query._FLOW : false))
      .then((r) => resolve(r))
      .catch((e) => reject(e));
  });

export const put = (url, data, query) =>
  new Promise((resolve) => {
    axios(url, {
      method: "PUT",
      data,
      params: query,
    })
      .then(permissionParser)
      .then((r) => defaultParser(r, query ? query._FLOW : false))
      .then((r) => resolve(r))
      .catch((e) => console.error(e));
  });

export const del = (url, data, query) =>
  new Promise((resolve) => {
    axios(url, {
      method: "DELETE",
      data,
      params: query,
    })
      .then(permissionParser)
      .then((r) => defaultParser(r, query ? query._FLOW : false))
      .then((r) => resolve(r))
      .catch((e) => console.error(e));
  });

export const download = (url, options) =>
  new Promise((resolve) => {
    axios(url, {
      responseType: "arraybuffer",
      ...options,
    })
      .then(downloadParser)
      .then((r) => resolve(r))
      .catch((e) => console.error(e));
  });

export const callApi = (url, options) =>
  new Promise((resolve) => {
    axios(url, options)
      .then((options && options.parser) || defaultParser)
      .then((r) => resolve(r))
      .catch((e) => console.error(e));
  });

// 其他
export const getEQParams = (query) => {
  const newQuery = {};
  for (const key in query) {
    newQuery[`filter_eq_${key}`] = query[key];
  }
  return newQuery;
};

const getPrefix = (key) => {
  const PREFIX = {
    "/api2": ["MSA", "ADC"],
  };
  for (const p in PREFIX) {
    if (PREFIX[p].includes(key)) return p;
  }
  return "/api";
};

const API = {
  HHA: "/hha",
  ADMIN: "/admin",
  ATTACH: "/attach",
  DEFECT: "/defect-yms",
  YMS: "/yms-hha",
  ORG:"/hha-gcr-org",
  WAT:"/hold-lot-wat",
  SSA:"/aiyei-defect-ssa"
};
export const getURL = (key) => {
  const prefix = getPrefix(key);
  const path = key ? `${API[key] || ""}` : "";
  return `${prefix}${path}`;
};

const NO_LOADING_URL = [`${getURL("HHA")}/attachment_v2/check-download-status`];

export default axios;
