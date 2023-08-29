import _ from 'lodash';
// [gallery-map|小图id, big-map|大图id, single-map|带操作部分id]
export const WAFERID = ['gallery-map', 'big-map', 'single-map'];
// 右侧操作选项
export const controlData = [
  { title: "default", value: "DEFAULT", svg: 'icon-aim' },
  { title: "Select", value: "SELECT", svg: 'icon-check-square' },
  { title: "Ignore", value: "REJECT", svg: 'icon-close-square' },
  { title: "Complete", value: "COMPLETE", svg: 'icon-check' },
  { title: "Reload", value: "RELOAD", svg: 'icon-sync' },
  { title: "MOVE", value: "MOVE", svg: 'icon-drag' },
  { title: "Distance", value: "DISTANCE", svg: 'icon-column-width' },
  { title: "Curvature", value: "CURVATURE", svg: 'icon-radius-setting' },
];
// 当前坐标转换为1倍率下的坐标比例
export const CooToRate = (coo, LeftTopRate, zoom = 1, size) => {
  let rate = coo / (zoom * size) + LeftTopRate;
  rate = _.floor(rate, 6);
  if (rate < 0) rate = 0;
  if (rate > 1) rate = 1;
  return rate;
};

// 比例转换为坐标
export const RateToCoo = (rate, LeftTopRate, zoom = 1, size) => {
  const coo = (rate - LeftTopRate) * (zoom * size);
  return _.floor(coo, 6);
};

// 已知中心点、缩放倍率，计算圆心坐标
export const RectToCircle = (cx, cy, zoom = 1, size) => {
  const x = size / 2 - (cx - 0.5) * (zoom * size);
  const y = size / 2 - (cy - 0.5) * (zoom * size);
  return { x, y };
};