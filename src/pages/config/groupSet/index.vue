<template>
  <div class="mapType">
    <!-- 顶部区域 -->
    <a-row type="flex" justify="space-between" class="ssa-header">
      <!-- 按钮区域 -->
      <!-- 查询区域 -->
      <a-col :span="24" style="text-align: right">
        <a-space>
          <a-upload
          name="file"
          action=""
        >
          <a-button type="primary" size="small" icon="upload">  Upload </a-button>
        </a-upload>
        <a-button type="primary" icon="download" size="small">
          Download
        </a-button>
        <a-button type="info" icon="reload" size="small">
          Reset
        </a-button>
        <a-button type="success" icon="plus" size="small" @click="openGroupSetModal">
          Add Group
        </a-button>
          <a-input size="small" placeholder="input search text" v-model="keyWord" />
          <a-button size="small" type="primary" @click="onSearchMapType">Search</a-button>
        </a-space>
      </a-col>
    </a-row>
    <!-- 表格展示区域 -->
    <a-table :columns="columns" :data-source="dataSource" v-bind="tableConfig">
      <!-- action操作区域 -->
      <span slot="action" slot-scope="text, record">
        <a-tooltip placement="bottom">
          <template slot="title">
            <span>Edit</span>
          </template>
          <a-button
            type="primary"
            shape="circle"
            size="small"
            icon="edit"
            @click="onEditMapType(record)"
          />
        </a-tooltip>
        <a-tooltip placement="bottom">
          <template slot="title">
            <span>Delete</span>
          </template>
          <a-button
            type="danger"
            shape="circle"
            size="small"
            icon="delete"
            @click="onDeleteMapType(record)"
          />
        </a-tooltip>
        <a-tooltip placement="bottom">
          <template slot="title">
            <span>Process Scope</span>
          </template>
          <a-button
            type="primary"
            shape="circle"
            size="small"
            icon="setting"
            @click="onProcessScope(record)"
          />
        </a-tooltip>
      </span>
      <span slot="matchTool" slot-scope="text, record">
                <a-switch
          :checked="text === 'Y'"
          @change="(checked) => onMatchToolChange(record.id)"
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
    <!-- 新增/编辑弹框区域 -->
    <group-set-modal
      ref="GroupSetModal"
      @handleMapTypeSet="handleMapTypeSet"
    ></group-set-modal>
  </div>
</template>

<script>
import { COLUMNS } from "./constant";
import { fetchMapTypes, updateMapType, deleteMapType,updateMapTypeStatus } from "./service";
import GroupSetModal from "./components/GroupSetModal.vue";
export default {
  name: "mapType",
  components: {
    GroupSetModal,
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

      // 弹框参数
      editModelFileVisible: false,
      uploadModelFileVisible: false,

      // 分页参数
      pagination: {
        total: 0,
        current: 1,
        pageSize: 50,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `Total ${total} items`,
        pageSizeOptions: [ "50", "100", "200","500"],
      },
      mapTypeParam: {
        keywords: "",
        orderBy: "",
        orderField: "",
        pageNo: 1,
        pageSize: 50,
      },
      keyWord: "",
      // 当前选中的id
      checkedId: "",
    };
  },
  created() {
    this.getMapTypes();
  },
  methods: {
    onReload(){
      this.keyWord = ""
      this.mapTypeParam.keywords = ""
      this.getMapTypes()
    },
    async getMapTypes() {
      const { data } = await fetchMapTypes(this.mapTypeParam);
      this.pagination.total = data.totalCount;
      this.dataSource = data.list;
    },
    onSearchMapType() {
      this.mapTypeParam.keywords = this.keyWord;
      this.mapTypeParam.pageNo = 1;
      this.pagination.current = 1;
      this.getMapTypes();
    },
    onAddGroup(){

    },
    // 表格操作区域
    // 打开新增model弹框
    openGroupSetModal() {
      this.checkedId = "";
      this.$refs.GroupSetModal.initModal("add", {
        mapTypeName: "",
        mapTypeCode: "",
        remark: "",
      });
    },
    // 修改mapType信息
    onEditMapType(record) {
      const { mapTypeName, mapTypeCode, remark, id } = record;
      this.checkedId = id;
      this.$refs.GroupSetModal.initModal("edit", {
        mapTypeName,
        mapTypeCode,
        remark,
      });
    },
    async handleMapTypeSet(formValue) {
      // // 存在选中的id就是编辑页面 没有就是新增页面
      // if(this.checkedId){
      //   // 发送编辑请求
      //   // 请求结束后 重新将checkedId置为空
      //   this.checkedId = ""
      // }else{
      //   // 发送新增请求
      // }
      await updateMapType({
        ...formValue,
        id: this.checkedId,
      });
      this.$refs.GroupSetModal.mapTypeSetVisible = false;
      this.getMapTypes();
    },
    // 删除MapType信息
    onDeleteMapType({ mapTypeCode, mapTypeName }) {
      this.$confirm({
        title: `Map Type：${mapTypeName}`,
        content: "Are you sure to delete?",
        okText: "Yes",
        okType: "primary",
        cancelText: "No",
        onOk: async () => {
          // 发送删除请求
          await deleteMapType(mapTypeCode);
          if(this.dataSource.length === 1 && this.pagination.current > 1){
            this.pagination.current =  this.pagination.current - 1
            this.mapTypeParam.pageNo = this.pagination.current
          }
          this.getMapTypes();
        },
        onCancel() {
        },
      });
    },
    onProcessScope(record) {
      const { mapTypeCode } = record;
      this.$refs.ProcessScopeSetModal.initModal(mapTypeCode);
    },
    // 分页页码/每页条数发生切换触发
    onPageNoChange(current, pageSize) {
      this.pagination.current = current;
      this.pagination.pageSize = pageSize;
      this.mapTypeParam.pageNo = current;
      this.mapTypeParam.pageSize = pageSize;
      this.getMapTypes();
    },
    // pageSize发生切换页码需要重置为1
    onPageSizeChange(current, pageSize) {
      this.pagination.current = 1;
      this.pagination.pageSize = pageSize;
      this.mapTypeParam.pageNo = 1;
      this.mapTypeParam.pageSize = pageSize;
      this.getMapTypes();
    },
    // 添加matchtool状态
    async onMatchToolChange(id){
      await updateMapTypeStatus(id)
      this.getMapTypes()
    }
  },
};
</script>

<style lang="less" scoped></style>
