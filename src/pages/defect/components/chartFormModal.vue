<template>
    <a-drawer
        title="Filter"
        :closable="false"
        :visible="visible"
        @close="onClose"
        :width="600"
        :headerStyle="headerStyle"
        :bodyStyle="bodyStyle"
        >
            <ssa-form ref="ssaFormRef" :formItems="FORM_ITEMS" :formConfig="FORM_CONFIG" :dict="DICT"></ssa-form>
            
        <div
            class="submit"
      >
        <a-button :style="{ marginRight: '8px' }" @click="onClose">
          Cancel
        </a-button>
        <a-button type="primary" @click="onOK">
          Submit
        </a-button>
      </div>
        </a-drawer>
    </template>
    
    <script>
    import SsaForm from '@/components/ssaForm/index.vue'
    import { DICT,FORM_CONFIG,FORM_ITEMS,DATA_BY } from './constant'
        export default {
            data() {
                return {
                    visible:false,
                    headerStyle:{
                        padding:'10px'
                    },
                    bodyStyle:{
                        padding:'20px'
                    },
                    FORM_CONFIG,
                    FORM_ITEMS,
                    DICT,
                    DATA_BY,
                    dataBy:'1'
                }
            },
            components:{
                SsaForm
            },
            watch:{
                visible(val){
                    if(val){
                        this.$nextTick(() => {
                            this.$refs.ssaFormRef.form.setFieldsValue({

                            })
                        })
                    }
                }
            },
            
            methods:{
                onClose(){
                    this.visible = false
                },
                onOK(){
                    // 进行规则校验
                    this.visible = false
                    const value = this.$refs.ssaFormRef.form.getFieldsValue()
                    console.log(value)
                    this.$emit('submitForm',value)
                }
            }
        }
    </script>

    <style lang="less" scoped>
    .submit{
          position: absolute;
          right: 0;
          bottom: 0;
          width: 100%;
          border-top: 1px solid #e9e9e9;
          padding: 10px 16px;
          background: #fff;
          text-align: right;
          z-index: 1
        }
    </style>
    