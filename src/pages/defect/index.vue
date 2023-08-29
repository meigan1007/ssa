<template>
<div  class="defect">
  <div class="collapse">
    <a-collapse :activeKey="activeKey">
        <a-collapse-panel key="1" header="defect search">
          <search-defect @onJumpRowData="onJumpRowData"></search-defect>
        </a-collapse-panel>
        <a-collapse-panel key="2" header=" image">
          <defect-image></defect-image>
        </a-collapse-panel>
        <a-collapse-panel key="3" header="row data">
          <row-data></row-data>
        </a-collapse-panel>
      </a-collapse>
  </div>
  <div class="chat">
    <chat-area></chat-area>
  </div>
</div>
</template>

<script>
import SearchDefect from './components/searchDefect.vue'
import RowData from './components/rowData.vue'
import DefectImage from './components/defectImage.vue'
import ChatArea from './components/chatArea.vue'
    export default {
        data() {
            return {
                activeKey:['1','2','3']
            }
        },
        components:{
            SearchDefect,
            RowData,
            DefectImage,
            ChatArea
        },
        methods: {
          onJumpRowData(){
            this.activeKey = ['2','3']
          }
        },
    }
</script>

<style lang="less" scoped>
.defect{
  display: flex;
  overflow-x: hidden;
  height: calc(100vh - 48px);
  overflow-y: auto;
  .collapse{
    width: calc(100% - 360px);
    height: calc(100vh - 50px);
    overflow: auto;
    /deep/ .ant-collapse-header{
      padding: 4px !important;
      padding-left: 40px !important;
    }
    /deep/ .ant-collapse-content{
      overflow: auto;
    }
  }
  .chat{
    width:360px;
    height: 100%;
    overflow-y: auto;
  }

}

</style>