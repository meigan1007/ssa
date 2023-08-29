<template>
  <a-modal title="Edit Model Infor" :width="600" v-model="modalVisible" @ok="handleOk" okText="save" @cancel="handleCancel">
    <ssa-form ref="ssaFormRef" :formItems="formItems" ></ssa-form>
  </a-modal>
</template>

<script>
import SsaForm from '@/components/ssaForm'
import {EDIT_MODEL_FILE_FORM_ITEMS} from '../constant'
  export default {
    data() {
      return {
        modalVisible:false,
        formItems:EDIT_MODEL_FILE_FORM_ITEMS,
        // formConfig:{}
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
      initModal(modalType,initValue){
        this.modalVisible = true
        // 调整formItems
        // if(modalType === 'edit'){
        //   this.formItems = UPLOAD_MODEL_FILE_FORM_ITEMS.map(item => {
        //     if(item.field === 'mapTypeCode'){
        //       return {
        //         ...item,
        //         compConfig:{
        //           readOnly:true
        //         }
        //       }
        //     }else{
        //       return item
        //     }
        //   })
        // }else{
        //   this.formItems = UPLOAD_MODEL_FILE_FORM_ITEMS
        // }
        this.$nextTick(() => {
          this.$refs.ssaFormRef.form.setFieldsValue(initValue)
        })
      },
      handleOk(){
        this.$refs.ssaFormRef.form.validateFields((err,values) => {
          if(err) return 
          this.$emit('editModelInfo',values)
        })
      },
      // 关闭弹框
      handleCancel(){
        this.modalVisible = false
        this.$refs.ssaFormRef.form.resetFields()
      }
    }
  }
</script>

<style lang="less" scoped>

</style>