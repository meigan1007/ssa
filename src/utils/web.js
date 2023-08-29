/* eslint-disable no-inner-declarations */
import moment from "moment";
import * as zrender from "zrender/dist/zrender"
import * as echarts from "echarts";
import Konva from "konva";

// 延时
export const delay = (timeout) =>
  new Promise((reslove) => setTimeout(reslove, timeout));

// 字符串排序
export const sortBy = (key) => {
  return (a, b) => {
    const nameA = a[key].toUpperCase();
    const nameB = b[key].toUpperCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  };
};

// 获取时间戳的字符串(默认4位，约12天后重复)
export const getTimeString = (n = 4) => {
  return parseInt(
    (Date.parse(`${new Date()}`) / 1000).toString().substr(n)
  ).toString(32);
};

// 打印当前时间(微秒)
export const printTime = (sign = "") => {
  console.log(
    sign,
    `${moment(new Date()).second()}-${moment(new Date()).millisecond()}`
  );
};

// 转换成百分数 保留2位小数
export const toPercent = (point) => {
  let str = Number(point * 100).toFixed(2);
  str += "%";
  return str;
};

// COOKIE DOMAIN
export const getCookieDomain = () => {
  const host = window.location.host;
  if (host.indexOf(":") >= 0) return host.split(":")[0];
  let arr = host.split(".");
  if (arr.length > 2) {
    const len = arr.length;
    arr = [arr[len - 2], arr[len - 1]];
  }
  return `.${arr.join(".")}`;
};

/**
 * 时间格式化
 * @param value
 * @param fmt
 * @returns {*}
 */
export function formatDate(value, fmt) {
  let regPos = /^\d+(\.\d+)?$/
  if (regPos.test(value)) {
    //如果是数字
    let getDate = new Date(value)
    let o = {
      'M+': getDate.getMonth() + 1,
      'd+': getDate.getDate(),
      'h+': getDate.getHours(),
      'm+': getDate.getMinutes(),
      's+': getDate.getSeconds(),
      'q+': Math.floor((getDate.getMonth() + 3) / 3),
      S: getDate.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
      }
    }
    return fmt
  } else {
    //TODO
    value = value.trim()
    return value.substr(0, fmt.length)
  }
}
/**
 * [数组添加，存在不处理，不存在push]
 * @param  array [原数据]
 * @param  value [需要添加的值]
 * @param key 可空，如果比较的是对象，可能存在地址不一样但值实际上是一样的情况，可以传此字段判断对象中唯一的字段，例如 id。不传则直接比较实际值
 * @returns {boolean} 成功 push 返回 true，不处理返回 false
 */
export function pushIfNotExist(array, value, key) {
  for (let item of array) {
    if (key && item[key] === value[key]) {
      return false
    } else if (item === value) {
      return false
    }
  }
  array.push(value)
  return true
}


/**
 * [过滤对象]
 * @param  obj [过滤前数据]
 * @param  arr [过滤条件，要求为数组]
 */
export function filterObj(obj, arr) {
  if (typeof (obj) !== "object" || !Array.isArray(arr)) {
    throw new Error("参数格式不正确")
  }
  const result = {}
  Object.keys(obj).filter((key) => arr.includes(key)).forEach((key) => {
    result[key] = obj[key]
  })
  return result
}

