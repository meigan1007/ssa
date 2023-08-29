<template>
  <div class="management">
    <!-- 顶部区域 -->
    <a-row type="flex" justify="space-between" class="ssa-header">
      <!-- 按钮区域 -->
      <a-col :span="8">
        <a-space :size="4">
          <a-button
            type="primary"
            shape="circle"
            icon="plus"
            size="small"
            @click="openUploadModelFileModal"
          />
          <a-button size="small" type="info" shape="circle" icon="reload" @click="onReload" />
        </a-space>
      </a-col>
      <!-- 查询区域 -->
      <a-col :span="12" style="text-align: right">
        <a-space>
          <a-select size="small" allowClear placeholder="Map Type" style="width:120px" :options="mapTypeDropDownList" v-model="mapTypeCode"></a-select>
          <a-input
            size="small"
            style="width: 200px"
            placeholder="Please input Model Name"
            v-model="filterContent"
          />
          <a-button size="small" type="primary" @click="onSearchModel">Search</a-button>
        </a-space>
      </a-col>
    </a-row>
    <!-- 表格展示区域 -->
    <a-table :columns="columns" :data-source="dataSource" v-bind="tableConfig">
      <!-- action操作区域 -->
      <span slot="action" slot-scope="text, record">
        <a-button
          type="primary"
          shape="circle"
          size="small"
          icon="edit"
          @click="onEditModel(record)"
        />
        <a-button
          type="danger"
          shape="circle"
          size="small"
          icon="delete"
          :style="{visibility:record.modelState === 'NO USED' ?'visible' : 'hidden'}"
          @click="onDeleteModel(record)"
        />
        <a-button
          type="primary"
          shape="circle"
          size="small"
          icon="upload"
          :style="{visibility:record.reUpload == 'Y' ?'visible' : 'hidden'}"
          @click="onReuploadModel(record)"
        />
      </span>
    </a-table>
    <!-- 分页区域 -->
    <a-pagination
      v-show="dataSource.length > 0"
      class="ssa-pagination"
      v-bind="pagination"
      @change="onPageNoChange"
      @showSizeChange="onPageSizeChange"
    />
    <!-- 上传modalFile区域 -->
    <upload-model-file-modal
      ref="uploadModelFileRef"
      @handleModelFile="handleModelFile"
    />
    <!-- 修改modalInfo区域 -->
    <edit-model-file-modal ref="editModelFileRef" @editModelInfo="editModelInfo" />
  </div>
</template>

