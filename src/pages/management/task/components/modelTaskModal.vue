<template>
  <a-modal
    title="Add Model Task"
    v-model="visible"
    :width="600"
    @ok="handleOk"
    okText="save"
    @cancel="handleCancel"
  >
    <ssa-form
      ref="ssaFormRef"
      :formItems="formItems"
      :dict="dict"
      @formValueChange="formValueChange"
    ></ssa-form>
  </a-modal>
</template>

<script>
import SsaForm from "@/components/ssaForm";
import { MODEL_TASK_FORM_ITEMS } from "../constant";
import { modelMapTypes } from "../service";
export default {
  name: "modelTaskModal",
  data() {
    return {
      visible: false,
      formItems: MODEL_TASK_FORM_ITEMS,
      dict: {
        mapTypeCode: [],
        CLASSIFICATION: [],
        RECOGNITION: [],
      },
    };
  },
  props: {
    mapTypeList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: {
    SsaForm,
  },
  methods: {
    // modalType 弹框类型 add/edit
    // initValue 弹框类型 表单初始值
    initModal() {
      this.visible = true;
      this.dict.mapTypeCode = this.mapTypeList;
      this.$nextTick(() => {
        this.$refs.ssaFormRef.form.setFieldsValue({});
      });
    },
    handleOk() {
      this.$refs.ssaFormRef.form.validateFields((err, values) => {
        if (err) return;
        this.$emit("saveModelTask", values);
      });
    },
    // 关闭弹框
    handleCancel() {
      this.visible = false;
      this.$refs.ssaFormRef.form.resetFields();
    },
    async formValueChange(value) {
      // mapTypeCode 发生变化
      if (value.mapTypeCode) {
        this.dict.CLASSIFICATION = [];
        this.dict.RECOGNITION = [];
        // 1:重新获取列表
        const res = await modelMapTypes({
          mapTypeCode: value.mapTypeCode,
          modelType: "",
        });
        console.log(res);
        res.forEach((item) => {
          this.dict[item.modelType] = item.models.map((item) => {
            return {
              label: item.modelName,
              value: item.id,
            };
          });
        });
        // 2:分类和处理清空
        this.$refs.ssaFormRef.form.setFieldsValue({
          CLASSIFICATION: undefined,
          RECOGNITION: undefined,
        });
      }
    },
  },
};
</script>

<style lang="less" scoped></style>