// 画图封装
export const ZRENDER = {
  STYLE: {
    MOVE: {
      POINT: { fill: '#ff00ff' },
      LINE: { fill: 'none', stroke: '#ff00ff' },
      DISTANCE: { fill: '#ff00ff', lineWidth: 1 },
      SUPPORT: { stroke: '#f0f', lineWidth: 1, lineDash: [0, 4, 4] },
      SELECT: { fill: '#00ff00', opacity: 0.3 },
      REJECT: { fill: '#ff0000', opacity: 0.3 },
      MOVE: { stroke: '#f0f', lineWidth: 2, lineDash: [0, 4, 4] },
    },
    IMAGE_BOX: { fill: 'transparent', stroke: '#ff0000' },
    DEFECT: { fill: '#ff0000' },
    DIE: { fill: 'none', stroke: '#14f1ff' },
    RETICLE: { fill: 'none', stroke: '#0000ff' },
    CIRCLE: { fill: 'none', stroke: '#ff0000' },
    ZERO: { fill: 'none', stroke: '#0000ff' },
    NOSCAN: { fill: '' },
    STAR: { fill: '#112ca3' },
    BORDER: { fill: 'none', stroke: '#dddddd' },
    HUSK: { fill: '#ffffff' },
    ISOGON: { fill: '#0000ff' },
    AUXILIARY: { stroke: 'orange' },
    TEXT: {
      fill: 'none',
      stroke: 'none',
      fontSize: 10,
      textAlign: 'center',
      textVerticalAlign: 'middle',
    },
  },
  Husk: zrender.Path.extend({
    type: 'husk',
    shape: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
    buildPath: function (ctx, shape) {
      const { x, y, width, height } = shape;
      ctx.lineTo(x + width, y);
      ctx.arc(x + width / 2, y + height / 2, width / 2, Math.PI * -0.5, Math.PI * (2 - 0.5));
      ctx.lineTo(x, y);
      ctx.lineTo(x, y + height);
      ctx.lineTo(x + width, y + height);
      ctx.lineTo(x + width, y);
      ctx.closePath();
    },
  }),
  // 画网格
  // zero起点 zoom倍数
  renderGrid: function ({ group, width, height, size, zoom, circle, centerOfCircleX, centerOfCircleY }) {
    width = parseFloat(width);
    height = parseFloat(height);
    const WAFER_SIZE = size * zoom;
    const WAFER_RADIUS = WAFER_SIZE / 2;
    const WAFER_DIAGNOAL = Math.sqrt(2) * WAFER_RADIUS;
    const WAFER_CENTRE = { x: centerOfCircleX, y: centerOfCircleY };
    const start = { x: 0, y: 0 };
    const end = { x: size, y: size };
    // 余数如果为0，从下一根线开始
    start.x = circle.x % width || width;
    start.y = circle.y % height || height;
    const endXRemainder = (size - circle.x) % width;
    const endYRemainder = (size - circle.y) % height;
    end.x = size - (endXRemainder || width);
    end.y = size - (endYRemainder || height);
    // console.log('start.x, end.x :>> ', start.x, end.x);
    // 先从水平线开始绘制，从上往下
    for (let y = start.y; y < size; y += height) {
      // 设置一个开关，当die数量超过N，不在做边缘优化计算；
      // 通过圆心的距离，计算该线条在圆内的真实起点与终点
      const powY = Math.pow(WAFER_CENTRE.y - y, 2);
      function getStartX1(x) {
        const distance = Math.sqrt(Math.pow(WAFER_CENTRE.x - x, 2) + powY);
        if (distance <= WAFER_RADIUS) {
          return x;
        }
        // 防止无限循环
        if (distance > WAFER_DIAGNOAL) {
          console.log('起点 ERROR:该线条与圆无相交', x);
          return x;
        }
        return getStartX1(x + width);
      }
      const x1 = getStartX1(start.x);
      function getStartX2(x) {
        const distance = Math.sqrt(Math.pow(WAFER_CENTRE.x - x, 2) + powY);
        if (distance <= WAFER_RADIUS) {
          return x;
        }
        // 防止无限循环
        if (distance > WAFER_DIAGNOAL) {
          console.log('终点 ERROR:该线条与圆无相交');
          return x;
        }
        return getStartX2(x - width);
      }
      const x2 = getStartX2(end.x);
      // 绘制线条
      const LineX = new zrender.Line({
        shape: {
          x1,
          y1: y,
          x2,
          y2: y,
        },
        style: ZRENDER.STYLE.DIE,
      });
      group.add(LineX);
    }
    // 垂直线
    // 先从水平线开始绘制，从上往下
    for (let x = start.x; x < size; x += width) {
      // todo 设置一个开关，当die数量超过N，不在做边缘优化计算；
      // 通过圆心的距离，计算该线条在圆内的真实起点与终点
      const powX = Math.pow(WAFER_CENTRE.x - x, 2);
      function getStartY1(y) {
        const distance = Math.sqrt(Math.pow(WAFER_CENTRE.y - y, 2) + powX);
        if (distance <= WAFER_RADIUS) {
          return y;
        }
        // 防止无限循环
        if (distance > WAFER_DIAGNOAL) {
          console.log('起点 ERROR:该线条与圆无相交', y);
          return y;
        }
        return getStartY1(y + height);
      }
      const y1 = getStartY1(start.y);
      function getStartY2(y) {
        const distance = Math.sqrt(Math.pow(WAFER_CENTRE.y - y, 2) + powX);
        if (distance <= WAFER_RADIUS) {
          return y;
        }
        // 防止无限循环
        if (distance > WAFER_DIAGNOAL) {
          console.log('终点 ERROR:该线条与圆无相交');
          return y;
        }
        return getStartY2(y - height);
      }
      const y2 = getStartY2(end.y);
      // 绘制线条
      const LineY = new zrender.Line({
        shape: {
          x1: x,
          y1,
          x2: x,
          y2,
        },
        style: ZRENDER.STYLE.DIE,
      });
      group.add(LineY);
    }
  },
  renderReticle: function ({ group, width, height, size, zoom, reticle, reticleSizeX, reticleSizeY }) {
    if (reticleSizeX === null || reticleSizeY === null) return;
    const rw = parseFloat(width) * reticleSizeX;
    const rh = parseFloat(height) * reticleSizeY;
    const xDiff = (size * zoom) % rw;
    const yDiff = (size * zoom) % rh;
    const x0 = reticle.x - (size * zoom - xDiff + rw);
    const x1 = reticle.x + (size * zoom - xDiff + rw);
    const y0 = reticle.y - (size * zoom - yDiff + rh);
    const y1 = reticle.y + (size * zoom - yDiff + rh);
    for (let x = x0; x < x1; x += rw) {
      const LineY = new zrender.Line({
        shape: {
          x1: x,
          y1: y0,
          x2: x,
          y2: y1,
        },
        style: ZRENDER.STYLE.RETICLE,
      });
      group.add(LineY);
    }
    for (let y = y0; y < y1; y += rh) {
      const LineX = new zrender.Line({
        shape: {
          x1: x0,
          y1: y,
          x2: x1,
          y2: y,
        },
        style: ZRENDER.STYLE.RETICLE,
      });
      group.add(LineX);
    }
  },
  renderZero: function ({ group, width, height, zero, circle }) {
    const zeroRect = new zrender.Rect({
      shape: {
        x: zero.x,
        // 左下角坐标
        y: zero.y - height,
        width,
        height,
      },
      style: ZRENDER.STYLE.ZERO,
    });
    group.add(zeroRect);
    const circleRect = new zrender.Rect({
      shape: {
        x: circle.x,
        // 左下角坐标
        y: circle.y - height,
        width,
        height,
      },
      style: ZRENDER.STYLE.CIRCLE,
    });
    group.add(circleRect);
  },
  renderDie: function ({ group, width, height, dies, noScan }) {
    noScan &&
      noScan.forEach((item) => {
        const rect = new zrender.Rect({
          shape: {
            x: item.x,
            y: item.y,
            width,
            height,
          },
          style: ZRENDER.STYLE.NOSCAN,
        });
        group.add(rect);
      });
    dies &&
      dies.forEach((item) => {
        const rect = new zrender.Rect({
          shape: {
            x: item.x,
            y: item.y,
            width,
            height,
          },
          style: ZRENDER.STYLE.DIE,
        });
        group.add(rect);
      });
  },
  // 添加小圆点
  renderDefect: function ({ group, defects, size }) {
    defects &&
      defects.forEach((item) => {
        const circle = new zrender.Circle({
          shape: {
            cx: item.x,
            cy: item.y,
            r: size === 150 ? 1 : 2,
          },
          style: ZRENDER.STYLE.DEFECT,
        });
        group.add(circle);
      });
  },
};

