<template>
  <div v-show="left || right || top || bottom">
    <a-button
      style="z-index: 9"
      type="primary"
      ghost
      :style="collectStyle"
      @click="onShowModal"
    >
      <a-icon type="plus" /> 收藏
    </a-button>
    <a-modal
      v-model="visible"
      title="Collect"
      @cancel="onClose"
      width="800px"
      :bodyStyle="{
        maxHeight: '480px',
        padding: '20px 0px 5px 0px',
        overflow: 'auto',
      }"
    >
      <a-form-model
        ref="ruleForm"
        :model="collectParams"
        :rules="rules"
        :labelCol="{ span: 6 }"
        :wrapperCol="{ span: 16 }"
      >
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="收藏类型">
              <a-input disabled v-model="collectParams.collectType" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="标题" prop="collectName">
              <a-input
                allowClear
                placeholder="please input title"
                v-model="collectParams.collectName"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <a-divider orientation="center"> 图片预览区 </a-divider>
      <div class="image">
        <img
          crossorigin="anonymous"
          :id="id"
          :style="
            'width:' +
            (imgWidth > 800 ? 800 : imgWidth) +
            'px; padding: 0 20px;'
          "
        />
      </div>
      <template slot="footer">
        <a-button type="primary" @click="onSave">Save</a-button>
        <a-button @click="onClose">Cancel</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import moment from "moment";
import html2canvas from "html2canvas";
import { uploadCollect, addCollect } from "./service";
export default {
  props: [
    "left",
    "right",
    "top",
    "bottom",
    "container",
    "moduleData",
    "businessType",
  ],
  data() {
    return {
      collectStyle: "",
      visible: false,
      id: new Date().getTime(),
      imgWidth: null,
      // 收藏参数
      collectParams: {
        collectName:
          this.businessType + "/" + moment().format("YYYY-MM-DD HH:mm:ss"),
        collectType: "IMG", // 收藏类型
        businessType: this.businessType, // 来源
        dataId: "", // 文件id
        holdLotId: this.moduleData.refLotKey,
      },
      rules: {
        collectName: [
          {
            required: true,
            message: "Please input Activity name",
            trigger: "blur",
          },
        ],
      },
    };
  },

  mounted() {
    this.onPosition();
  },

  methods: {
    onPosition() {
      const left = this.left ? `left: ${this.left};` : "";
      const right = this.right ? `right: ${this.right};` : "";
      const top = this.top ? `top: ${this.top};` : "";
      const bottom = this.bottom ? `bottom: ${this.bottom};` : "";
      this.collectStyle = `position:absolute;${left}${right}${top}${bottom}`;
    },

    // 生成快照
    convertToImage(container, options = {}) {
      // // 设置放大倍数
      const scale = window.devicePixelRatio;
      // // 传入节点原始宽高
      this.imgWidth = container.offsetWidth;
      const _width = container.offsetWidth;
      const _height = container.offsetHeight;

      let { width, height } = options;
      width = width || _width;
      height = height || _height;

      // // html2canvas配置项
      const ops = {
        scale,
        width,
        height,
        useCORS: true,
        allowTaint: false,
        ...options,
      };

      html2canvas(container, ops).then((canvas) => {
        // 返回图片的二进制数据
        var img = document.getElementById(this.id);
        img.src = canvas.toDataURL("image/png"); //转换图片为dataURL
        canvas.toBlob((blobObj) => {
          this.blobObj = blobObj;
        });
      });
    },

    onShowModal() {
      this.visible = true;
      const element = document.querySelectorAll(`${this.container}`);
      element.forEach((item, index) => {
        if (item.offsetHeight > 0) {
          this.convertToImage(element[index]);
        }
      });
    },

    onClose() {
      this.visible = false;
      var img = document.getElementById(this.id);
      img.src = "";
    },

    onSave() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.apiCollect();
        }
      });
    },
    async apiCollect() {
      const formData = new FormData();
      var newBlob = new File([this.blobObj], "png", { type: "Blob" });
      formData.append("bizId", this.moduleData.refLotKey);
      formData.append("bizType", "YE_COLLECT");
      formData.append("file", newBlob);
      const upRes = await uploadCollect(formData);
      this.collectParams.dataId = upRes.attachmentId;
      const addRes = await addCollect(this.collectParams);
      if (addRes) {
        this.visible = false;
        this.$message.success("收藏成功!");
      }
    },
  },
};
</script>
<style lang="less" scoped>
.image {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>