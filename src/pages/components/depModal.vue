<template>
  <a-modal
    :title="modalTitle"
    class="edit-role"
    :width="1088"
    :visible="modalVisible"
    @ok="onOk"
    @cancel="onCancel"
    destroyOnClose
  >
    <a-row type="flex" justify="space-between">
      <a-col flex="500px">
        <a-form
          layout="inline"
          :form="form"
          style="display: flex; margin-bottom: 8px"
          @submit="onFinish"
        >
          <a-form-item
            name="keyword"
            :style="{ flex: 1 }"
            :wrapperCol="{ span: 24 }"
          >
            <a-input-search
              v-decorator="['paramValue']"
              placeholder="please input keyword"
              enterButton
              @search="onFinish"
            />
          </a-form-item>
        </a-form>
        <a-table
          size="small"
          rowKey="id"
          style="width: 500px"
          :dataSource="getDataSource(permission)"
          :columns="columnsLeft"
          :rowSelection="rowSelection"
        />
      </a-col>
      <a-col flex="40px" class="button-style">
        <a-button
          type="primary"
          icon="step-forward"
          size="small"
          @click="onTransfer"
        />
      </a-col>
      <a-col flex="500px">
        <!-- <a-form
          layout="inline"
          :form="form2"
          style="display: flex; margin-bottom: 8px"
        >
          <a-form-item
            name="keyword"
            :wrapperCol="{ span: 24 }"
            :style="{ flex: 1 }"
          >
            <a-input-search
              v-decorator="[
                'keyword',
                {
                  initialValue: '',
                },
              ]"
              placeholder="input search text"
              enterButton
              @search="onFinish2"
            />
          </a-form-item>
        </a-form> -->

        <a-table
          size="small"
          style="width: 500px; overflow-y: auto; margin-top: 48px"
          rowKey="id"
          :dataSource="permission.filterTarget"
          :columns="columnsRight"
          :pagination="false"
        />
      </a-col>
    </a-row>
  </a-modal>
</template>
<script>
import difference from "lodash/difference";
import { fetchOrg, fetchEmp } from "../service";
const mockData = [];
for (let i = 0; i < 20; i++) {
  mockData.push({
    id: i.toString(),
    name: `content${i + 1}`,
    type: `description of content${i + 1}`,
  });
}

const originTargetKeys = mockData
  .filter((item) => +item.key % 3 > 1)
  .map((item) => item.key);

const leftDepartmentTableColumns = [
  {
    dataIndex: "id",
    title: "ID",
  },
  {
    dataIndex: "name",
    title: "Name",
  },
];
const leftEmployeeTableColumns = [
  {
    dataIndex: "id",
    title: "ID",
  },
  {
    dataIndex: "nickname",
    title: "Name",
    customRender: (text, record) => {
      return record.nickname + "(" + record.personId + ")";
    },
  },
];

