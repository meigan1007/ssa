<template>
  <div class="map-DB">
    <!-- 顶部按钮区域 -->
    <a-space :size="4">
      <a-button
        size="small"
        type="primary"
        shape="circle"
        icon="search"
        @click="onSearch"
      />
      <a-upload v-bind="uploadConfig" @change="onChangeFile">
        <a-button size="small" type="primary" shape="circle" icon="upload" />
      </a-upload>
      <div class="sample">
        <a-button-group>
          <a-button size="small" type="success" @click="onOpenAddModal">
            Add To Sample
          </a-button>
          <a-button size="small" type="success" @click="onAddToMapType"
            >Add To Map</a-button
          >
          <a-button
            size="small"
            @click="toJumpMarkMap"
            type="primary"
            v-auth="'ssa:markMap:view'"
            >Mark Map</a-button
          >
        </a-button-group>
      </div>
      <div class="sample">
      <a-button-group>
        <a-button size="small" type="success" @click="onSelectAll">Select All</a-button>
        <a-button size="small" type="info" @click="onReset">Reset</a-button>
        <a-button size="small" type="info" @click="onReload">Reload</a-button>
      </a-button-group>
      </div>
      <div class="sample">
        <a-button-group>
          <a-button size="small" type="danger" @click="onOpenRemoveModal">
            Remove
          </a-button>
          <a-button size="small" type="danger" @click="onDeleteMap">Delete</a-button>
        </a-button-group>
      </div>
    </a-space>
    <div :span="8" class="color-block" style="float: right">
      <span class="green-block"></span>
      Classify Sample
      <span class="blue-block"></span>
      Identify Sample
    </div>
    <!-- 列表区域 -->
    <div class="imgList" ref="imgList">
      <div
        class="img-item"
        v-for="item in imgList"
        :key="item.imageId"
        @click="onClickMap(item)"
        :class="checkedIds.includes(item.imageId) ? 'selected' : ''"
      >
        <div
          :id="'konva_container_' + item.imageId"
          :class="item.saveType === 'ALL' && isShowMark ? 'allMark' : ''"
          ref="konvaContainer"
          style="border: 1px solid #f0f0f0; border-radius: 50%"
        ></div>
        <!-- <img width="100" height="100" alt="map" :src="item.src" /> -->
        <!-- 右上角展示样本色块绿色/蓝色 -->
        <div class="color-block-item">
          <span class="green-block" v-if="item.classifiySampleType === 'Y'"></span>
          <span class="blue-block" v-if="item.identifySampleType === 'Y'"></span>
        </div>
      </div>
    </div>
    <!-- 分页组件 -->
    <a-pagination
      v-show="imgList.length > 0"
      class="ssa-pagination"
      v-bind="pagination"
      @change="onPageNoChange"
      @showSizeChange="onPageSizeChange"
    />

    <!-- 移除samples -->
    <remove-samples-modal
      :visible="removeSampleVisible"
      :mapTypeOption="mapTypeOption"
      :mapTypeCode="mapDbParams.mapTypeCode"
      @HandleOk="onRemoveHandleOk"
      @Cancel="onRemoveCancel"
    ></remove-samples-modal>

    <!-- 新增samples -->
    <add-samples-modal
      :visible="addSampleVisible"
      :mapTypeOption="mapTypeOption"
      :mapTypeCode="mapDbParams.mapTypeCode"
      @HandleOk="onAddHandleOk"
      @Cancel="onAddCancel"
    ></add-samples-modal>
    <!-- 查询 -->
    <search-map-modal
      :visible="searchVisible"
      :defaultForm="mapDbParams"
      :isShowMark="isShowMark"
      :mapTypeOption="mapTypeOption"
      @SubmitForm="searchSubmit"
      @Cancel="searchCancel"
    ></search-map-modal>
    <!-- 大图展示 -->
    <big-map-modal
      :visible="bigMapVisible"
      :isShowMark="isShowMark"
      :mapInfo="chooseMapInfo"
      @Cancel="bigMapCancel"
    >
    </big-map-modal>
    <!-- add to map -->
    <add-to-map-type-modal
      :visible="addToMapVisible"
      :mapTypeCode="mapDbParams.mapTypeCode"
      :toMapTypeOption="changeMapTypeOption"
      :mapTypeOption="mapTypeOption"
      @HandleOk="onAddToMapHandle"
      @Cancel="onAddToMapCancel"
    >
    </add-to-map-type-modal>
  </div>
</template>

