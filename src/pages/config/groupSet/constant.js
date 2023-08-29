import {wildcardValidate} from '@/utils/web'
/**
 * 表格列配置
* @param key [ 字段唯一值 ]
* @param title [ 列标题 ]
* @param align [ 列标题展示 ]
* @param dataIndex [ 列字段 ]
* @param scopedSlots [ 插槽 ]
*/

export const COLUMNS = [
  {
    dataIndex: 'mapTypeName',
    key: 'mapTypeName',
    align: 'center',
    title: 'Group Name'
  },
  {
    dataIndex: 'mapTypeCode',
    key: 'mapTypeCode',
    align: 'center',
    title: 'Product Id & Step Id'
  },
  {
    dataIndex: 'createdBy',
    key: 'createdBy',
    title: 'Created By',
    align:'center',
  },
  {
    dataIndex: 'createdTm',
    key: 'createdTm',
    title: 'Created Tm',
    align:'center',
  },
  {
    dataIndex: 'updateBy',
    key: 'updateBy',
    title: 'Update By',
    align:'center',
  },
  {
    dataIndex: 'updateTm',
    key: 'updateTm',
    title: 'Update Tm',
    align:'center',
  },
  {
    dataIndex: 'action',
    key: 'action',
    title: 'Action',
    align: 'center',
    width: 120,
    scopedSlots: { customRender: 'action' },
  },
]

/**
 * 表单项配置
* @param colLayout [ 表单每项布局 ]
* @param label [ 表单项名称 ]
* @param field [ 表单字段 ]
* @param type [ 组件类型 ]
* @param rules [ 表单项校验规则 ]
* @param compConfig [ 组件配置项 ]
*/

export const GROUP_SET_FORMITEMS = [
  {
    label: "Group Name",
    field: "groupName",
    type: "input",
    rules: [{ required: true, message: 'Please input Group Name!' }],
  },
  {
    label: "Product Id",
    field: "productId",
    type: "input",
    rules: [{ required: true, message: 'Please input Product Id !' }],
  },
  {
    label: "Step Id",
    field: "stepId",
    type: "input",
    rules: [{ required: true, message: 'Please input Step Id!' }],
  },
  {
    label: "Description",
    field: "remark",
    type: "textarea",
  },
]

export const FORM_CONFIG = {

}

export const PROCESS_SCOPE_COLUMNS = [
  {
    dataIndex: 'productId',
    key: 'productId',
    align: 'center',
    title: 'Product'
  },
  {
    dataIndex: 'stepId',
    key: 'stepId',
    align: 'center',
    title: 'Step'
  },
  {
    dataIndex: 'state',
    key: 'state',
    align: 'center',
    title: 'Is Valid',
    scopedSlots: { customRender: 'valid' },
  },
  {
    dataIndex: 'action',
    key: 'action',
    title: 'Action',
    align: 'center',
    width: 80,
    scopedSlots: { customRender: 'action' },
  },
]
// ^((?!你的正则表达式).)*
export const PROCESS_SCOPE_FORM_ITEMS = [
  {
    colLayout: {},
    label: "Product",
    field: "productId",
    type: "input",
    rules: [{ required: true, message: 'Please input Product!' }, { validator: wildcardValidate, }],
    compConfig: {}
  },
  {
    colLayout: {},
    label: "Step",
    field: "stepId",
    type: "input",
    rules: [{ required: true, message: 'Please input Step!' },{ validator: wildcardValidate, }],
    compConfig: {}
  },
]