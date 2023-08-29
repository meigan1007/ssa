<template>
    <a-modal
      :title="modalTitle"
      :visible="modalVisible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <ssa-form :formItems="formItems" ref="ssaFormRef">
      <template v-for="(item) in array" #[item.code]>
        <a-row :key="item.code">
            <a-col :span="6" style="text-align:right"><a-checkbox > {{ item.name }}:</a-checkbox></a-col>
            <a-col :span="16"><a-input :placeholder="item.name" /></a-col>
        </a-row>
      </template>
      </ssa-form>
    </a-modal>
</template>

<script>
import SsaForm from '@/components/ssaForm/index.vue'
    export default {
        name:"addDefectCode",
        components:{
            SsaForm
        },
        data() {
            return {
                modalTitle:'Add Defect Code',
                modalVisible:false,
                confirmLoading:false,
                formItems:[
                    {
                        field:'defectCode',
                        type:'input',
                        label:'Defect Code',
                        rules:[{required:true,message:'请输入缺陷编码'}]
                    },
                    {
                        field:'defectName',
                        type:'input',
                        label:'Defect Name',
                        rules:[{required:true,message:'请输入缺陷名称'}]
                    },
                ],
                array:[]
            }
        },
        methods:{
           initModal(){
            this.modalVisible=true
            this.modalTitle='Add Defect Code'
            // 接口获取参数类型为数组
            this.array = [
                {
                    code:'height',
                    name:'长'
                },
                {
                    code:'width',
                    name:'宽'
                },
                {
                    code:'mianji',
                    name:'面积'
                },
                {
                    code:'R',
                    name:'直径'
                },
                {
                    code:'bili',
                    name:'比例'
                },
                {
                    code:'zhixin',
                    name:'质心'
                },
            ]
            this.array.forEach(item => {
                this.formItems.push({
                    type:'slot',
                    field:item.code,
                    fieldName:item.name,
                    formLayout:{
                        labelCol: { span: 0 },
                        wrapperCol: { span: 24 },
                    }
                })
            })
           },
           handleCancel(){
            // 关闭弹框
            this.modalVisible=false
           },
           handleOk(){
            // 提交表单信息
            console.log(this.$refs.ssaFormRef.form);
            this.$refs.ssaFormRef.form.
                validateFields(valid => {
                    console.log(valid);
                    // 校验成功 调用接口
                    if(!valid){
                        console.log('校验成功')
                    }else{
                        // 失败处理
                    }
                })
           }
        }
    }
</script>

<style lang="less" scoped>

</style>