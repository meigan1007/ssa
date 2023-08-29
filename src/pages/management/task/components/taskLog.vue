<template>
  <a-modal
    :title="title"
    class="tasklog"
    :visible="visible"
    :footer="null"
    width="90%"
    style="height:500px"
    @cancel="onCancel"
    :bodyStyle="{
      height:'500px',
      position:'relative'
    }"
  >
    <a-table v-bind="tableConfig" :data-source="tableData" :pagination="false" />
    <a-pagination class="tas-log-pagination" v-bind="pagination" @change="onChange" />
  </a-modal>
</template>

<script>
import {fetchModelLogs} from '../service'
import {LOG_COLUMN} from '../constant'
  export default {
    data() {
      return {
        tableConfig:{
          bordered:true,
          size:'small',
          rowKey: "id",
          columns:LOG_COLUMN,
          scroll:{
            y:400
          }
        },
        visible:false,
        tableData:[],
        modelBindId:'',
        // 分页相关数据
        pagination:{
          total:0
,          current:1,
          pageSize:20,
          showQuickJumper:true,
          showTotal:total => `Total ${total} items`,
        },
        title:'',
      }
    },
    methods:{
      initModal(modelBindId,title){
        // 发送请求
        this.modelBindId = modelBindId
        this.title = title
        this.getModelLogs()
        // 显示modal弹框
        
      },
      async getModelLogs(){
        const params = {
          pageNo:this.pagination.current,
          pageSize:this.pagination.pageSize,
          modelBindId:this.modelBindId
        }
        const {list,totalCount} = await fetchModelLogs(params)
        this.tableData = list
        this.pagination.total = totalCount
        this.visible = true
      },
      onChange(page, pageSize){
        console.log(page, pageSize);
        this.pagination.current = page
        this.pagination.pageSize = pageSize
        this.getModelLogs()
      },
      onCancel(){
        this.visible = false
        this.pagination.current = 1 
        this.pagination.pageSize = 10 
      }
    }
  }
</script>

<style lang="less" scoped>

.tasklog{
  .tas-log-pagination{
    position: absolute;
    right: 16px;
    bottom: 4px;
  }
  /deep/ .ant-table-row-cell-last{
  text-align:center !important
  }
}

</style>
