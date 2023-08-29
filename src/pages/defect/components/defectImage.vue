<template>
  <div style="position:relative">
    <div class="imgList" ref="imgList">
    <div class="img-item" v-for="item in new Array(50)" :key="item" :style="{width:100/imageConfig.column + '%'}">
      <div class="img-top" :style="{'fontSize':imageConfig.labelSize + 'px'}">
        MB:{{  }}<br>
        ADC:{{  }}
      </div>
      <div class="img-bottom" :style="{'fontSize':imageConfig.labelSize + 'px'}">
        Lot ID:{{  }}<br>
        Wafer ID:{{  }}<br>
        Defect ID:{{  }}<br>
        Step:{{  }}<br>
        Product ID:{{  }}
      </div>
      <img
        src="~@/assets/image/defect.png"
        style="width:100%;bordr:1px solid #f0f0f0"
        @click="onClickMap(item)"
      />
    </div>

    <chart-drawer ref="chartDrawerRef"></chart-drawer>
    <!-- 大图展示 -->
    <a-modal :width="700" :footer="null" v-model="bigMapVisible" title="Big Map" @cancel="bigMapVisible = false">
      <a-row>
      <a-col :span="16">
      <img src="~@/assets/image/defect.png" alt="" style="width:400px;height:400px">
      </a-col>
      <a-col :span="8">
      <a-space direction="vertical">
        <span>image 属性:</span>
          <span>Lot ID: MicroScratch</span>
          <span>Wafer ID: 3</span>
          <span>Step ID: AAA10</span>
          <span>Product ID: AAA10</span>
          <span>Group ID: AAA模型训练</span>
          <span>Module Name: 模型P1S1</span>
          <span>Data Processing: PIRUN</span>
          <span class="particle">particle:7 </span>
          <span class="qipao">气泡:1 </span>
          <span class="huashang">划伤:1 </span>
      </a-space>
      </a-col>
      </a-row>
    </a-modal>
  </div>
  </div>

</template>

<script>
import Konva from "konva";
import { renderKonvaMap } from "@/utils/web";
import { fetchMapTypeDB } from "./service";
import ChartDrawer from './chartDrawer.vue'
import { EventBus } from './eventbus'
// let count = 0;
export default {
  data() {
    return {
      // 图片列表
      imgList: [],
      mapDbParams: {
        mapTypeCode: "all",
        pageNo: 1,
        pageSize: 100,
        sampleType: "allMap",
      },
      bigMapVisible:false,
      imageConfig:{
          fontSize:14,
          column:4
      },
    };
  },
  components:{
    ChartDrawer
  },
  mounted() {
    console.log(this.$EventBus);
    EventBus.$on('filterForm',(msg) => {
        console.log(msg);
        this.imageConfig = msg
    })
  },
  methods: {
    // 获取mapDb列表数据
    async getMapList() {
      const res = await fetchMapTypeDB(this.mapDbParams);
      this.imgList = res.list;
      this.imgList.forEach((item) => {
        this.$nextTick(() => {
          this.renderMap(item);
        });
      });
    },
    renderMap(item) {
      const { imageId, imagePath, markInfos, markArcInfos } = item;
      const konvaStage = new Konva.Stage({
        container: "konva_container_" + imageId,
        width: 100,
        height: 100,
      });
      renderKonvaMap(
        { imagePath, markInfos, markArcInfos },
        (bgLayer, layer) => {
          konvaStage.add(bgLayer);
          konvaStage.add(layer);
        }
      );
    },
    // 单机map图 展示大图
    onClickMap() {
      this.bigMapVisible = true;
    },
  },
};
</script>

<style lang="less" scoped>
.imgList {
  height: calc(100vh - 450px);
  border: 1px solid #c4c4c4;
  margin-top: 4px;
  padding: 4px;
  overflow: auto;
  position: relative;
  .img-item {
    position: relative;
    float: left;
    padding:5px;
    .img-top{
      position: absolute;
      top: 4px;
      left: 8px;
      color: rgb(0, 255, 0)
    };
    .img-bottom{
      position: absolute;
      bottom: 4px;
      left: 8px;
      color: rgb(0, 255, 0);
    }
    .color-block-item {
      position: absolute;
      right: 2px;
      top: -6px;
      .green-block {
        width: 8px;
        height: 8px;
        display: inline-block;
        background-color: rgb(0, 255, 0);
      }
      .blue-block {
        width: 8px;
        height: 8px;
        display: inline-block;
        background-color: rgb(0, 0, 255);
      }
    }
    &:hover > .map-detail {
      display: block;
    }
  }
}
.detail-button {
    position: absolute;
    right: 12px;
    top: 12px;
    z-index: 100;
  }

.particle::before{
  content: '';
  display: inline-block;
  width:14px;
  height: 14px;
  margin-right: 4px;
  background-color: #c1d2ab; 
}
.qipao::before{
  content: '';
  display: inline-block;
  width:14px;
  height: 14px;
  margin-right: 4px;
  background-color: #feff54; 
}
.huashang::before{
  content: '';
  display: inline-block;
  width:14px;
  height: 14px;
  margin-right: 4px;
  background-color: #e89f42; 
}
</style>
