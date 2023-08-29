<template>
  <div class="collection">
    <a-row style="margin: 16px 0 16px 0px">
      <a-col :span="16">
        <a-row type="flex">
          <a-col flex="60px" style="line-height: 32px; text-align: right"
            >来源：</a-col
          >
          <a-col flex="206px" style="margin-right: 12px">
            <a-select
              v-model="form.businessType"
              style="width: 206px"
              allowClear
            >
              <a-select-option
                v-for="item in businessList"
                :value="item"
                :key="item"
              >
                {{ item }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col flex="60px" style="line-height: 32px; text-align: right"
            >标题：</a-col
          >
          <a-col flex="150px">
            <a-input v-model="form.collectName" />
          </a-col>
          <a-button
            type="primary"
            @click="onSearchCollection"
            style="margin-left: 24px"
          >
            Search
          </a-button>
        </a-row>
      </a-col>
    </a-row>
    <a-row type="flex" justify="space-between" class="table">
      <a-col flex="550px">
        <a-table
          size="small"
          :columns="columns"
          :rowKey="(record) => record.id"
          :data-source="tableData"
          bordered
          :rowSelection="rowSelection"
          :pagination="pagination"
        />
      </a-col>
      <a-col style="width: calc(100% - 620px)" class="img">
        <img
          v-show="imgUrl"
          :src="imgUrl"
          alt="暂无图片。。。"
          style="width: 100%"
        />
        <a-empty class="empty" description="暂无图片" v-show="!imgUrl" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { getGLOBAL } from "@/utils/web";
import { fetchCollection, fetchImageById } from "./service";
export default {
  name: "collection",
  data() {
    return {
      columns: [
        {
          title: "来源",
          dataIndex: "businessType",
          key: "businessType",
          align: "center",
          sorter: true,
          width: 250,
          ellipsis: true,
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "name" },
        },
        {
          title: "标题",
          dataIndex: "collectName",
          align: "center",
          sorter: true,
          width: 280,
          ellipsis: true,
          key: "collectName",
        },
      ],
      tableData: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showQuickJumper: true,
        showTotal: (total, range) => {
          return `${range[0]}-${range[1]} of ${total} items`;
        },
        onChange: (page) => {
          this.pagination.current = page;
        },
      },
      imgUrl: "",
      params: {
        body: {
          businessType: "",
          collectName: "",
          collectType: "",
          holdLotId: this.holdLotId,
        },
        orders: [],
        pageNum: 1,
        pageSize: 1000,
      },
      form: {
        businessType: "",
        collectName: "",
      },
      businessList: [
        "CARRIER_HISTORY",
        "CHART_ANALYSIS",
        "DEFECT_PARETO",
        "DSA_ANALYSIS",
        "EQP_PROCESS_HISTORY",
        "EQP_STATUS_CHAGE_HISTORY",
        "IMAGE_GALLERY",
        "LOT_RUN_HISTORY",
        "LOT_TRANSPORT_HISTORY",
        "MAP_GALLERY",
        "PREVIOUS_SCAN_MAPS",
        "SINGLE_MAP",
        "TREND_CHART_CROSS_MODULE",
      ],
      rowSelection: {
        type: "radio",
        selectedRowKeys: [],
        onChange: (selectedRowKeys, selectedRows) => {
          this.rowSelection.selectedRowKeys = selectedRowKeys;
          this.getImage(selectedRowKeys[0], selectedRows[0]);
        },
      },
    };
  },
  props: ["holdLotId", "defaultSelectId"],
  watch: {
    defaultSelectId(newVal) {
      if (newVal) {
        this.rowSelection.selectedRowKeys = [newVal];
        let selectImg = "";
        let record = {};
        this.tableData.forEach((item) => {
          if (item.id === newVal) {
            selectImg = item.dataId;
            record = item;
          }
        });
        this.getImage(selectImg, record);
      } else {
        this.rowSelection.selectedRowKeys = [];
        this.imgUrl = "";
      }
    },
  },
  created() {
    this.rowSelection.selectedRowKeys = [this.defaultSelectId];
    this.getCollection();
  },
  methods: {
    getCollection() {
      fetchCollection(this.params).then((res) => {
        this.tableData = res.list;
        if (this.defaultSelectId) {
          let selectImg = "";
          let record = {};
          this.tableData.forEach((item) => {
            if (item.id === this.defaultSelectId) {
              selectImg = item.dataId;
              record = item;
            }
          });
          this.getImage(selectImg, record);
        }
        this.pagination.total = res.totalCount;
      });
    },
    // 分页
    // onTableChange(pagination, filters, sorter) {
    //   this.pagination.current = pagination.current;
    //   this.pagination.pageSize = pagination.pageSize;
    //   this.params.pageNum = pagination.current;
    //   this.params.pageSize = pagination.pageSize;
    //   if (JSON.stringify(sorter) !== "{}") {
    //     this.params.orders = [
    //       {
    //         field: sorter.field,
    //         type: sorter.order == "descend" ? "desc" : "asc",
    //       },
    //     ];
    //   } else {
    //     this.params.orders = [];
    //   }
    //   this.getCollection();
    // },
    getImage(id, row) {
      fetchImageById(row.dataId).then((res) => {
        if (res) {
          this.imgUrl = getGLOBAL().PATH_ATTACH_BUCKET + res.fileUrl;
        }
        this.$emit("onSelectImage", {
          imgId: row.id,
          url: this.imgUrl,
        });
      });
    },
    onSearchCollection() {
      const { businessType, collectName } = this.form;
      this.params.body.businessType = businessType;
      this.params.body.collectName = collectName;
      this.params.pageNum = 1;
      this.pagination.current = 1;
      this.getCollection();
    },
  },
};
</script>

<style lang="less" scoped>
.collection {
  .report-button {
    text-align: right;
    margin: 12px 0;
  }
  .table {
    min-height: 250px;
  }
  .img {
    height: 360px;
    overflow: auto;
    position: relative;
    border: 1px solid #c4c4c4;
    .empty {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
