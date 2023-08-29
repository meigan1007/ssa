<template>
  <div class="imageGallery">
    <a-list :data-source="imageList" :pagination="false">
      <a-list-item
        slot="renderItem"
        slot-scope="item"
        style="display: inline-block"
      >
        <div @click.stop="onImgClick(item)" class="image">
          <img
            :src="getGLOBAL().PATH_ATTACH_BUCKET + item.picPath"
            style="width: 120px; height: 120px"
          />
          <div class="ids">
            <div>Defect ID: {{ item.defectId }}</div>
            <div>Step ID: {{ item.stepId }}</div>
          </div>
          <a-icon
            v-if="selectImgIds.find((subItem) => subItem === item.picId)"
            class="icon"
            type="check"
          />
        </div>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import { getGLOBAL } from "@/utils/web";
export default {
  data() {
    return {
      getGLOBAL,
      defectTypeOption: [],
      // imageList: [],
      params: {
        refWaferId: "",
        manualCodes: [],
      },
      pagination: {
        current: 1,
        pageSize: 10,
        size: "small",
        onChange: (page) => {
          this.pagination.current = page;
        },
      },
      selectImgIds: [],
      // defectImgs: [],
    };
  },
  props: ["imageList"],

  methods: {
    onImgClick(value) {
      if (this.selectImgIds.includes(value.picId)) {
        const index = this.selectImgIds.indexOf(value.picId);
        this.selectImgIds.splice(index, 1);
      } else {
        this.selectImgIds.push(value.picId);
      }
      this.$emit("selectImg", this.selectImgIds);
    },
  },
};
</script>

<style scoped lang="less">
.imageGallery {
  /deep/.ant-list-item {
    margin: 8px;
    .image {
      position: relative;
      .ids {
        position: absolute;
        bottom: 4px;
        left: 4px;
        font-size: 12px;
        color: yellowgreen;
      }
      .icon {
        position: absolute;
        top: 4px;
        right: 4px;
        font-size: 12px;
        color: #fff;
        background-color: #009688;
        border-radius: 50%;
        padding: 4px;
      }
    }
  }
}
</style>