<template>
  <div
    :class="'wafer-map' + ' ' + (id.includes(WAFERID[1]) ? 'mask' : '')"
    v-if="JSON.stringify(mapData) !== '{}' && id"
  >
    <!-- 圆晶图 -->
    <div
      :style="
        waferIds.includes(id.split('|')[1]) ? 'border:2px solid #72c140;' : ''
      "
      :class="
        id.includes(WAFERID[0])
          ? 'small'
          : id.includes(WAFERID[1])
          ? 'large'
          : ''
      "
      @click="onClickMap(waferInfo)"
      @dblclick="ondbClickMap"
    >
      <div
        :id="id"
        :style="
          'width:' +
          mapData.canvasParam.size +
          'px;' +
          'height:' +
          mapData.canvasParam.size +
          'px'
        "
      />
      <img
        v-if="id.includes(WAFERID[0])"
        :style="`display:${
          waferIds.includes(id.split('|')[1]) ? 'block' : 'none'
        }`"
        class="img-select"
        src="@/assets/image/exist_image.png"
      />
      <img
        :class="
          id.includes(WAFERID[0])
            ? 'img-picture0'
            : id.includes(WAFERID[1])
            ? 'img-picture1'
            : id.includes(WAFERID[2])
            ? 'img-picture2'
            : ''
        "
        src="@/assets/image/picture.png"
      />
      <a-icon
        v-if="id.includes(WAFERID[1])"
        type="close"
        class="map-icon"
        @click="onClose"
      />
      <div v-if="id.includes(WAFERID[0])" class="map-detail">
        <p>{{ mapData.waferNo }}</p>
        <p>{{ mapData.scanTime }}</p>
        <p>{{ mapData.defectCount }}</p>
        <p>
          {{
            mapData.defectiveDieRatio
              ? mapData.defectiveDieRatio.toFixed(2) + "%"
              : ""
          }}
        </p>
      </div>
    </div>
    <!-- 操作部分 -->
    <ul class="control" v-if="id.includes(WAFERID[2])">
      <a-tooltip
        placement="right"
        v-for="(item, index) in controlData"
        :key="index"
      >
        <template slot="title">
          <span>{{ item.title }}</span>
        </template>
        <li
          @click="onClickActive(item.value)"
          :class="selectActive === item.value ? 'active-class' : ''"
        >
          <i
            style="font-size: 24px"
            :class="item.value !== '' ? 'iconfont' + ' ' + item.svg : ''"
          />
        </li>
      </a-tooltip>
    </ul>
    <DefectImage ref="defectImageRef" />
  </div>
</template>
<script>
import * as zrender from "zrender/dist/zrender"
import _ from "lodash";
import moment from "moment";
import DefectImage from "./component/defectImage.vue";
import { Decimal } from "decimal.js";
import { fetchSingleMap } from "./service";
import {
  RENDER_WAFER_MAP,
  ZRENDER,
  delay,
  calcDistanceWith2Points,
  calcCurvatureWith3Points,
  RndNum,
} from "@/utils/web";
import {
  WAFERID,
  controlData,
  CooToRate,
  RateToCoo,
  RectToCircle,
} from "./constant";
export default {
  components: { DefectImage },
  props: {
    waferId: {
      type: String,
      default() {
        return "";
      },
    },
    waferInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    waferIds: {
      type: Array,
      default() {
        return [];
      },
    },
    waferZoom: {
      type: Boolean,
      default() {
        return true;
      },
    },
  },
  data() {
    return {
      mapData: {},
      id: this.waferId + "|" + RndNum(),
      WAFERID: WAFERID,
      controlData: controlData,
      current: {
        areaEnable: false,
        moveEnable: false,
        zooms: {
          zoom: 1,
          cx: 0.5,
          cy: 0.5,
          waferSize: 300000,
          originalDieWidth: 30000,
          originalDieHeight: 30000,
        },
      },
      selectActive: "DEFAULT",
      selectCoo: [],
      rejectCoo: [],
      distance: { points: [], distance: 0 },
      curvature: { points: [], curvature: 0 },
      batchRanges: [],
      ignoredBars: [],
    };
  },
  methods: {
    // 右侧操作选项
    onClickActive(value) {
      this.selectActive = value;
      if (value === "RELOAD") {
        this.selectActive = "RELOAD";
        this.selectCoo = [];
        this.rejectCoo = [];
        this.distance = { points: [], distance: 0 };
        this.curvature = { points: [], curvature: 0 };
        this.batchRanges = [];
        this.getSingleMap();
      } else if (value === "COMPLETE") {
        const selectArr = this.selectCoo.filter((item) => {
          if (item.drx) {
            return item;
          }
        });
        const rejectArr = this.rejectCoo.filter((item) => {
          if (item.drx) {
            return item;
          }
        });
        if (rejectArr.length === 0 && selectArr.length === 0) return;
        this.batchRanges.push({
          type: "MAP",
          batchId: moment().format("YYYY-MM-DD HH:mm:ss"),
          ignored: rejectArr,
          selected: selectArr,
        });
        this.getSingleMap();
      } else if (value === "SELECT") {
        this.rejectCoo = [];
      } else if (value === "REJECT") {
        this.selectCoo = [];
      }
    },
    // 切换单个wafer
    onChangeWaferId(key) {
      this.id = key;
      this.$nextTick(() => {
        this.getSingleMap();
      });
    },
    // 小图单击才有选中效果
    onClickMap(waferInfo) {
      if (!this.id.includes(WAFERID[0])) return;
      this.$emit("onMapSelect", waferInfo);
      sessionStorage.setItem("mapSelectId", this.id); // 放大后还原缩小用
    },
    // 小图双击才有放大效果
    ondbClickMap() {
      if (this.id.includes(WAFERID[0]) && this.waferZoom) {
        this.id =
          WAFERID[1] +
          "|" +
          sessionStorage.getItem("mapSelectId").split("|")[1];
        this.getSingleMap();
      }
    },
    // 弹层关闭(还原)
    onClose() {
      this.id = sessionStorage.getItem("mapSelectId");
      this.getSingleMap();
    },
    // 控制MOVE隐藏显示
    onControl(magnification) {
      this.controlData.forEach((item) => {
        if (magnification > 1 && item.title === "MOVE") {
          this.$nextTick(() => {
            this.selectActive = "MOVE";
            item.value = item.title;
          });
        }
        if (magnification <= 1 && item.title === "MOVE") {
          item.value = "";
        }
      });
    },
    // chart联动map
    onChangeMap(name) {
      let is = true;
      if (this.ignoredBars.length > 0) {
        this.ignoredBars.filter((item, index) => {
          if (item.x1Value === name) {
            this.ignoredBars.splice(index, 1);
            is = false;
          }
        });
      }
      if (is) {
        this.ignoredBars.push({
          x1Codes: ["mb"],
          x1Value: name,
          x2Code: "",
          x2Value: "",
        });
      }

      this.getSingleMap();
    },
    // 恢复初始状态
    async getSingleMap(canvas) {
      const form = {
        canvas: {
          size: this.id.includes(WAFERID[0])
            ? 150
            : this.id.includes(WAFERID[1])
            ? 600
            : this.id.includes(WAFERID[2])
            ? 300
            : "",
          centerLocX: 0.5,
          centerLocY: 0.5,
          magnification: 1,
          pageType: "gallery",
          batchRanges: this.batchRanges,
        },
        filters: {
          adder: "2",
          manualBins: [],
        },
        pareto: {
          chartType: 1,
          x1stCodes: ["mb"],
          x2ndCode: "",
          yCode: "100",
          normBy: "",
          type: "SUM",
          ignoredBars: this.ignoredBars,
        },
        refWaferIds: [`${this.id.split("|")[1]}`],
      };
      if (canvas) {
        // 缩放移动重新获取位置
        form.canvas.centerLocX = canvas.centerLocX || 0.5;
        form.canvas.centerLocY = canvas.centerLocY || 0.5;
        form.canvas.magnification = canvas.magnification || 1;
      }

      if (this.ignoredBars.length === 0) this.$emit("onChangeChart", form); // map联动chart图

      const res = await fetchSingleMap(form);
      const {
        magnification,
        centerLocX,
        centerLocY,
        waferSize,
        originalDieWidth,
        originalDieHeight,
      } = res.data.canvasParam;
      this.onControl(magnification);

      this.current = {
        areaEnable: false,
        moveEnable: false,
        zooms: {
          zoom: magnification,
          cx: centerLocX,
          cy: centerLocY,
          waferSize: waferSize,
          originalDieWidth: originalDieWidth,
          originalDieHeight: originalDieHeight,
        },
      };
      this.mapData = res.data;
      this.$nextTick(() => {
        this.zRenderInit();
      });
    },
    /**初始化 zRender */
    zRenderInit() {
      const dom = document.getElementById(this.id);
      if (!dom) return;
      const zr = zrender.init(dom);
      const group = new zrender.Group();
      const distanceGroup = new zrender.Group();
      const curvatureGroup = new zrender.Group();
      const mapData = this.mapData;
      if (mapData) {
        const { canvasParam, defects } = mapData;
        const { size } = canvasParam;
        RENDER_WAFER_MAP(mapData, { group, dieVisible: true });
        if (!this.id.includes(WAFERID[2])) {
          ZRENDER.renderDefect({ group, defects, size }); // 只画小点,没有操作
        } else {
          this.onAreaInit({
            zr,
            group,
            mapData,
            distanceGroup,
            curvatureGroup,
          });
        }
        group.on("click", async (e) => {
          if (e.target.defects) {
            this.$refs.defectImageRef.onShowModal(e.target.defects);
          }
        });
        const Isogon = new zrender.Isogon({
          shape: { x: size / 2, y: size, r: size === 150 ? 9 : 13, n: 3 },
          style: ZRENDER.STYLE.ISOGON,
        });
        group.add(Isogon);
        zr.add(group);
        zr.add(distanceGroup);
        zr.add(curvatureGroup);
      }
    },

    //选择区域 事件绑定
    onAreaInit({ zr, group, mapData, distanceGroup, curvatureGroup }) {
      const { canvasParam, defects } = mapData;
      const { waferSize, size } = canvasParam;
      let x = 0;
      let y = 0;
      let moveRect = null;
      let moveDrag = null;
      let moveDragStart = null;
      let moveDragEnd = null;
      let mouseWheelTimer = null;
      let mouseWheelLock = false;
      if (!zr || !group) return;
      // 鼠标按下
      zr.on("mousedown", (e) => {
        const { zooms } = this.current;
        const selectActive = this.selectActive;
        x = e.offsetX;
        y = e.offsetY;
        if (["SELECT", "REJECT"].includes(selectActive)) {
          this.current.areaEnable = true; // 开始select开关
        }
        if (selectActive === "MOVE" && zooms.zoom > 1) {
          this.current.moveEnable = true;
          group.remove(moveDragStart);
          moveDragStart = new zrender.Circle({
            shape: { cx: +x, cy: +y, r: 4 },
            style: ZRENDER.STYLE.MOVE.LINE,
          });
          group.add(moveDragStart);
        }

        if (selectActive === "DISTANCE") {
          if (curvatureGroup) curvatureGroup.removeAll();
          const { zooms } = this.current;
          const distance = this.distance;
          const { zoom, cx, cy } = zooms;
          // 转换为0-1比例存储，后续要乘以waferSize
          const rateX = CooToRate(x, cx - 0.5 / zoom, zoom, size);
          const rateY = CooToRate(y, cy - 0.5 / zoom, zoom, size);
          const _distance = {
            points: [...distance.points, { x: rateX, y: rateY }],
            distance: 0,
          };
          this.distance = _distance;
          renderDistance();
        }
        if (selectActive === "CURVATURE") {
          if (distanceGroup) distanceGroup.removeAll();
          const { zooms } = this.current;
          const curvature = this.curvature;
          const { zoom, cx, cy } = zooms;
          // 转换为0-1比例存储，后续要乘以waferSize
          const rateX = CooToRate(x, cx - 0.5 / zoom, zoom, size);
          const rateY = CooToRate(y, cy - 0.5 / zoom, zoom, size);
          const _curvature = {
            points: [...curvature.points, { x: rateX, y: rateY }],
            curvature: 0,
          };
          this.curvature = _curvature;
          renderCurvature();
        }
      });
      // 鼠标移动
      zr.on("mousemove", (e) => {
        // console.log(e, '鼠标移动');
        const { areaEnable, moveEnable } = this.current;
        const selectActive = this.selectActive;
        if (areaEnable && ["SELECT", "REJECT"].includes(selectActive)) {
          group.remove(moveRect);
          moveRect = new zrender.Rect({
            shape: { x: x, y: y, width: e.offsetX - x, height: e.offsetY - y },
            style: ZRENDER.STYLE.MOVE[selectActive],
          });
          group.add(moveRect);
        }

        if (moveEnable) {
          group.remove(moveDrag);
          group.remove(moveDragEnd);
          moveDrag = new zrender.Line({
            shape: { x1: x, y1: y, x2: e.offsetX, y2: e.offsetY },
            style: ZRENDER.STYLE.MOVE.MOVE,
          });
          moveDragEnd = new zrender.Circle({
            shape: { cx: e.offsetX, cy: e.offsetY, r: 4 },
            style: ZRENDER.STYLE.MOVE.POINT,
          });
          group.add(moveDrag);
          group.add(moveDragEnd);
        }
      });
      // 鼠标弹起
      zr.on("mouseup", (e) => {
        const { areaEnable, moveEnable, zooms } = this.current;
        const selectActive = this.selectActive;
        const { zoom } = zooms;
        if (areaEnable && ["SELECT", "REJECT"].includes(selectActive)) {
          group.remove(moveRect); // 绿框删除
          this.current.areaEnable = false;

          const areaRect = new zrender.Rect({
            shape: { x: x, y: y, width: e.offsetX - x, height: e.offsetY - y },
            style: ZRENDER.STYLE.MOVE[selectActive],
          });
          group.add(areaRect);

          // 把手动框选坐标转换成经纬度坐标
          let ulx = CooToRate(x, canvasParam.x0, zoom, size);
          let uly = CooToRate(y, canvasParam.y0, zoom, size);
          let drx = CooToRate(e.offsetX, canvasParam.x0, zoom, size);
          let dry = CooToRate(e.offsetY, canvasParam.y0, zoom, size);
          if (ulx > drx) [ulx, drx] = [drx, ulx];
          if (uly > dry) [uly, dry] = [dry, uly];
          const coo = { ulx, uly, drx, dry };

          if (selectActive === "SELECT") {
            // 遍历所有的点判断是否在框选内
            defects.forEach((item) => {
              if (areaRect.contain(+item.x, +item.y))
                this.selectCoo.push(item.x + "," + item.y);
            });
            // 判断selectCoo是否包含了defect，如果不包含，不记录框选。
            if (this.selectCoo.length > 0) {
              this.selectCoo = _.uniq([...this.selectCoo, coo]); // 把经纬度保存起来 作为接口的查询条件
            }
          } else if (selectActive === "REJECT") {
            defects.forEach((item) => {
              if (areaRect.contain(+item.x, +item.y))
                this.rejectCoo.push(item.x + "," + item.y);
            });
            if (this.rejectCoo.length > 0) {
              this.rejectCoo = _.uniq([...this.rejectCoo, coo]);
            }
          }
          group.remove(areaRect);
          renderDefect();
          this.zRenderInit();
        }

        // 拖拽开启
        if (moveEnable) {
          this.current.moveEnable = false;
          const { zoom, cx, cy } = this.current.zooms;
          if (x === e.offsetX && y === e.offsetY) {
            group.remove(moveDragStart);
            group.remove(moveDrag);
            group.remove(moveDragEnd);
            return;
          }
          // 计算map 中心的偏移量
          const centerLocX = (x - e.offsetX) / (zoom * size) + cx;
          const centerLocY = (y - e.offsetY) / (zoom * size) + cy;
          this.getSingleMap({ centerLocX, centerLocY, magnification: zoom });
        }
      });
      // 鼠标滚动
      zr.on("mousewheel", (e) => {
        // console.log(e.wheelDelta, "鼠标滚动");
        if (e.wheelDelta) {
          const { zooms } = this.current;
          const { zoom } = zooms;
          // 暂时仅开放map的放大
          let magnification = 1;
          if (e.wheelDelta > 0) {
            //当滑轮向上滚动时
            if (zoom >= 8) {
              if (!mouseWheelLock) {
                mouseWheelLock = true;
                setTimeout(() => {
                  mouseWheelLock = false;
                }, 2000);
                this.$message.warning("It can only be magnified to 8 times.");
              }
              return;
            }
            magnification = zoom * 2;
          }
          if (e.wheelDelta < 0) {
            //当滑轮向下滚动时
            if (zoom === 1) return;
            magnification = zoom / 2;
          }
          const x0 = e.offsetX / (zoom * size);
          const y0 = e.offsetY / (zoom * size);
          const x1 = _.get(mapData, "canvasParam.x0", 0);
          const y1 = _.get(mapData, "canvasParam.y0", 0);
          const centerLocX = _.floor(x0 + x1, 6);
          const centerLocY = _.floor(y0 + y1, 6);
          if (mouseWheelTimer) clearTimeout(mouseWheelTimer);
          mouseWheelTimer = setTimeout(() => {
            this.getSingleMap({ magnification, centerLocX, centerLocY });
          }, 100);
        }
      });
      // 画不同的小点
      const renderDefect = async () => {
        await delay(1);
        const { defects } = mapData;
        const existCoo = this.selectCoo.length > 0;
        const ignoreCoo = this.rejectCoo.length > 0;

        defects.forEach(({ x, y }) => {
          let Point = null;
          if (ignoreCoo && this.rejectCoo.includes(`${x},${y}`)) return;
          // 选中的区域点绘制成 星星
          if (existCoo && this.selectCoo.includes(`${x},${y}`)) {
            Point = new zrender.Star({
              shape: { cx: +x, cy: +y, n: 4, r: 5 },
              style: ZRENDER.STYLE.DEFECT,
            });
          } else {
            Point = new zrender.Circle({
              shape: { cx: +x, cy: +y, r: size > 150 ? 2 : 1 },
              style: ZRENDER.STYLE.DEFECT,
            });
          }
          if (Point) group.add(Point);
        });
        // 图片标记的框 画在defect上面，方便点击 开关按键控制渲染
        defects.forEach(({ x, y, imgRefDefectIds }) => {
          if (
            (ignoreCoo && this.rejectCoo.includes(`${x},${y}`)) ||
            !imgRefDefectIds ||
            imgRefDefectIds.length === 0
          )
            return;
          const Rect = new zrender.Rect({
            shape: { x: x - 4, y: y - 4, width: 8, height: 8 },
            style: ZRENDER.STYLE.IMAGE_BOX,
          });
          Rect.attr("defects", imgRefDefectIds);
          group.add(Rect);
        });
      };
      renderDefect();

      // 绘制测算距离
      const renderCenter = async (GROUP) => {
        await delay(1);
        const { zoom, cx, cy } = this.current.zooms;
        const x = Math.floor(((0.5 - cx) * zoom + 0.5) * size);
        const y = Math.floor(((0.5 - cy) * zoom + 0.5) * size);
        const Point = new zrender.Circle({
          shape: { cx: x, cy: y, r: 3 },
          style: ZRENDER.STYLE.MOVE.POINT,
        });
        GROUP.add(Point);
      };

      const renderDistance = async () => {
        await delay(1);
        const { zooms } = this.current;
        const distance = this.distance;
        const { zoom, cx, cy } = zooms;
        const LeftTopRateX = _.floor(cx - 0.5 / zoom, 6);
        const LeftTopRateY = _.floor(cy - 0.5 / zoom, 6);
        if (distanceGroup) distanceGroup.removeAll();
        // 绘制辅助线 计算距离
        const len = distance.points.length;
        if (len === 0) return;
        renderCenter(distanceGroup);

        // 只取最后2个点，参与计算
        for (let i = len - 2; i < len; i++) {
          if (i >= 0) {
            const x = RateToCoo(
              +distance.points[i].x,
              LeftTopRateX,
              zoom,
              size
            );
            const y = RateToCoo(
              +distance.points[i].y,
              LeftTopRateY,
              zoom,
              size
            );
            const Point = new zrender.Circle({
              shape: { cx: x, cy: y, r: 2 },
              style: ZRENDER.STYLE.MOVE.POINT,
            });
            distanceGroup.add(Point);
          }
        }
        if (len >= 2) {
          const point1 = distance.points[len - 2];
          const point2 = distance.points[len - 1];
          const x1 = RateToCoo(+point1.x, LeftTopRateX, zoom, size);
          const y1 = RateToCoo(+point1.y, LeftTopRateY, zoom, size);
          const x2 = RateToCoo(+point2.x, LeftTopRateX, zoom, size);
          const y2 = RateToCoo(+point2.y, LeftTopRateY, zoom, size);
          const centerCoo = RectToCircle(cx, cy, zoom, size);
          const Line = new zrender.Line({
            shape: { x1, y1, x2, y2 },
            style: ZRENDER.STYLE.MOVE.DISTANCE,
          });
          distanceGroup.add(Line);
          const yDiff = y2 - y1;
          const xDiff = x2 - x1;
          let x3 = 0;
          let y3 = 0;
          if (yDiff === 0) {
            x3 = centerCoo.x;
            y3 = y2;
          } else if (xDiff === 0) {
            x3 = x2;
            y3 = centerCoo.y;
          } else {
            const k = yDiff / xDiff;
            x3 = (centerCoo.y - y1 + k * x1 + centerCoo.x / k) / (k + 1 / k);
            y3 = k * (x3 - x1) + y1;
          }
          const Line2 = new zrender.Line({
            shape: { x1: x3, y1: y3, x2: centerCoo.x, y2: centerCoo.y },
            style: ZRENDER.STYLE.MOVE.SUPPORT,
          });
          distanceGroup.add(Line2);
          // 显示文本
          const _distance = calcDistanceWith2Points({
            x1,
            y1,
            x2,
            y2,
            cx: centerCoo.x,
            cy: centerCoo.y,
          });
          let text = ((_distance / (zoom * size)) * waferSize * 2) / 10000;
          text = new Decimal(text).toFixed(4);
          const Text = new zrender.Text({
            style: {
              fontSize: 12,
              text: `Distance: ${text}cm`,
              textBackgroundColor: "#fff",
              textPadding: 2,
            },
          });
          distanceGroup.add(Text);
        }
      };
      const renderCurvature = async () => {
        await delay(1);
        const { zooms } = this.current;
        const curvature = this.curvature;
        const { zoom, cx, cy } = zooms;
        const LeftTopRateX = _.floor(cx - 0.5 / zoom, 6);
        const LeftTopRateY = _.floor(cy - 0.5 / zoom, 6);
        if (curvatureGroup) curvatureGroup.removeAll();
        // 绘制辅助线 计算距离
        const len = curvature.points.length;
        if (len === 0) return;
        renderCenter(curvatureGroup);
        // 只取最后2个点，参与计算
        for (let i = len - 3; i < len; i++) {
          if (i >= 0) {
            const x = RateToCoo(
              +curvature.points[i].x,
              LeftTopRateX,
              zoom,
              size
            );
            const y = RateToCoo(
              +curvature.points[i].y,
              LeftTopRateY,
              zoom,
              size
            );
            const Point = new zrender.Circle({
              shape: { cx: x, cy: y, r: 2 },
              style: ZRENDER.STYLE.MOVE.POINT,
            });
            curvatureGroup.add(Point);
          }
        }
        if (len >= 3) {
          const point1 = curvature.points[len - 3];
          const point2 = curvature.points[len - 2];
          const point3 = curvature.points[len - 1];
          const x1 = RateToCoo(+point1.x, LeftTopRateX, zoom, size);
          const y1 = RateToCoo(+point1.y, LeftTopRateY, zoom, size);
          const x2 = RateToCoo(+point2.x, LeftTopRateX, zoom, size);
          const y2 = RateToCoo(+point2.y, LeftTopRateY, zoom, size);
          const x3 = RateToCoo(+point3.x, LeftTopRateX, zoom, size);
          const y3 = RateToCoo(+point3.y, LeftTopRateY, zoom, size);
          // 绘制连接的曲线
          const { x, y, r } = calcCurvatureWith3Points({
            x1,
            y1,
            x2,
            y2,
            x3,
            y3,
          });
          const Circle = new zrender.Circle({
            shape: { cx: x, cy: y, r },
            style: ZRENDER.STYLE.MOVE.LINE,
          });
          curvatureGroup.add(Circle);
          let waferR = ((r / (size * zoom)) * waferSize) / 10000;
          waferR = new Decimal(waferR).toFixed(4);
          const waferCurvature = new Decimal(1 / waferR).toFixed(4);
          const text = `Radius: ${waferR}cm  Curvature: ${waferCurvature}`;
          const Text = new zrender.Text({
            style: {
              fontSize: 12,
              text,
              textBackgroundColor: "#fff",
              textPadding: 2,
            },
          });
          curvatureGroup.add(Text);
        }
      };
    },
  },
  created() {
    this.$nextTick(() => {
      this.getSingleMap();
    });
  },
};
</script>

<style lang="less" scoped>
.wafer-map {
  display: flex;
  // 圆晶小图
  .small {
    background: #fff;
    border: 2px solid #dddddd;
    position: relative;
    margin: 5px;
  }
  .img-select {
    position: absolute;
    left: -3px;
    top: -5px;
    z-index: 1;
  }
  .img-picture0 {
    position: absolute;
    right: -1px;
    top: -3px;
    width: 22px;
  }
  .img-picture1 {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 28px;
  }
  .img-picture2 {
    display: none;
  }
  .map-detail {
    p {
      font-size: 12px;
      margin: 0;
      min-height: 18px;
    }
  }

  // 操作部分
  .control {
    li {
      cursor: pointer;
    }
    li:hover {
      color: #5a9bf7;
    }
    .active-class {
      color: #5a9bf7;
    }
  }
}

// 圆晶大图遮罩层
.mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9;
  margin: 0 !important;
  background-color: rgba(0, 0, 0, 0.45);

  // 圆晶大图
  .large {
    position: absolute;
    width: 604px;
    height: 604px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
    left: 50%;
    top: 50%;
    background: #fff;
    border: none !important;
    transform: translate(-50%, -50%);
    cursor: pointer;
    z-index: 2;

    .map-icon {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 3;
    }
  }
}
</style>