// 画图
export const RENDER_WAFER_MAP = (data, options) => {
  const { group, dieVisible = true, reticleVisible, noScans = [] } = options;
  const { canvasParam, dieWidth, dieHeight, zeroDie, circleDie, reticleDie, reticleSizeX, reticleSizeY } = data;
  const { magnification, size, centerOfCircleX, centerOfCircleY, pixelRadius } = canvasParam;
  const errorMessage = [];
  if (!group) errorMessage.push('group is invalid.');
  if (centerOfCircleX === null) errorMessage.push('centerOfCircleX is invalid.');
  if (centerOfCircleY === null) errorMessage.push('centerOfCircleY is invalid.');
  if (pixelRadius === null) errorMessage.push('pixelRadius is invalid.');
  // 不同Product叠图,也需要画border
  const border = new zrender.Circle({
    shape: { cx: centerOfCircleX, cy: centerOfCircleY, r: pixelRadius },
    style: ZRENDER.STYLE.BORDER,
  });
  group.add(border);
  if (!dieWidth) errorMessage.push('dieWidth is invalid.');
  if (!dieHeight) errorMessage.push('dieHeight is invalid.');
  if (!zeroDie) errorMessage.push('zeroDie is invalid.');
  if (!circleDie) errorMessage.push('circleDie is invalid.');
  if (!magnification) errorMessage.push('magnification is invalid.');
  if (!size) errorMessage.push('size is invalid.');
  if (errorMessage.length > 0) {
    console.error(errorMessage);
    return;
  }
  if (noScans !== []) {
    ZRENDER.renderDie({
      group,
      width: dieWidth,
      height: dieHeight,
      noScan: noScans,
    });
  }
  if (dieVisible) {
    ZRENDER.renderGrid({
      group,
      width: dieWidth,
      height: dieHeight,
      size,
      zoom: magnification,
      zero: zeroDie,
      circle: circleDie,
      centerOfCircleX,
      centerOfCircleY,
    });
  }
  if (dieVisible) {
    ZRENDER.renderZero({
      group,
      width: dieWidth,
      height: dieHeight,
      zero: zeroDie,
      circle: circleDie,
    });
  }
  const husk = new ZRENDER.Husk({
    style: ZRENDER.STYLE.HUSK,
    shape: {
      x: centerOfCircleX - pixelRadius,
      y: centerOfCircleY - pixelRadius,
      width: pixelRadius * 2,
      height: pixelRadius * 2,
    },
  });
  group.add(husk);
  if (reticleVisible && reticleDie && reticleSizeX && reticleSizeY) {
    ZRENDER.renderReticle({
      group,
      width: dieWidth,
      height: dieHeight,
      size,
      zoom: magnification,
      reticle: reticleDie,
      reticleSizeX,
      reticleSizeY,
    });
  }
};