<script>
import Konva from "konva";
import Cookies from "js-cookie";
import { getURL } from "@/utils/request";
import { renderKonvaMap } from "@/utils/web";
import {
  fetchMapTypeDB,
  fetchMapTypes,
  addSampleType,
  removeSampleType,
  deleteMap,
  addMarkMapType,
} from "./service";
import RemoveSamplesModal from "./components/removeSamplesModal.vue";
import AddSamplesModal from "./components/addSamplesModal.vue";
import SearchMapModal from "./components/searchMapModal.vue";
import BigMapModal from "./components/bigMapModal.vue";
import AddToMapTypeModal from "./components/addToMapType.vue";
let count = 0;
export default {
  name: "mapDb",
  components: {
    RemoveSamplesModal,
    AddSamplesModal,
    SearchMapModal,
    BigMapModal,
    AddToMapTypeModal,
  },
  data() {
    return {
      mapType: null,
      sample: null,
      isShowMark: true, // 是否显示mark
      mapTypeOption: [], // mapType  select 选择框 下拉列表
      // 上传配置
      uploadConfig: {
        showUploadList: false,
        multiple: true,
        action: `${getURL("SSA")}/map_type_db/upload`,
        headers: {
          token: Cookies.get("AI_YEI_TOKEN"),
        },
      },
      // 图片列表
      imgList: [],
      // 分页参数
      pagination: {
        total: 0,
        current: 1,
        pageSize: 100,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `Total ${total} items`,
        pageSizeOptions: ["100", "200", "500", "1000"],
      },
      // 当前选中的mapid数组
      checkedIds: [],
      checkedList: [],
      mapDbParams: {
        mapTypeCode: "unclassify",
        pageNo: 1,
        pageSize: 100,
        sampleType: "allMap",
      },
      changeMapTypeOption: [],
      // 搜索弹框区域
      confirmLoading: false,
      searchVisible: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },

      // sample 弹框区域
      removeSampleVisible: false,
      addSampleVisible: false,

      // 大图弹框参数
      chooseMapInfo: {},
      bigMapVisible: false,

      // add to maptype 弹框区域
      addToMapVisible: false,
    };
  },
  mounted() {
    this.getMapList();
    this.getMapTypes();
  },
  methods: {
    onChangeFile(info, fileList, event) {
      if (info.file.status === "done") {
        if (info.file.response.code === 20000) {
          this.getMapList();
        } else {
          this.$message.error(info.file.response.message[0]);
        }
      } else if (info.file.status === "error") {
        this.$message.error(info.file.response.message[0]);
      }
    },
    // 重置勾选状态
    onReset() {
      this.checkedIds = [];
      this.checkedList = [];
    },
    // 全选当前页
    onSelectAll() {
      this.checkedIds = this.imgList.map(item => item.imageId)
      this.checkedList = this.imgList.map(item => {
        return {
            imageId: item.imageId,
            isMark:
              item.markInfos.length > 0 ||
              item.markArcInfos.length > 0 ||
              item.saveType === "ALL",
        }
      })
    },
    // 挑转至markmap页面
    toJumpMarkMap() {
      // 跳转至mark只能选中一条数据
      if (this.checkedIds.length !== 1) {
        return this.$message.info("Please choose a map");
      } else {
        this.$store.commit("account/onAddTab", {
          key: "/markMap",
          param: {
            mapId: this.checkedIds[0],
            mapIdList: this.imgList.map((item) => item.imageId),
            mapTypeCode:
              this.mapDbParams.mapTypeCode === "unclassify" ||
              this.mapDbParams.mapTypeCode === "all"
                ? ""
                : this.mapDbParams.mapTypeCode,
          },
        });
      }
    },
    // 单机或者双击map图
    onClickMap(item) {
      const { imageId, markInfos, saveType, markArcInfos } = item;
      count += 1;
      setTimeout(() => {
        if (count === 1) {
          if (this.checkedIds.includes(imageId)) {
            this.checkedIds = this.checkedIds.filter((item) => item !== imageId);
            this.checkedList = this.checkedList.filter(
              (item) => item.imageId !== imageId
            );
          } else {
            this.checkedIds.push(imageId);
            this.checkedList.push({
              imageId,
              isMark:
                markInfos.length > 0 || saveType === "ALL" || markArcInfos.length > 0,
            });
          }
        } else if (count === 2) {
          // 双击 打开弹框展示大图
          this.chooseMapInfo = item;
          this.bigMapVisible = true;
        }
        count = 0;
      }, 300);
    },
    // 关闭大图弹框
    bigMapCancel() {
      this.bigMapVisible = false;
    },
    // 获取mapType列表
    async getMapTypes() {
      const res = await fetchMapTypes("MAPDB");
      const option = res.map((item) => {
        return {
          label: item.mapTypeName,
          value: item.mapTypeCode,
        };
      });
      this.changeMapTypeOption = option;
      this.mapTypeOption = [
        ...option,
        {
          label: "Unclassify",
          value: "unclassify",
        },
        {
          label: "All Mark",
          value: "all",
        },
      ];
      this.mapDbParams.mapTypeCode = "unclassify";
    },
    // 获取mapDb列表数据
    async getMapList() {
      const res = await fetchMapTypeDB(this.mapDbParams);
      this.onReset();
      this.imgList = res.list;
      this.pagination.total = res.totalCount;
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
      renderKonvaMap({ imagePath, markInfos, markArcInfos }, (bgLayer, layer) => {
        konvaStage.add(bgLayer);
        if (this.isShowMark) {
          konvaStage.add(layer);
        }
      });
    },
    onDeleteMap() {
      if (this.checkedIds.length === 0)
        return this.$message.info("Please choose the map first!");
      this.$confirm({
        content: "Are you sure to delete?",
        okText: "Yes",
        okType: "primary",
        cancelText: "No",
        onOk: async () => {
          // 发送删除请求
          await deleteMap(this.checkedIds);
          this.getMapList();
        },
      });
    },
    // 分页页码/每页条数发生切换触发
    onPageNoChange(current, pageSize) {
      this.pagination.current = current;
      this.pagination.pageSize = pageSize;
      this.mapDbParams.pageNo = current;
      this.mapDbParams.pageSize = pageSize;
      this.getMapList();
    },
    // pageSize发生切换页码需要重置为1
    onPageSizeChange(current, pageSize) {
      this.pagination.current = 1;
      this.pagination.pageSize = pageSize;
      this.mapDbParams.pageNo = 1;
      this.mapDbParams.pageSize = pageSize;
      this.getMapList();
    },
    // 清除选中标记，重新加载
    onReload() {
      this.checkedIds = [];
      this.checkedList = [];
      this.getMapList();
    },
    // 打开搜索弹框
    onSearch() {
      this.searchVisible = true;
    },
    // 提交search from
    searchSubmit(formValue) {
      const { mapTypeCode, sampleType, isShowMark } = formValue;
      this.mapDbParams.mapTypeCode = mapTypeCode;
      this.mapDbParams.sampleType = sampleType;
      this.mapDbParams.pageNo = 1;
      this.pagination.current = 1;
      this.isShowMark = isShowMark;
      this.getMapList();
      this.searchVisible = false;
    },
    // 关闭搜索弹框
    searchCancel() {
      this.searchVisible = false;
    },
    // sample弹框操作区域
    // 打开remove 弹框
    onOpenRemoveModal() {
      if (this.checkedIds.length === 0) {
        return this.$message.info(" please choose the map first ");
      }
      this.removeSampleVisible = true;
    },
    async onRemoveHandleOk(value) {
      await removeSampleType(value, {
        imageIds: this.checkedIds,
        mapTypeCode: this.mapDbParams.mapTypeCode,
      });
      this.$message.info("remove successful");
      this.removeSampleVisible = false;
      this.onReload();
    },
    onRemoveCancel() {
      this.removeSampleVisible = false;
    },
    ///
    // add to simple 区域
    onOpenAddModal() {
      if (this.checkedIds.length === 0) {
        return this.$message.info(" please choose the map first ");
      }
      let flag = true;
      this.checkedList.forEach((item) => {
        console.log(item.isMark);
        if (!item.isMark) {
          flag = false;
        }
      });
      if (!flag) return this.$message.info(" please mark first ");
      this.addSampleVisible = true;
    },
    async onAddHandleOk(value) {
      await addSampleType(value, {
        imageIds: this.checkedIds,
        mapTypeCode: this.mapDbParams.mapTypeCode,
      });
      this.$message.info("add to sample successful");
      this.addSampleVisible = false;
      this.onReload();
    },
    onAddCancel() {
      this.addSampleVisible = false;
    },
    // 打开AddToMap弹框
    onAddToMapType() {
      if (this.checkedIds.length === 0)
        return this.$message.info("Please choose the map first!");
      this.addToMapVisible = true;
    },
    async onAddToMapHandle(value) {
      await addMarkMapType({
        imageId: this.checkedIds,
        mapTypeCode: value,
      });
      this.addToMapVisible = false;
      this.getMapList();
    },
    onAddToMapCancel() {
      this.addToMapVisible = false;
    },
  },
};
</script>

