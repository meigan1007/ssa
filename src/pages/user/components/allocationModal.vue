<template>
  <div>
    <a-modal
      v-model="visible"
      :title="type === 'ORG' ? 'Organization' : 'Employees'"
      @cancel="onClose"
      :maskClosable="false"
      width="800px"
      :bodyStyle="{
        maxHeight: '500px',
        padding: '0px 10px 10px 10px',
        overflow: 'auto',
      }"
    >
      <a-form-model
        :model="form"
        :labelCol="{ span: 6 }"
        :wrapperCol="{ span: 16 }"
      >
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="Dept.">
              <a-input disabled v-model="form.name" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-transfer
          :data-source="mockData"
          :titles="['未分配', '已分配']"
          :target-keys="targetKeys"
          :disabled="disabled"
          :show-search="showSearch"
          :filter-option="
            (inputValue, item) => item.name.indexOf(inputValue) !== -1
          "
          :show-select-all="false"
          @change="onChange"
        >
          <template
            slot="children"
            slot-scope="{
              props: {
                direction,
                filteredItems,
                selectedKeys,
                disabled: listDisabled,
              },
              on: { itemSelectAll, itemSelect },
            }"
          >
            <a-table
              :row-selection="
                getRowSelection({
                  disabled: listDisabled,
                  selectedKeys,
                  itemSelectAll,
                  itemSelect,
                })
              "
              :columns="direction === 'left' ? leftColumns : rightColumns"
              :data-source="filteredItems"
              size="small"
              :scroll="{ y: 210 }"
              :style="{ pointerEvents: listDisabled ? 'none' : null }"
              :custom-row="
                ({ key, disabled: itemDisabled }) => ({
                  on: {
                    click: () => {
                      if (itemDisabled || listDisabled) return;
                      itemSelect(key, !selectedKeys.includes(key));
                    },
                  },
                })
              "
            />
          </template>
        </a-transfer>
      </a-form-model>
      <template slot="footer">
        <a-button
          v-if="
            (type === 'ORG' &&
              authority('hha:thirdpartUser:department:saveDeptOrg')) ||
            (type === 'EMP' &&
              authority('hha:thirdpartUser:department:saveDeptEmpolyee'))
          "
          type="primary"
          @click="onSave"
          >Save</a-button
        >

        <a-button @click="onClose">Cancel</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { authority } from "@/utils/web";
import difference from "lodash/difference";
import {
  fetchOrganization,
  fetchEmployee,
  fetchAllocation,
  insertAllocation,
} from "../service";
export default {
  data() {
    return {
      authority,
      mockData: [],
      targetKeys: [],
      disabled: false,
      showSearch: true,
      leftColumns: [
        {
          title: "Name",
          dataIndex: "name",
        },
      ],
      rightColumns: [
        {
          title: "Name",
          dataIndex: "name",
        },
      ],
      visible: false,
      record: {},
      type: "",
      form: { name: "" },
      params: {
        filters: {
          combineType: "",
          combinedFilters: [
            {
              combineType: "",
              combinedFilters: [{}],
              propertyFilters: [
                {
                  expression: "",
                  values: [],
                },
              ],
            },
          ],
          propertyFilters: [
            {
              expression: "",
              values: [],
            },
          ],
        },
        orders: [
          // {
          //   field: "",
          //   type: "",
          // },
        ],
      },
    };
  },

  methods: {
    onShowModal(record, type) {
      this.record = record;
      this.type = type;
      this.form.name = record.name;
      this.mockData = [];
      this.targetKeys = [];
      this.visible = true;
      this.getAllocation(true);
    },

    // 获取已分配组织、员工数据
    async getAllocation(e) {
      const res = await fetchAllocation({
        deptId: this.record.id,
        type: this.type,
      });
      const newArr = [];
      let targetKeys = []; // 收集已分配id
      res.forEach((item) => {
        if (item.members) {
          newArr.push({
            key:
              this.type === "ORG"
                ? item.members.departmentId
                : item.members.code,
            name: item.members.name || item.members.nickname,
            disabled: false,
          });
          targetKeys.push(
            this.type === "ORG"
              ? item.members.departmentId
              : item.members.code
          );
        }
      });

      if (e) this.targetKeys = targetKeys;
      this.getUndistributed(newArr, this.targetKeys);
    },

    // 获取未分配组织、员工
    async getUndistributed(newArr, targetKeys) {
      const api = this.type === "ORG" ? fetchOrganization : fetchEmployee;
      const res = await api(
        {
          pageNo: 1,
          pageSize: 100000,
        },
        this.params
      );
      let arr = [];
      // 过滤掉已分配数据
      res.list.forEach((item) => {
        if (!targetKeys.includes(item.departmentId)) {
          arr.push({
            key: this.type === "ORG" ? item.departmentId : item.code,
            name: item.name || item.nickname,
            disabled: false,
          });
        }
      });
      // 未分配合并已分配数据（避免重复数据）
      this.mockData = [...arr, ...newArr];
      this.targetKeys = targetKeys || [];
    },

    onChange(nextTargetKeys) {
      this.targetKeys = nextTargetKeys;
    },

    onClose() {
      this.visible = false;
    },

    async onSave() {
      const params = {
        deptId: this.record.id,
        memberList: [],
        type: this.type,
      };
      this.targetKeys.forEach((item) => {
        params.memberList.push(item);
      });
      const res = await insertAllocation(params);
      this.$message.success("分配成功");
      this.onClose();
    },

    getRowSelection({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
      return {
        getCheckboxProps: (item) => ({
          props: { disabled: disabled || item.disabled },
        }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter((item) => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, selectedKeys)
            : difference(selectedKeys, treeSelectedKeys);
          itemSelectAll(diffKeys, selected);
        },
        onSelect({ key }, selected) {
          itemSelect(key, selected);
        },
        selectedRowKeys: selectedKeys,
      };
    },
  },
};
</script>
<style lang="less" scoped>
</style>