// 计算圆心到直线的距离
export const calcDistanceWith2Points = ({ x1, y1, x2, y2, cx, cy }) => {
  const yDiff = y2 - y1;
  const xDiff = x2 - x1;
  if (yDiff === 0) {
    return Math.abs(cy - y1);
  } else if (xDiff === 0) {
    return Math.abs(cx - x1);
  } else {
    const k = yDiff / xDiff;
    const b = y2 - k * x1;
    const h = Math.abs(k * cx + b - cy) / Math.sqrt(k * k + 1);
    return Math.floor(h.toFixed(2));
  }
};
// 已知圆上3点，求圆心坐标
export const calcCurvatureWith3Points = ({ x1, y1, x2, y2, x3, y3 }) => {
  const centerCircleX =
    ((y2 - y1) * (y3 * y3 - y1 * y1 + x3 * x3 - x1 * x1) - (y3 - y1) * (y2 * y2 - y1 * y1 + x2 * x2 - x1 * x1)) /
    (2.0 * ((x3 - x1) * (y2 - y1) - (x2 - x1) * (y3 - y1)));
  const centerCircleY =
    ((x2 - x1) * (x3 * x3 - x1 * x1 + y3 * y3 - y1 * y1) - (x3 - x1) * (x2 * x2 - x1 * x1 + y2 * y2 - y1 * y1)) /
    (2.0 * ((y3 - y1) * (x2 - x1) - (y2 - y1) * (x3 - x1)));
  const radius = Math.sqrt((x1 - centerCircleX) * (x1 - centerCircleX) + (y1 - centerCircleY) * (y1 - centerCircleY));
  return { centerCircleX, centerCircleY, radius };
};

