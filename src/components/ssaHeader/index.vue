<template>
  <a-row type="flex" justify="space-between" class="header">
    <!-- 按钮区域 -->
    <a-col :span="8">
      <a-button v-for="item in buttonList" v-bind="item.config" :key="item.key" @click="onButtonClick(item.key)" />
      <slot></slot>
    </a-col>
    <!-- 查询区域 -->
    <a-col :span="12" style="text-align: right">
      <a-space>
        <a-input  placeholder="Please input keyword" />
        <a-button  type="primary" @click="onSearchModel">Search</a-button>
      </a-space>
    </a-col>
  </a-row>
</template>

<script>
  export default {
    props:{
      buttonList:{
        type:Array,
        default(){
          return []
        }
      }
    },
    formItems:{
      type:Array,
      default(){
        return []
      }
    }
  }
</script>

<style lang="less" scoped>

</style>