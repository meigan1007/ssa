<template>
  <div>
    <a-modal
      v-model="visible"
      title="Defect Image"
      @cancel="onClose"
      width="800px"
      :footer="null"
      :bodyStyle="{ padding: 0 }"
    >
      <div>
        <img
          v-for="(item, index) in imagesList"
          :key="index"
          style="width: 400px; height: 400px"
          :src="getGLOBAL().PATH_IMAGE_BUCKET + item"
        />
      </div>
    </a-modal>
  </div>
</template>
<script>
import { getGLOBAL } from "@/utils/web";
import { fetchMapImage } from "../service";
export default {
  data() {
    return {
      getGLOBAL,
      visible: false,
      imagesList: [],
    };
  },

  methods: {
    // 打开弹窗
    async onShowModal(refDefectIds) {
      this.visible = true;
      const res = await fetchMapImage(refDefectIds);
      this.imagesList = res;
    },

    // 弹窗关闭
    onClose() {
      this.visible = false;
      this.imagesList = [];
    },
  },
};
</script>
<style lang="less" scoped>
</style>
