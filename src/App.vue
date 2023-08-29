<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
#app {
  height: 100%;
  position: relative;
}
.ssa-header{
margin-bottom: 4px;
}
.ssa-pagination{
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 4px !important; 
  z-index: 1000;
}
.ssa-pagination .ant-pagination-options{
  margin-right: -8px;
}
#app .ant-table-thead .ant-table-column-title {
  white-space: nowrap;
}
#app .ant-collapse-content > .ant-collapse-content-box{
  padding: 4px;
}
</style>

<script>
export default {
};
</script>
