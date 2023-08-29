<template>
  <a-modal title="Map Type Set" :width="600" v-model="mapTypeSetVisible" @ok="handleOk" okText="save" @cancel="handleCancel">
    <ssa-form ref="ssaFormRef" :formItems="formItems" ></ssa-form>
  </a-modal>
</template>

<script>
import SsaForm from '@/components/ssaForm'
import {GROUP_SET_FORMITEMS} from '../constant'
  export default {
    data() {
      return {
        mapTypeSetVisible:false,
        formItems:GROUP_SET_FORMITEMS,
      }
    },
    props:{
      // 表单初始值
      initValue:{
        type:Object,
        default(){
          return {}
        }
      }
    },
    components:{
      SsaForm
    },
    methods:{
      // modalType 弹框类型 add/edit
      // initValue 弹框类型 表单初始值
      initModal(initValue){
        this.mapTypeSetVisible = true
        // this.$nextTick(() => {
        //   this.$refs.ssaFormRef.form.setFieldsValue(initValue)
        // })
      },
      handleOk(){
        this.$refs.ssaFormRef.form.validateFields((err,values) => {
          if(err) return 
          this.$emit('handleMapTypeSet',values)
        })
      },
      // 关闭弹框
      handleCancel(){
        this.mapTypeSetVisible = false
        this.$refs.ssaFormRef.form.resetFields()
      }
    }
  }
</script>

<style lang="less" scoped>

</style>