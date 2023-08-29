<template>
  <a-modal
    title="Upload Model File"
    v-model="modalVisible"
    :width="600"
    @ok="handleOk"
    okText="save"
    destroyOnClose
    :confirm-loading="confirmLoading"
    @cancel="handleCancel"
  >
    <ssa-form ref="ssaFormRef" :formItems="formItems" :dict="dict">
            <template #moduleFiles="scoped">
        <div>
          <a-upload
            v-decorator="[scoped.field, { rules: scoped.rules }]"
            v-bind="uploadConfig"
            :fileList="fileList"
          >
            <div v-if="fileList.length < 1">
              <a-button> <a-icon type="upload" /> </a-button>
            </div>
          </a-upload>
          <div v-if="exceedTooltip" style="lineHeight:20px;marginBottom:12px;color:red">{{tooltipContent}}</div>
        </div>
      </template>
    </ssa-form>
  </a-modal>
</template>

<script>
import _ from 'lodash';
import SsaForm from '@/components/ssaForm'
import { UPLOAD_MODEL_FILE_FORM_ITEMS,MODEL_TYPE_LIST } from "../constant";
import {fetchMapTypes} from '../service'
import { getGLOBAL } from '@/utils/web'
export default {
  data() {
    return {
      modalVisible: false,
      formItems: UPLOAD_MODEL_FILE_FORM_ITEMS,
      dict:{
        mapTypeCode:[],
        modelTypeCode:MODEL_TYPE_LIST,
      },
      fileList: [],
      // 超出是否提示
      exceedTooltip:false,
      tooltipContent:'文件过大',
      fileMaxSize:200,
      confirmLoading:false,
      uploadConfig: {
        beforeUpload: (file, fileList) => {
          console.log(file);
          const arr = file.name.split('.')
          const fileType = arr[arr.length - 1]
          const acceptUploadFileTypes = ['7z','zip','rar']
          console.log(fileType);
          if(acceptUploadFileTypes.indexOf(fileType) === -1){
            return this.$message.info('You need to upload files in.7z,.zip, or.rar format');
          }
          const sizeM = file.size / 1024 / 1024 
          console.log(sizeM,this.fileMaxSize);
          if(sizeM > this.fileMaxSize){
            this.exceedTooltip = true
          }else{
            this.exceedTooltip = false
          }
          // 判断尺寸是否满足条件 超过条件 让用户到S3上传
          this.fileList = [...this.fileList, file];
          return false;
        },
        remove:(file) => {
          console.log(file,'remove');
          this.fileList = []
        }
      },
    };
  },
  components:{
    SsaForm
  },
  created(){
    this.tooltipContent = getGLOBAL().MODEL_FILE_UPLOAD_MAXIMUM_TIPS
    this.fileMaxSize =  _.toNumber(getGLOBAL().MODEL_FILE_UPLOAD_MAXIMUM)
    this.getMapTypes()
  },
  methods: {
    // 获取mapType列表
    async getMapTypes() {
      const res = await fetchMapTypes();
      this.dict.mapTypeCode = res.map((item) => {
        return {
          label: item.mapTypeName,
          value: item.mapTypeCode,
        };
      });
    },
    initModal(initVal) {
      this.fileList = []
      this.exceedTooltip = false
      this.modalVisible = true;
    },
    handleOk() {
      this.$refs.ssaFormRef.form.validateFields((err, values) => {
        console.log(err);
        if (err) return;
        console.log(values);
        const {mapTypeCode,modelTypeCode,remark,moduleFiles} = values
        this.confirmLoading = true;
        this.$emit("handleModelFile",{
          mapTypeCode,modelTypeCode,remark,
          file:this.exceedTooltip ? undefined : moduleFiles.file,
          originalFileName:moduleFiles.file.name
        })
      });
    },
    // 关闭弹框
    handleCancel() {
      this.modalVisible = false;
      this.$refs.ssaFormRef.form.resetFields();
    },
  },
};
</script>

<style lang="less" scoped></style>
