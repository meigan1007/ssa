<template>
  <div>
    <a-tag v-for="item in list" :key="item" closable @close="preventDefault" @click="onClick">
      {{item}}
    </a-tag>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        list:[
          'default','pre'
        ]
      }
    },
    methods:{
      preventDefault(){
        console.log('preventDefault')
      },
      onClick(){
        console.log('onClick')
      }
    }
  }
</script>

<style lang="less" scoped>

</style>