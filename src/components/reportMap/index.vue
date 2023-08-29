<template>
  <div class="reportMap">
    <a-row type="flex" style="margin-bottom: 12px">
      <a-col flex="120px" class="label">report模板名称：</a-col>
      <a-col flex="212px" style="line-height: 32px">
        <a-input
          :disabled="type !== 'template'"
          v-model="report.reportTemplateName"
        />
      </a-col>
    </a-row>
    <a-row type="flex">
      <a-col flex="120px" class="label" v-show="type !== 'template'"
        >ppt模板名称：</a-col
      >
      <a-col
        flex="212px"
        style="line-height: 32px"
        v-show="type !== 'template'"
      >
        <a-input disabled v-model="report.pptTemplateName" />
      </a-col>
    </a-row>
    <!-- 页码区域 -->
    <a-row type="flex" style="margin: 12px 0">
      <a-col flex="120px" class="label">页码：</a-col>
      <a-col flex="80px">
        <a-select
          style="width: 106px"
          @change="onChangePage"
          v-model="slideNumber"
        >
          <a-select-option
            v-for="(item, index) in report.slides"
            :value="index"
            :key="index"
          >
            {{ index + 1 }}
          </a-select-option>
        </a-select>
      </a-col>
      <a-col
        flex="98px"
        style="line-height: 32px; margin-left: 8px; text-align: center"
      >
        <a-button
          v-auth="
            'hha:config:reportTemplate:addpage' ||
            'hha:holdLotHandle:yeCase:caseDetail:generateReport:addPage'
          "
          type="primary"
          shape="circle"
          size="small"
          icon="plus"
          @click="onAddPage"
        />
        <a-popconfirm
          v-auth="
            'hha:config:reportTemplate:removepage' ||
            'hha:holdLotHandle:yeCase:caseDetail:generateReport:removePage'
          "
          title="Do you really want to delete this page?"
          ok-text="Yes"
          cancel-text="No"
          @confirm="onDelPage"
        >
          <a-button type="danger" shape="circle" icon="delete" size="small" />
        </a-popconfirm>
      </a-col>
    </a-row>
    <!-- 组件区域 -->
    <a-row type="flex" style="margin-bottom: 12px">
      <a-col flex="120px" class="label">添加组件：</a-col>
      <a-col flex="250px">
        <a-button @click="selectComp('pictureShapes')"> Image 组件 </a-button>
        <a-button @click="selectComp('textShapes')"> Label 组件 </a-button>
        <!-- <a-radio-group
          v-model="componentType"
          button-style="solid"
        >
          <a-radio-button
            v-for="item in compTypes"
            :key="item.value"
            :value="item.value"
            @click="selectComp(item.value)"
          >
            {{ item.label }}
          </a-radio-button>
        </a-radio-group> -->
      </a-col>
    </a-row>
    <div class="report-canvas">
      <div class="chart">
        <div
          :id="reportId"
          class="renderChart"
          :style="{ width: report.width + 'px', height: report.height + 'px' }"
        ></div>
      </div>
      <div flex="280px" class="add-params">
        <a-form-model :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
          <a-form-model-item label="组件类型">
            <span style="margin-left: 11px">{{
              form.type === "pictureShapes"
                ? "Image 组件"
                : form.type === "textShapes"
                ? "Label 组件"
                : ""
            }}</span>
          </a-form-model-item>
          <a-form-model-item label="ID">
            <span style="margin-left: 11px">{{ form.id }}</span>
          </a-form-model-item>
          <a-form-model-item label="名称">
            <a-select
              :open="isSelect"
              v-model="form.id"
              :showArrow="false"
              :options="compNames"
            />
            <a-input
              v-model="form.name"
              ref="nameInputRef"
              :disabled="!form.id && compNames.length == 0"
              style="top: -32px; z-index: 100"
              @focus="
                () => {
                  isSelect = true;
                }
              "
              @blur="
                () => {
                  isSelect = false;
                }
              "
              @change="onChangeName()"
            />
          </a-form-model-item>
          <a-form-model-item label="x">
            <a-input-number
              v-model="form.x"
              :min="0"
              :disabled="!form.id"
              @change="valueChange('x')"
            />
          </a-form-model-item>
          <a-form-model-item label="y">
            <a-input-number
              v-model="form.y"
              :min="0"
              :disabled="!form.id"
              @change="valueChange('y')"
            />
          </a-form-model-item>
          <a-form-model-item label="w">
            <a-input-number
              v-model="form.width"
              :min="0"
              :disabled="!form.id"
              @change="valueChange('width')"
            />
          </a-form-model-item>
          <a-form-model-item label="h">
            <a-input-number
              v-model="form.height"
              :min="0"
              :disabled="!form.id"
              @change="valueChange('height')"
            />
          </a-form-model-item>
          <a-form-model-item label="Value">
            <a-button
              v-if="form.type == 'pictureShapes'"
              :disabled="type == 'template'"
              block
              v-model="form.text"
              @click="onOpenImageModal"
              >请选择图片。。。</a-button
            >
            <a-input
              v-else
              :disabled="!form.id"
              v-model="form.text"
              @change="valueChange"
            />
          </a-form-model-item>
          <!-- <a-form-model-item label="ValueType">
            <a-input-number :min="1" :max="100" />
          </a-form-model-item> -->
          <a-row style="padding-top: 24px; text-align: center">
            <a-space :size="24">
              <a-button type="danger" @click="deleteEle" size="small">
                删除组件
              </a-button>
            </a-space>
          </a-row>
        </a-form-model>
      </div>
    </div>
    <a-modal
      v-model="imageVisible"
      title="Basic Modal"
      :width="1200"
      @ok="onHandleImage"
    >
      <ImageModal :holdLotId="param.holdLotId" :defaultSelectId="defaultSelectId" @onSelectImage="onSelectImage" />
    </a-modal>
  </div>