<style scoped lang="less">
.map-DB {
  .search {
    margin-top: 4px;
  }
  .pagination {
    position: fixed;
    bottom: 0;
    right: 0;
    padding: 8px;
    z-index: 1000;
  }
  .imgList {
    height: calc(100vh - 112px);
    border: 1px solid #c4c4c4;
    margin-top: 4px;
    padding: 4px;
    overflow: auto;
    .img-item {
      position: relative;
      float: left;
      margin: 4px;
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
  .selected::before {
    content: "";
    width: 40px;
    height: 40px;
    display: block;
    position: absolute;
    top: -4px;
    left: -2px;
    z-index: 9;
    background: url("../../assets/icons/exist_image.png") no-repeat;
  }
  .color-block {
    height: 24px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 4px;
    .green-block {
      width: 16px;
      height: 16px;
      margin: 0 4px;
      background-color: rgb(0, 255, 0);
    }
    .blue-block {
      width: 16px;
      height: 16px;
      margin: 0 4px;
      background-color: rgb(0, 0, 255);
    }
  }
  .sample {
    /deep/.ant-btn-group > .ant-btn:not(:last-child) {
      border-right: 2px solid;
    }
    /deep/.ant-btn-group > .ant-btn:hover {
      z-index: 0;
    }
  }
}
.allMark {
  border-color: red !important;
}

.map-type-select {
  position: relative;
}
</style>
