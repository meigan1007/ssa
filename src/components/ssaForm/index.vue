<template>
  <div class="ssa-form">
    <a-form :form="form" v-bind="formConfig">
      <a-row>
        <template v-for="item in formItems">
          <a-col :style="item.colStyle" v-bind="item.colLayout || {} " :key="item.field">
            <a-form-item :label="item.label" v-bind="item.formLayout || {}">
              <a-input
                v-if="item.type === 'input'"
                v-decorator="[item.field, { rules: item.rules }]"
                v-bind="item.compConfig || {}"
              />
              <!-- 下拉框 -->
              <a-select
                v-else-if="item.type === 'select'"
                v-decorator="[item.field, { rules: item.rules }]"
                v-bind="item.compConfig || {} "
                :options="dict[item.field]"
              />
              <a-textarea
                v-else-if="item.type === 'textarea'"
                v-decorator="[item.field, { rules: item.rules }]"
                v-bind="item.compConfig || {}"
              />
              <!-- 数字输入框 -->
              <a-input-number
                v-else-if="item.type === 'inputNumber'"
                v-decorator="[item.field, { rules: item.rules }]"
                v-bind="item.compConfig || {}"
              />
              <!-- 多选框组 -->
              <a-checkbox-group
              v-else-if="item.type === 'checkbox'"
                v-decorator="[item.field, { rules: item.rules }]"
                v-bind="item.compConfig || {}"
                :options="dict[item.field]"
              />
              <!-- 单选框组 -->
              <a-radio-group v-else-if="item.type === 'radio'" :options="dict[item.field]"                v-decorator="[item.field, { rules: item.rules }]"
                v-bind="item.compConfig || {}" />
                <!-- switch -->
                <a-switch v-else-if="item.type === 'switch'"  v-decorator="[item.field, { rules: item.rules }]"
                v-bind="item.compConfig || {}" />
              <!-- 上传组件 -->
              <a-upload
                v-else-if="item.type === 'upload'"
                v-decorator="[item.field, { rules: item.rules }]"
                v-bind="item.compConfig || {}"
              > 
                <a-button size="small"> <a-icon type="upload" /> </a-button>
              </a-upload>
              <!-- 插槽区域 父组件自定义内容 -->
              <slot v-else-if="item.type === 'slot'" :name="item.field" v-bind="item"></slot>
            </a-form-item>
          </a-col>
        </template>
      </a-row>
    </a-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: this.$form.createForm(this, { name: "ssa_form" ,
      onValuesChange:(props, values) => {
        this.$nextTick(() => {
          this.$emit('formValueChange',values)
        })
      }}),
    };
  },
  props: {
    formItems: {
      type: Array,
      default() {
        return []
      },
    },
    formConfig: {
      type: Object,
      default() {
        return {
          labelCol: { span: 6 },
          wrapperCol: { span: 16 },
        };
      },
    },
    // 下拉选择框下拉列表
    dict:{
      type:Object,
      default(){
        return {}
      }
    }
  },
  mounted() {
    
  },
};
</script>

<style lang="less" scoped>
.ssa-form {
  .ant-col {
    margin-bottom: 20px;
  }
  /deep/.ant-form-explain {
    position: absolute;
  }
  /deep/.ant-form-item-label{
    line-height: 32px !important;
  }
  /deep/.ant-form-item-control{
    line-height: 32px !important;
  }
}
</style>