/**
 * [获取时间]
 * @param  value [选中的日期]
 * @param  return  [返回一个月之前的日期] <后续自定义>
 */
export function getLastMonthYestdy(value) {
  var date = new Date(value); //        1    2    3    4    5    6    7    8    9   10    11   12月
  var daysInMonth = new Array([0], [31], [28], [31], [30], [31], [30], [31], [31], [30], [31], [30], [31]);
  var strYear = date.getFullYear();
  var strDay = date.getDate();
  var strMonth = date.getMonth() + 1;
  if (strYear % 4 == 0 && strYear % 100 != 0) {//一、解决闰年平年的二月份天数   //平年28天、闰年29天//能被4整除且不能被100整除的为闰年
    daysInMonth[2] = 29;
  }
  if (strMonth - 1 == 0) //二、解决跨年问题
  {
    strYear -= 1;
    strMonth = 12;
  }
  else {
    strMonth -= 1;
  }
  //        strDay = daysInMonth[strMonth] >= strDay ? strDay : daysInMonth[strMonth];
  strDay = Math.min(strDay, daysInMonth[strMonth]);//三、前一个月日期不一定和今天同一号，例如3.31的前一个月日期是2.28；9.30前一个月日期是8.30

  if (strMonth < 10)//给个位数的月、日补零
  {
    strMonth = "0" + strMonth;
  }
  if (strDay < 10) {
    strDay = "0" + strDay;
  }
  let datastr = strYear + "-" + strMonth + "-" + strDay;
  return datastr;

}

/**
 * 构造树型结构数据
 * @param {*} source 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function getTreeData(source, id, parentId, children, rootId) {
  id = id || 'id';
  parentId = parentId || 'parentId';
  children = children || 'children';
  rootId = rootId || '000000';
  // console.log(source, id, parentId, children, rootId);
  const cloneData = JSON.parse(JSON.stringify(source)); // 对源数据深度克隆
  return cloneData.filter((father) => {
    const branchArr = cloneData.filter((child) => father[id] === child[parentId]); // 返回每一项的子级数组
    branchArr.length > 0 ? (father[children] = branchArr) : delete father[children]; // 如果存在子级，则给父级添加一个children属性，并赋值
    return father[parentId] === rootId; // 返回第一层
  });
}
// chart X轴样式
export const renderXAxis = (size, xLen, spacing, grid) => {
  // 小图small 25条不分栏， 25-100条分五栏，100条以上分十栏，两百条以上分15栏
  // 大图big  50条不分栏， 50-100条分两栏，100条以上分五栏
  let intervalNum = 0;
  if (size === 'big') {
    if (xLen > 50) {
      const len = xLen * (spacing / 100);
      if (len > 100) {
        intervalNum = 5;
      } else if (len > 50) {
        intervalNum = 2;
      } else {
        intervalNum = 0;
      }
    }
  } else {
    if (xLen > 20) {
      const len = xLen * (spacing / 100);
      if (len > 200) {
        intervalNum = 15;
      } else if (len > 100) {
        intervalNum = 10;
      } else if (len > 25) {
        intervalNum = 5;
      }
    }
  }
  return {
    type: 'category',
    axisLabel: {
      rotate: 270,
      interval: intervalNum,
      formatter: function (value) {
        let valueTxt = value;
        if (grid < value.length) {
          valueTxt = value.substring(0, grid - 3) + '...';
        } else {
          valueTxt = value.substring(0, grid);
        }
        return valueTxt;
      },
    },
  };
}

export const convertBase64UrlToBlob = (base64) => {
  const parts = base64.dataURL.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; i++) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: contentType });
};

export const exportImg = (id, name = 'Echarts') => {
  const chart = echarts.getInstanceByDom(document.getElementById(id));
  const url = chart.getConnectedDataURL({
    pixelRatio: 10,
    backgroundColor: '#fff', // 图表背景色
    excludeComponents: [
      'toolbox', // 保存图表时忽略的工具组件,默认忽略工具栏
    ],
    type: 'png', // 图片类型支持png和jpeg
  });
  const a = document.createElement('a');
  a.download = `${name}.png`;
  a.target = '_blank';
  a.href = url;
  // Chrome and Firefox
  if (typeof MouseEvent === 'function') {
    const evt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: false,
    });
    a.dispatchEvent(evt);
  } else {
    // IE
    const base64 = {
      dataURL: url,
      type: 'png',
      ext: 'png',
    };
    const blob = convertBase64UrlToBlob(base64);
    // 下载
    window.navigator.msSaveBlob(blob, `${name}.png`);
  }
};

//产生随机数函数
export const RndNum = (n = 8) => {
  let rnd = ""
  for (var i = 0; i < n; i++) {
    rnd += Math.floor(Math.random() * 10);
  }
  return rnd;
}

// 按钮权限
export const authority = (value) => {
  const AIYEI_USER = JSON.parse(localStorage.getItem("AIYEI_USER") || {});
  const { permissions } = AIYEI_USER;
  return permissions.includes(value) ? true : false;
}

// 获取服务器地址数据源
export const getGLOBAL = (value) => {
  let GLOBAL = JSON.parse(localStorage.getItem("GLOBAL") || {});
  let size = value ? value : '/0/0';
  // GLOBAL.PATH_ATTACH_BUCKET = GLOBAL.PATH_S3_BUCKET + size + GLOBAL.PATH_ATTACH_BUCKET.split(":")[0] + ':';
  GLOBAL.PATH_IMAGE_BUCKET = GLOBAL.PATH_S3_BUCKET + size + GLOBAL.PATH_IMAGE_BUCKET
  return GLOBAL;
}

// 设置相关local storag 方法
class LocalCache {
  // 设置storage
  setCache(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
  }
  // 获取storage的值
  getCache(key) {
    // obj => string => obj
    const value = window.localStorage.getItem(key)
    if (value) {
      return JSON.parse(value)
    }
  }
  // 移除某个key的storage
  deleteCache(key) {
    window.localStorage.removeItem(key)
  }
  // 移除所有的storage
  clearCache() {
    window.localStorage.clear()
  }
}

export const storage = new LocalCache

// 执行不能输入通配符的自定义校验方法
// 匹配1个或者多个*/$

