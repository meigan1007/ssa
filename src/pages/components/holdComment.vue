<template>
  <a-table
    size="small"
    :columns="columns"
    :data-source="tableData"
    :pagination="false"
    rowKey="id"
    :defaultExpandedRowKeys="defaultKeys"
    childrenColumnName="childComments"
    bordered
  ></a-table>
</template>
<script>
export default {
  props: ["tableData", "defaultKeys"],
  data() {
    return {
      columns: [
        { title: "Action", dataIndex: "eventType", key: "eventType" },
        { title: "Operator", dataIndex: "userId", key: "userId" },
        { title: "Dept.	", dataIndex: "eventDept", key: "eventDept" },
        { title: "Hold Time", dataIndex: "startTm", key: "startTm" },
        { title: "Comment", dataIndex: "eventComment", key: "eventComment" },
      ],
    };
  },
};
</script>
<style lang="less" scoped>
/deep/ .ant-table-thead > tr > th {
  text-align: center !important;
}
</style>