<script>
import EditModelFileModal from "./components/editModelFileModal.vue";
import UploadModelFileModal from "./components/uploadModelFileModal.vue";
import { COLUMNS } from "./constant";
import { fetchModels, saveModelFile, updateModelInfo, deleteModel,updateReupload,fetchMapTypesByDropDown } from "./service";
export default {
  name: "management",
  components: {
    EditModelFileModal,
    UploadModelFileModal,
  },
  data() {
    return {
      // 表格参数
      columns: COLUMNS,
      dataSource: [],
      tableConfig: {
        bordered: true,
        size: "small",
        rowKey: "id",
        pagination: false,
        scroll: { y: "calc(100vh - 144px)" },
      },

      // 分页参数
      pagination: {
        total: 50,
        current: 1,
        pageSize: 50,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `Total ${total} items`,
        pageSizeOptions: ["50", "100", "200","500"],
      },
      params: {
        pageSize: 50,
        pageNo: 1,
        filterContent: "",
        mapTypeCode:''
      },
      filterContent: "",
      mapTypeCode:undefined,
      checkedId: "",
      mapTypeDropDownList:[]
    };
  },
  created() {
    // 获取模型列表信息
    this.getModelList();
    this.getMapTypesByDropDown()
  },
  methods: {
    onReload(){
      this.params.filterContent = ""
      this.params.mapTypeCode = ""
      this.mapTypeCode = undefined
      this.filterContent = ""
      this.getModelList()
    },
    async getMapTypesByDropDown(){
      const res = await fetchMapTypesByDropDown()
      this.mapTypeDropDownList = res.map(item => {
        return {
          label:item.mapTypeName,
          value:item.mapTypeCode
        }
      })
    },
    async getModelList() {
      const res = await fetchModels(this.params);
      this.dataSource = res.list;
      this.pagination.total = res.totalCount;
    },
    onSearchModel() {
      this.params.filterContent = this.filterContent;
      this.params.mapTypeCode = this.mapTypeCode;
      console.log(this.params,this.mapTypeCode);
      this.params.pageNo = 1;
      this.pagination.current = 1;
      this.getModelList();
    },
    // 表格操作区域
    // 打开新增model弹框
    openUploadModelFileModal() {
      this.$refs.uploadModelFileRef.initModal({
        mapTypeCode: undefined,
        modelTypeCode: undefined,
        moduleFiles: [],
      });
    },
    // 修改model信息
    onEditModel({ id, modelName, remark }) {
      this.checkedId = id;
      this.$refs.editModelFileRef.initModal("edit", {
        modelName,
        remark,
      });
    },
    // 删除model信息
    onDeleteModel({ id, modelName }) {
      // 删除model信息
      this.$confirm({
        title: this.formatModalTitle(modelName),
        content: {
          tag: "div",
          data: {
            style: {
              fontWeight: 600,
              fontSize: "16px",
              color: "#000",
            },
          },
          text:
            "Are you sure you want to delete this model? This operation will delete the model file",
        },
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: async () => {
          // 发送删除请求
          await deleteModel(id);
          this.getModelList();
        },
        onCancel() {},
      });
    },
    async onReuploadModel({id}){
      await updateReupload(id)
      this.getModelList()
    },
    formatModalTitle(modelName) {
      return {
        tag: "div",
        data: {
          class: "test",
        },
        children: [
          {
            tag: "div",
            data: {
              style: {
                fontWeight: 600,
                fontSize: "20px",
              },
            },
            text: "Model:",
          },
          {
            tag: "div",
            data: {
              style: {
                fontWeight: 400,
                fontSize: "14px",
                color: "rgba(0, 0, 0, 0.65)",
              },
            },
            text: modelName,
          },
        ],
      };
    },
    async handleModelFile(value) {
      const { mapTypeCode, modelTypeCode, file, remark, originalFileName } = value;
      try {
        const formData = new FormData();
        formData.append("mapTypeCode", mapTypeCode);
        formData.append("modelType", modelTypeCode);
        remark && formData.append("remark", remark);
        file && formData.append("file", file);
        formData.append("originalFileName", originalFileName);
        await saveModelFile(formData);
        // 成功执行的操作
        this.$refs.uploadModelFileRef.confirmLoading = false;
        this.$refs.uploadModelFileRef.modalVisible = false;
        this.getModelList();
      } catch (error) {
        this.$refs.uploadModelFileRef.confirmLoading = false;
        console.log(error);
      }
    },
    // 修改模型信息
    async editModelInfo(value) {
      console.log(value);
      await updateModelInfo({
        id: this.checkedId,
        ...value,
      });
      this.$refs.editModelFileRef.modalVisible = false;
      this.getModelList();
    },
    // 分页页码/每页条数发生切换触发
    onPageNoChange(current, pageSize) {
      this.pagination.current = current;
      this.pagination.pageSize = pageSize;
      this.params.pageNo = current;
      this.params.pageSize = pageSize;
      this.getModelList();
    },
    // pageSize发生切换页码需要重置为1
    onPageSizeChange(current, pageSize) {
      this.pagination.current = 1;
      this.pagination.pageSize = pageSize;
      this.params.pageNo = 1;
      this.params.pageSize = pageSize;
      this.getModelList();
    },
  },
};
</script>

<style lang="less" scoped>
.management{
  /deep/ .ant-table-row-cell-last{
  text-align:center !important
  }
}
  </style>