</template>

<script>
import _ from "lodash";
import * as zrender from "zrender/dist/zrender";
import ImageModal from "./imageModal";
import { YFIELD } from '../../pages/holdLotHandle/holdLot/holdLotDetail/defect/crossModule/constant';
export default {
  data() {
    return {
      reportId: `reportMap_${new Date().getTime()}`,
      report: {},
      form: {
        id: null,
        x: 0,
        y: 0,
        width: 32,
        height: 28,
        text: "",
        collectId: null,
        image: "",
        name: "",
        type: "",
      },
      compTypes: [
        { label: "Image 组件", value: "pictureShapes" },
        { label: "Label 组件", value: "textShapes" },
      ],
      // 名称列表
      compNames: [],
      serialIndex: 0,
      // 类型为pic添加图片，类型为text添加文本
      componentType: "pictureShapes",
      compElem: {
        pictureShapes: {},
        textShapes: {},
      },
      // 0代表第一页，依次累加
      slideNumber: 0,
      imageVisible: false,
      isSelect: false,
      imgInfo: {},
      // 当前选中的元素id，及类型，每次发生切换的时候重置该元素高亮状态
      hoverEle: {
        id: "",
        type: "",
      },
      group1: undefined,
      zRender: undefined,
      defaultSelectId:""
    };
  },
  props: {
    defaultTemplate: {
      type: Object,
      default() {
        return {};
      },
    },
    // 画图的类型是template，还是其他
    type: {
      type: String,
      default() {
        return "";
      },
    },
    param: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  watch: {
    "form.id"(newVal) {
      // 没有id重置form表单
      if (!newVal) return this.resetForm();
      // 将上一个元素取消高亮状态
      if (this.hoverEle.id) {
        const { type, text, width, height, id } = this.hoverEle;
        this.compElem[type][id].attr({
          textContent: this.textContent(
            type,
            text,
            width,
            height,
            "#C4C4C4",
            1
          ),
          zlevel: 1,
        });
        // this.compElem[type][id].attr('z', 0);
      }
      // 如果index 返回值 不为-1 表示在已存在的画图元素中，则修改相关属性，修改列表
      // 若index 返回值为 -1  表示不在，则添加元素，添加列表
      const index = this.compNames.findIndex((item) => {
        return item.value == newVal;
      });
      if (index === -1) {
        this.compNames.push({
          label:
            this.form.type == "pictureShapes"
              ? `img_${newVal}`
              : `lbl_${newVal}`,
          value: newVal,
          type: this.form.type,
        });
        // 渲染元素并添加到组中
        this.onAddElement(this.form);
        // 将当前元素高亮
        const { id, type, text, width, height } = this.form;

        this.compElem[type][id].attr({
          textContent: this.textContent(
            type,
            text,
            width,
            height,
            "#0056ff",
            2
          ),
          zlevel: 10,
        });

        // this.compElem[type][id].attr('z', 10);
        // 当前选中实现高亮状态
        this.hoverEle = JSON.parse(JSON.stringify(this.form));
        // 将元素数据添加到report中
        this.report.slides[this.slideNumber][type].push(_.clone(this.form));
      } else {
        const type = this.compNames[index].type;
        // 如果存在需要判断是图片类型还是文本类型
        // 给form重新赋值
        this.report.slides[this.slideNumber][type].forEach((item) => {
          if (item.id == newVal) {
            const { id, text, width, height } = item;
            this.form = { ...item, type };
            this.compElem[type][id].attr({
              textContent: this.textContent(
                type,
                text,
                width,
                height,
                "#0056ff"
              ),
              zlevel: 10,
            });
            this.hoverEle = JSON.parse(JSON.stringify(this.form));
          }
        });
      }
    },
    param: {
      handler(newVal) {
        if (newVal) this.report = JSON.parse(JSON.stringify(newVal));
        this.slideNumber = 0;
        this.compElem = {
          pictureShapes: {},
          textShapes: {},
        };
        this.hoverEle = {
          id: "",
          type: "",
        };
        this.form = {
          id: null,
          x: 0,
          y: 0,
          width: 32,
          height: 28,
          text: "",
          name: "",
          type: "",
        };
        if (this.zRender) {
          this.zRender.dispose();
        }
        this.initZrender();
        if (this.report.slides?.length == 0) {
          this.report.slides = [{ pictureShapes: [], textShapes: [] }];
          this.renderChart();
        } else {
          this.renderChart();
        }
      },
      deep: true,
    },
  },
  components: {
    ImageModal,
  },
  mounted() {
    if (this.param.caseId) return;
    this.report = JSON.parse(JSON.stringify(this.param));
    this.slideNumber = 0;
    this.compElem = {
      pictureShapes: {},
      textShapes: {},
    };
    this.form = {
      id: null,
      x: 0,
      y: 0,
      width: 32,
      height: 28,
      text: "",
      name: "",
      type: "",
    };
    this.$nextTick(() => {
      this.initZrender();
      if (this.report.slides?.length == 0) {
        this.report.slides = [{ pictureShapes: [], textShapes: [] }];
        this.renderChart();
      } else {
        this.renderChart();
      }
    });
  },
  methods: {
    // 初始化
    initZrender() {
      this.zRender = zrender.init(document.getElementById(this.reportId), {
        renderer: "svg", //渲染方式 支持'canvas','svg','vml'
      });
      this.group1 = new zrender.Group();
      this.zRender.add(this.group1);
    },
    // 重置form数据
    resetForm() {
      this.form = {
        id: null,
        x: 0,
        y: 0,
        width: 32,
        height: 28,
        text: "",
        name: "",
        type: "",
      };
    },
    // 渲染元素
    renderChart() {
      if (this.report.slides.length == 0) {
        this.compNames = [];
      } else {
        const pictureShapes = this.compNameMap("pictureShapes");
        const textShapes = this.compNameMap("textShapes");
        // 收集当前页图片或者文本所有名称集合
        this.compNames = [...pictureShapes, ...textShapes];
        this.compNames.sort((a, b) => a.value - b.value);
        // 定义一个当前选中的元素
        // this.form.id =  this.report.slides[this.slideNumber].pictureShapes[0]['id']
        // this.compNames
        this.renderElement("pictureShapes");
        this.renderElement("textShapes");
      }
      this.serialIndex =
        this.compNames.length > 0
          ? this.compNames[this.compNames.length - 1]["value"] * 1
          : 0;
    },
    // type:'pictureShapes','textShapes' 两种不同类型组件
    compNameMap(type) {
      let res = [];
      if (
        this.report.slides &&
        this.report.slides[this.slideNumber] &&
        this.report.slides[this.slideNumber][type].length > 0
      ) {
        res = this.report.slides[this.slideNumber][type].map((item) => {
          return {
            label: item.name,
            value: item.id,
            type,
          };
        });
      }
      return res;
    },
    // 遍历渲染元素
    renderElement(type) {
      if (
        this.report.slides &&
        this.report.slides[this.slideNumber] &&
        this.report.slides[this.slideNumber][type].length > 0
      ) {
        this.report.slides[this.slideNumber][type].forEach((item) => {
          this.onAddElement({ ...item, type });
        });
      }
    },
    // 选择组件类型
    selectComp(value) {
      const id = this.getSerialNumber();
      this.form = {
        id,
        x: 0,
        y: 0,
        width: 32,
        height: value == "pictureShapes" ? 28 : 20,
        url: "",
        type: value,
        name: value == "pictureShapes" ? `img_${id}` : `lbl_${id}`,
      };
    },
    // 获取流水号码
    getSerialNumber() {
      this.serialIndex = this.serialIndex + 1;
      const length = (this.serialIndex + "").length;
      let arr = [];
      arr.length = 4 - length;
      arr.fill(0);
      return arr.join("") + this.serialIndex;
    },
    // x,y,w,h发生变化
    valueChange(type) {
      if(type == 'x'){
        if(this.form[type] > this.report.width - this.form.width){
          this.form[type] = this.report.width - this.form.width
        }
      }
      if(type == 'width'){
        if(this.form[type] > this.report.width - this.form['x']){
          this.form[type] = this.report.width - this.form['x']
        }
      }
      if(type == 'height'){
        if(this.form[type] > this.report.height - this.form['y']){
          this.form[type] = this.report.height - this.form['y']
        }
      }
      if(type == 'y'){
        if(this.form[type] > this.report.height - this.form['height']){
          this.form[type] = this.report.height - this.form['height']
        }
      }
      this.editElemAttr();
    },
    // image文本样式
    textContent(
      type,
      text,
      width,
      height,
      borderColor = "#C4C4C4",
      borderWidth = 1
    ) {
      const res =
        type == "pictureShapes"
          ? new zrender.Text({
              style: {
                text: "图片",
                fill: "#C4C4C4",
                font: "12px Microsoft Yahei",
                borderColor,
                borderWidth,
                width: width,
                height: height,
              },
              zlevel: 1,
            })
          : new zrender.Text({
              style: {
                text,
                borderColor,
                borderWidth: 1,
                width,
                height,
                font: "12px Microsoft Yahei",
              },
              zlevel: 1,
            });
      return res;
    },
    // 不同类型元素触发不同方法
    editElemAttr() {
      const { x, y, width, height, id, type, text, image } = this.form;
      this.hoverEle = { id, type, text, width, height };
      if (type == "pictureShapes") {
        // 修改图片相关属性
        this.compElem[type][id].attr({
          style: { image, x, y, width, height },
          textContent: this.textContent(type, text, width, height, "#0056ff"),
          zlevel: 10,
        });
      } else {
        // 修改label属性
        this.compElem[type][id].attr({
          shape: { x, y, width, height },
          textContent: this.textContent(type, text, width, height, "#0056ff"),
          zlevel: 10,
        });
      }
      // 修改report中的数据
      this.report.slides[this.slideNumber][type] = this.report.slides[
        this.slideNumber
      ][type].map((item) => {
        if (item.id == id) {
          return { ...this.form };
        } else {
          return item;
        }
      });
    },
    // 打开图片弹框
    onOpenImageModal() {
      this.imageVisible = true;
      this.defaultSelectId = this.form.collectId
    },
    onSelectImage(imgInfo) {
      this.imgInfo = imgInfo;
    },
    onHandleImage() {
      this.form.collectId = this.imgInfo.imgId;
      this.form.image = this.imgInfo.url;
      this.imageVisible = false;
      this.editElemAttr();
    },
    // 删除元素
    deleteEle() {
      const { id, type } = this.form;
      this.group1.remove(this.compElem[type][id]);
      this.compNames = this.compNames.filter((item) => item.value !== id);
      this.report.slides[this.slideNumber][type] = this.report.slides[
        this.slideNumber
      ][type].filter((item) => item.id !== id);
      if (this.compNames.length === 0) {
        this.form.id = "";
      } else {
        this.form.id = this.compNames[0].value;
      }
    },
    // 添加元素
    onAddElement(form) {
      // 图片类型渲染图片，文本类型渲染文本
      const { type } = form;
      if (type == "pictureShapes") {
        this.addImageEle(form);
      } else {
        this.addLabelEle(form);
      }
    },
    // 添加文本元素
    addLabelEle(form) {
      const { type, id, width, height, x, y, text } = form;
      this.compElem[type][id] = new zrender.Rect({
        // draggable: true,
        style: {
          fill: null,
        },
        zlevel: 1,
        textContent: this.textContent(type, text, width, height, "#C4C4C4"),
        textConfig: {
          position: "inside",
        },
        shape: {
          x,
          y,
          width,
          height,
        },
      });
      this.group1.add(this.compElem[type][id]);
    },
    // 添加图片元素
    addImageEle(form) {
      const { type, id, width, height, x, y, text, image } = form;
      this.compElem[type][id] = new zrender.Image({
        // draggable: true,
        style: {
          image,
          x,
          y,
          width,
          height,
          // objectFit: "fill"
        },
        zlevel: 1,
        textContent: this.textContent(type, text, width, height, "#C4C4C4"),
        textConfig: {
          position: "inside",
          stroke: "#333",
        },
      });
      this.group1.add(this.compElem[type][id]);
    },
    // 添加页码
    onAddPage() {
      this.report.slides.splice(this.slideNumber + 1, 0, {
        pictureShapes: [],
        textShapes: [],
      });
      this.slideNumber = this.slideNumber + 1;
      this.resetZrender();
    },
    // 删除当前页码
    onDelPage() {
      if (this.report.slides.length <= 1)
        return this.$message.error("当前模板只有一页，不可删除了！");
      this.report.slides.splice(this.slideNumber, 1);
      const length = this.report.slides.length;
      if (length - 1 < this.slideNumber) {
        this.slideNumber = length - 1;
      }
      this.resetZrender();
    },
    // 切换页码
    onChangePage(value) {
      this.slideNumber = value;
      this.resetZrender();
    },
    // input框修改名称
    onChangeName() {
      let type = "";
      this.compNames = this.compNames.map((item) => {
        if (item.value == this.form.id) {
          type = item.type;
          return {
            value: item.value,
            label: this.form.name,
            type: item.type,
          };
        } else {
          return item;
        }
      });
      if (this.report.slides[this.slideNumber][type]) {
        this.report.slides[this.slideNumber][type].forEach((item) => {
          if (item.id == this.form.id) {
            item.name = this.form.name;
          }
        });
      }
    },
    // 重置zrender
    resetZrender() {
      this.compElem = {
        pictureShapes: {},
        textShapes: {},
      };
      this.hoverEle = {
        id: "",
        type: "",
      };
      // this.group1.removeAll();
      if (this.zRender.dom.childNodes.length > 0) {
        this.zRender.dispose();
        this.initZrender();
      }
      this.form = {
        id: null,
        x: 0,
        y: 0,
        width: 32,
        height: 28,
        text: "",
        name: "",
        type: "",
      };
      this.renderChart();
    },
  },
};
</script>

<style lang="less" scoped>
.reportMap {
  /deep/ .ant-btn-text {
    border: none;
  }
  .add-params {
    border-top: 1px solid #c4c4c4;
    /deep/ .ant-form-item {
      margin-bottom: 0;
      .ant-form-item-label {
        line-height: 32px;
        height: 34px;
        border-right: 1px solid #c4c4c4;
        border-bottom: 1px solid #c4c4c4;
      }
      .ant-form-item-control-wrapper {
        line-height: 32px;
        height: 34px;
        border-right: 1px solid #c4c4c4;
        border-bottom: 1px solid #c4c4c4;
        .ant-form-item-control {
          line-height: 32px;
        }
        .ant-input-number {
          width: 100%;
          height: 32px;
          border: none;
          border-radius: 0;
          .ant-input-number-input {
            height: 32px;
          }
        }
        .ant-select-selection {
          border-radius: 0;
          border: none;
          height: 31px;
        }
        .ant-input {
          width: 100%;
          border: none;
          border-radius: 0;
        }
        .ant-btn-block {
          border: none;
        }
      }
    }
  }
  .label {
    text-align: right;
    line-height: 32px;
  }
  .report-canvas {
    display: flex;
    .chart {
      max-width: calc(100% - 280px);
      overflow: auto;
      max-height: 546px;
      display: inline-block;
      border: 1px solid #c4c4c4;
    }
    .add-params {
      display: inline-block;
      width: 280px;
    }
  }
}
</style>