export const wildcardValidate = (rule, value, callback) => {
  const RegExp = /^[\*\$]+$/g
  if(!RegExp.test(value)){
    callback()
  }else{
    callback('You are not allowed to enter only wildcards!')
  }
}

// 是否有文件校验规则
export const modalFileValidate = (rule, value, callback) => {
  if(value && value.fileList && value.fileList.length > 3){
    callback('Please upload 0~3 map images!')
  }else{
    callback()
  }
}

// 获取文件base64格式
export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// Konva 画图封装
export const renderKonva = {
  renderCircle(x=0,y=0,radius=3){
    return  new Konva.Circle({
      x,
      y,
      radius,
      fill: "red",
    });
  },
  // 画arc
  renderArc({centerCircleX,centerCircleY,radius,angleEnd,angleStart,ringRadius},strokeWidth=1){
    const arc = new Konva.Arc({
      // 圆心
      x: centerCircleX,
      y: centerCircleY,
      // 圆弧半径 向内外  各偏移3px
      innerRadius: radius - ringRadius,
      outerRadius: radius + ringRadius,
      fill: "#00ff0010",
      stroke: "red",
      strokeWidth,
      // 计算起始点的夹角度数
      angle: angleEnd - angleStart,
      // 计算起点的角度，从右侧3点钟方向作为0度开始计算，顺时针为正 逆时针为负
      rotation: angleStart - 90,
    });
    return arc
  },
  // 画线
  renderLine(mark,closed=false){
    return  new Konva.Line({
              points: mark,
              fill: "#00ff0010",
              stroke: "red",
              strokeWidth: 1,
              closed,
            });
  },
}

    // 渲染map图
  export const  renderKonvaMap = (
      { markInfos, markArcInfos, imagePath },
      callback,
      width = 100,
      height = 100
    ) => {
      const bgLayer = new Konva.Layer();
      const layer = new Konva.Layer();
      // 第一步 画背景图片
      const imageObj = new Image();
      imageObj.src = getGLOBAL().PATH_IMAGE_BUCKET + imagePath;
      imageObj.onload = () => {
        const background = new Konva.Image({
          x: 0,
          y: 0,
          image: imageObj,
          width,
          height,
        });
        // add the shape to the layer
        bgLayer.add(background);
        bgLayer.batchDraw();
        // if (this.isShowMark) {
        const ploys = []
        markInfos &&
          markInfos.forEach((item) => {
            item?.forEach((mark) => {
              const poly = new Konva.Line({
                points: mark.map((item) => (item * width) / 100),
                fill: "#00ff0010",
                stroke: "red",
                strokeWidth: 1,
                closed: true,
              });
              ploys.push(poly)
              // layer.add(poly);
            });
          });
        markArcInfos.forEach((item) => {
          item.forEach((mark) => {
            const {
              centerCircleX,
              centerCircleY,
              radius,
              ringRadius,
              angleEnd,
              angleStart,
            } = mark;
            const offectRadius =
              (width / 100) * ringRadius > 1 ? (width / 100) * ringRadius : 1;
            const arc = new Konva.Arc({
              // 圆心
              x: centerCircleX * (width / 100),
              y: centerCircleY * (width / 100),
              // 圆弧半径 向内外  各偏移3px
              // innerRadius: radius - ringRadius,
              // outerRadius: radius + ringRadius,
              innerRadius: radius * (width / 100) - offectRadius,
              outerRadius: radius * (width / 100) + offectRadius,
              fill: "#00ff0010",
              stroke: "red",
              strokeWidth: 1,
              // 计算起始点的夹角度数
              angle: angleEnd - angleStart,
              // 计算起点的角度，从右侧3点钟方向作为0度开始计算，顺时针为正 逆时针为负
              rotation: angleStart - 90,
            });
            ploys.push(arc)
            // layer.add(arc);
          });
        });
        ploys.map(item => {
          layer.add(item)
        })
        callback(bgLayer,layer)
      };
    }