export default {
  data() {
    return {
      form: this.$form.createForm(this, { name: "form" }),
      form2: this.$form.createForm(this, { name: "form2" }),
      targetKeys: originTargetKeys,
      disabled: false,
      showSearch: false,
      columnsLeft: [],
      columnsRight: [
        {
          dataIndex: "id",
          title: "ID",
        },
        {
          dataIndex: "name",
          title: "Name",
          customRender: (text, record) => {
            if (this.dataType == "Department") {
              return record.name;
            } else {
              return record.nickname + "(" + record.personId + ")";
            }
          },
        },
        {
          dataIndex: "action",
          customRender: (text, record) => {
            return (
              <a-popconfirm
                title="Do you really want to delete?"
                ok-text="Yes"
                cancel-text="No"
                onConfirm={() => {
                  this.onDeleteTarget(record.id, record.type);
                }}
              >
                <a-button
                  type="danger"
                  shape="circle"
                  icon="delete"
                  size="small"
                />
              </a-popconfirm>
            );
          },
        },
      ],
      dataLeft: [],
      dataRight: [],
      typeOption: [],
      modalVisible: false,
      selectedRowKeys: [],
      rowSelection: {
        selectedRowKeys: [],
        type: "checkbox",
        onChange: (selectedRowKeys) => {
          this.rowSelection.selectedRowKeys = selectedRowKeys;
          this.selectedRowKeys = selectedRowKeys;
        },
      },
      permission: {
        options: [],
        target: [],
        filterTarget: [],
      },
      roleId: "",
      type2: {
        active: "ALL",
        keyword: "",
      },
      params: {
        filters: {
          combineType: "and",
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
        orders: [],
      },
      dataType: "",
    };
  },
  props: {
    modalTitle: {
      type: String,
      default() {
        return "";
      },
    },
  },
  created() {},
  methods: {
    // async getRoleObject() {
    //   const res = await fetchRoleObject();
    //   this.typeOption = res.map((item) => {
    //     return {
    //       label: item.dictLabel,
    //       value: item.dictValue,
    //     };
    //   });
    // },
    initEdit({ ids, dataType }) {
      this.modalVisible = true;
      this.dataType = dataType;
      this.selectedRowKeys = ids;
      this.params.filters.propertyFilters = [
        {
          expression: "",
          values: [],
        },
      ];
      // 如果 dataType是Department 代表部门，请求部门接口
      // 如果 dataType是Employee 代表员工，请求员工接口
      if (dataType == "Department") {
        this.columnsLeft = leftDepartmentTableColumns;
        this.getDepartmentList();
      } else {
        this.columnsLeft = leftEmployeeTableColumns;
        this.getEmployeeList();
      }
    },
    // 获取部门列表
    getDepartmentList() {
      fetchOrg(this.params).then((res) => {
        this.permission.options = res;
        this.onTransfer();
      });
    },
    // 获取员工列表
    getEmployeeList() {
      fetchEmp(this.params).then((res) => {
        this.permission.options = res.map((item) => {
          return {
            id: item.code,
            nickname: item.nickname,
            personId: item.personId,
          };
        });
        this.onTransfer();
      });
    },
    onChange(nextTargetKeys) {
      this.targetKeys = nextTargetKeys;
    },
    triggerDisable(disabled) {
      this.disabled = disabled;
    },

    triggerShowSearch(showSearch) {
      this.showSearch = showSearch;
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
    onFinish() {
      const params = this.form.getFieldsValue();
      this.params.filters.propertyFilters = [
        {
          expression:
            this.dataType == "Department"
              ? "filter_like_name"
              : "filter_like_nickname",
          values: [params.paramValue],
        },
      ];
      if (this.dataType == "Department") {
        this.getDepartmentList();
      } else {
        this.getEmployeeList();
      }
    },
    onFinish2() {
      const { target } = this.permission;
      this.type2 = this.form2.getFieldsValue();
      const { active, keyword } = this.form2.getFieldsValue();
      let _target = JSON.parse(JSON.stringify(target));
      if (active !== "ALL") {
        _target = _target.filter((t) => t.type === active);
      }
      // 关键词过滤
      if (keyword !== "") {
        _target = _target.filter(
          (t) =>
            t.roleObjectMap.displayname.includes(keyword) ||
            `${t.roleObjectMap.id}`.includes(keyword)
        );
      }
      this.permission.filterTarget = _target;
    },
    // 穿梭框点击事件
    onTransfer() {
      if (this.selectedRowKeys.length === 0) {
        return;
      }
      const target = [];
      for (const s of this.selectedRowKeys) {
        for (const p of this.permission.options) {
          if (p.id === s) {
            target.push(p);
          }
        }
      }
      this.selectedRowKeys = [];
      this.rowSelection.selectedRowKeys = [];
      const _target = [...this.permission.target, ...target];
      this.permission = {
        ...this.permission,
        target: _target,
        filterTarget: this.getFilterTarget(_target),
      };
    },
    getFilterTarget(target) {
      const { active, keyword } = this.type2;
      let _target = JSON.parse(JSON.stringify(target));
      if (active !== "ALL") {
        _target = _target.filter((t) => t.type === active);
        // 关键词过滤
      }
      if (keyword !== "") {
        _target = _target.filter(
          (t) =>
            t.roleObjectMap.displayname.includes(keyword) ||
            `${t.roleObjectMap.id}`.includes(keyword)
        );
      }
      return _target;
    },
    getDataSource(permission) {
      const { options, target } = permission;
      const opt = options?.filter((o) => {
        if (target.some((t) => t.type === o.type && t.id === o.id))
          return false;
        return true;
      });
      return opt;
    },
    onDeleteTarget(id, type) {
      const _target = this.permission.target.filter(
        (t) => !(t.id === id && t.type === type)
      );
      const _filterTarget = this.permission.filterTarget.filter(
        (t) => !(t.id === id && t.type === type)
      );
      this.permission = {
        ...this.permission,
        target: _target,
        filterTarget: _filterTarget,
      };
    },
    async onOk() {
      const ids = this.permission.target.map((item) => item.id);
      const label = this.permission.target.map((item) => {
        if (this.dataType == "Department") {
          return item.name;
        } else {
          return item.nickname + "(" + item.personId + ")";
        }
      });
      this.$emit("saveModal", { ids, label });
      // const data = this.permission.target.map((p) => {
      //   return {
      //     roleObjectId: p.id,
      //     roleObjectType: p.type,
      //   };
      // });
      // await updatePermission(this.roleId, data);
      this.onCancel();
    },
    onCancel() {
      this.modalVisible = false;
      this.permission = {
        options: [],
        target: [],
        filterTarget: [],
      };
    },
  },
};
</script>
<style lang="less" scoped>
.button-style {
  display: flex;
  justify-content: center;
  align-items: center;
}
.ant-form-inline {
  /deep/ .ant-form-item:last-child {
    margin-right: 0;
  }
}

.edit-role {
  /deep/ .ant-table-small {
    height: 292px;
    overflow-y: auto;
  }
}
</style>
