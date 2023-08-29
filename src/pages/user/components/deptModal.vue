<template>
  <div>
    <a-modal
      class="dept-modal"
      v-model="visible"
      :title="title"
      @cancel="onClose"
      :maskClosable="false"
      width="600px"
      :bodyStyle="{
        maxHeight: '500px',
        padding: '10px 10px 10px 10px',
        overflow: 'auto',
      }"
    >
      <a-form-model
        ref="ruleForm"
        :model="deptParams"
        :rules="rules"
        :labelCol="{ span: 5 }"
        :wrapperCol="{ span: 17 }"
      >
        <a-form-model-item label="Dept." prop="name">
          <a-input v-model="deptParams.name" />
        </a-form-model-item>

        <a-form-model-item label="Status" prop="isAvailable">
          <a-select v-model="deptParams.isAvailable">
            <a-select-option value="Y">Y</a-select-option>
            <a-select-option value="N">N</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
      <template slot="footer">
        <a-button type="primary" @click="onSave">Save</a-button>
        <a-button @click="onClose">Cancel</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { insertDepartment, updateDepartment } from "../service";
export default {
  data() {
    return {
      title: "Dept.",
      visible: false,
      deptParams: {
        name: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "Please input Activity name",
            trigger: "blur",
          },
        ],
        isAvailable: [
          {
            required: true,
            message: "Please select Status",
            trigger: "change",
          },
        ],
      },
    };
  },

  methods: {
    onShowModal(record) {
      this.title = "Dept.";
      this.visible = true;
      if (record) {
        this.title += " Edit";
        this.deptParams.id = record.id;
        this.deptParams.name = record.name;
        this.deptParams.isAvailable = record.isAvailable;
      } else {
        this.title += " Add";
        delete this.deptParams.id;
        this.deptParams.isAvailable = "Y";
      }
    },

    onClose() {
      this.visible = false;
      this.deptParams.name = "";
      this.$refs.ruleForm.clearValidate();
    },

    onSave() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.deptParams.id) {
            updateDepartment(this.deptParams).then(() => {
              this.$message.success("修改成功!");
              this.onClose();
              this.$emit("getCurent");
            });
          } else {
            insertDepartment(this.deptParams).then(() => {
              this.$message.success("新增成功!");
              this.onClose();
              this.$emit("getCurent");
            });
          }
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.dept-modal {
  /deep/.ant-form-horizontal .ant-form-item:last-child {
    margin-bottom: 24px;
  }
  /deep/.ant-form-explain {
    position: absolute;
  }
}
</style>