// 下拉框搜索过滤
export const selectFilterOption = (input, option) => {
  return (
    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
  );
}
export const downloadImage = (imageUrl, name) => {
  const a = document.createElement('a');
  getLocalUrl(imageUrl).then(res => {
    a.href = res
    a.download = name
    const event = new MouseEvent('click')
    a.dispatchEvent(event)
    a.remove()
  })
};

function getLocalUrl(url) {
  // 图片加载非同步，需要promise包裹
  return new Promise((resolve, reject) => {
    // 创建图片，并将图片属性设置为可跨域
    const img = document.createElement('img')
    // 不设置该属性canvas无法将图片转为base64
    img.setAttribute('crossorigin', 'anonymous')
    img.src = url
    img.onload = function () {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctr = canvas.getContext('2d')
      // 画图
      ctr.drawImage(img, 0, 0, img.width, img.height)
      resolve(canvas.toDataURL())
    }
  })
}


/**
 * [快速选择时间]
 * @param  timeType [时间类型]：可选值：'day/week/month/fullDays/fullWeek/fullMonths'
 * @param  timeValue [推迟/提前的数值]
 * @param  typeMap [类型与moment对应映射关系]
 */

export const fastSelectTimes =  function (timeType,timeValue,typeMap) {
  let firstDate = ''
  let lastDate = ''
  if(!(timeType.includes('full'))){
      lastDate = moment()
      firstDate = moment().subtract(timeValue, timeType)
      return [firstDate,lastDate]
  }else{
      let firstDay = new Date()
      if(timeType === 'fullWeeks'){
          // week 周日为每周第一天 先获取到星期- 转为同格式
          firstDay = moment().startOf(typeMap[timeType]).add(1,'days')
      }else if (timeType === 'fullDays') {
          // 先获取到昨天
          firstDay = moment().startOf(typeMap[timeType]).format('YYYY-MM-DD')
      }else if(timeType === 'fullMonths') {
          firstDay = moment().startOf(typeMap[timeType]).format('YYYY-MM-DD')
      }
      lastDate = moment(firstDay).subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59'
      firstDate = moment(firstDay).subtract(timeValue, this.dateMap[timeType]).format('YYYY-MM-DD HH:mm:ss')
      return [moment(firstDate),moment(lastDate)]
  }
}
