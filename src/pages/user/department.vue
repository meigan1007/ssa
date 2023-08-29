<template>
  <div>
    <!-- 搜索区域 -->
    <a-row class="search">
      <a-col :span="4">
        <a-button
          type="text"
          style="color: #333; border: none"
          shape="circle"
          icon="plus-circle"
          v-auth="'hha:thirdpartUser:department:add'"
          @click="$refs.deptRef.onShowModal()"
        />
      </a-col>
      <a-col :span="20">
        <div
          style="text-align: right"
          v-auth="'hha:thirdpartUser:department:list'"
        >
          <div class="label">Dept.:</div>
          <div class="value">
            <a-input-search
              placeholder="input keyword"
              @search="onSearchTable"
              allowClear
              enter-button
            />
          </div>
        </div>
      </a-col>
    </a-row>
    <a-table
      size="small"
      :columns="columns"
      rowKey="id"
      :data-source="tableData"
      :pagination="pagination"
      bordered
      :scroll="{ y: 'calc(100vh - 208px)' }"
      @change="onTableChange"
    >
      <a
        v-auth="'hha:thirdpartUser:department:browseDeptOrg'"
        slot="Organization"
        slot-scope="text, record"
        @click="$refs.allocationRef.onShowModal(record, 'ORG')"
        >分配组织</a
      >
      <a
        v-auth="'hha:thirdpartUser:department:browseDeptEmpolyee'"
        slot="Employees"
        slot-scope="text, record"
        @click="$refs.allocationRef.onShowModal(record, 'EMP')"
        >分配员工</a
      >
      <a-space slot="customRender" slot-scope="text, record">
        <a-button
          type="primary"
          shape="circle"
          icon="edit"
          size="small"
          v-auth="'hha:thirdpartUser:department:edit'"
          @click="$refs.deptRef.onShowModal(record)"
        />
        <a-popconfirm
          title="Do you really want to delete?"
          ok-text="Yes"
          cancel-text="No"
          v-auth="'hha:thirdpartUser:department:remove'"
          @confirm="onRemove(record)"
        >
          <a-button type="danger" shape="circle" icon="delete" size="small" />
        </a-popconfirm>
      </a-space>
      <a-switch
        slot="status"
        slot-scope="text, record"
        :checked="text == 'Y'"
        @change="onSatausChange(record)"
      />
    </a-table>
    <AllocationModal ref="allocationRef" />
    <DeptModal @getCurent="getCurent" ref="deptRef" />
  </div>
</template>
<script>
import AllocationModal from "./components/allocationModal";
import DeptModal from "./components/deptModal";
import {
  fetchDepartment,
  deleteDepartment,
  changeDepartStatus,
} from "./service";
export default {
  components: { AllocationModal, DeptModal },
  data() {
    return {
      tableData: [],
      columns: [
        {
          title: "No",
          align: "center",
          width: 60,
          customRender: (text, record, index) => `${index + 1}`,
        },
        {
          title: "Dept.",
          dataIndex: "name",
          align: "center",
          width: 100,
        },
        {
          title: "Organization",
          dataIndex: "Organization",
          align: "center",
          scopedSlots: { customRender: "Organization" },
        },
        {
          title: "Employees",
          dataIndex: "Employees",
          align: "center",
          scopedSlots: { customRender: "Employees" },
        },
        {
          title: "Status",
          dataIndex: "isAvailable",
          align: "center",
          scopedSlots: { customRender: "status" },
        },
        {
          title: "Update Time",
          dataIndex: "updateTm",
          align: "center",
        },
        {
          title: "Operator",
          dataIndex: "updatedBy",
          align: "center",
        },
        {
          dataIndex: "action",
          key: "action",
          title: "Action",
          align: "center",
          width: 120,
          scopedSlots: { customRender: "customRender" },
        },
      ],
      pagination: {
        current: 1,
        pageSize: 100,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50", "100", "200", "300", "500"],
        total: 0,
        showTotal: (total, range) => {
          return `${range[0]}-${range[1]} of ${total} items`;
        },
        onChange: (page) => {
          this.pagination.current = page;
        },
        onShowSizeChange: (current, size) => {
          this.pagination.pageSize = size;
        },
      },
      deptName: "",
      // 接口请求参数
      queryParams: {
        filters: {
          combineType: "and",
          combinedFilters: [
            {
              combineType: "",
              combinedFilters: [{}],
              propertyFilters: [
                {
                  expression: "",
                  values: [],
                },
              ],
            },
          ],
          propertyFilters: [
            {
              expression: "filter_LIKE_name",
              values: [],
            },
          ],
        },
        orders: [{ field: "name", type: "asc" }],
      },
      // 页码相关参数
      form: {
        pageNo: 1,
        pageSize: 20,
      },
    };
  },
  created() {
    this.getCurent();
  },
  methods: {
    // 分页
    onTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.form.pageNo = pagination.current;
      this.form.pageSize = pagination.pageSize;
      this.getCurent();
    },
    onSearchTable(val) {
      this.queryParams.filters.propertyFilters[0].values = [val];
      this.form.pageNo = 1;
      this.pagination.current = 1;
      this.getCurent();
    },
    // 列表数据
    async getCurent() {
      const res = await fetchDepartment(this.form, this.queryParams);
      this.tableData = res.list;
      this.pagination.total = res.totalCount;
      this.pagination.pageSize = res.pageSize;
    },
    // 删除
    async onRemove(record) {
      await deleteDepartment(record.id);
      this.getCurent();
    },
    // status发生切换
    async onSatausChange(record) {
      const { id, isAvailable } = record;
      await changeDepartStatus({
        id,
        isAvailable: isAvailable == "Y" ? "N" : "Y",
      });
      this.$message.success("Status change successful");
      this.getCurent();
    },
  },
};
</script>
<style lang="less" scoped>
.search {
  line-height: 32px;
  margin-bottom: 12px;
  // display: flex;
  .label {
    display: inline-block;
    height: 32px;
    margin-right: 12px;
    width: 180px;
  }
  .value {
    display: inline-block;
  }
}
</style>
