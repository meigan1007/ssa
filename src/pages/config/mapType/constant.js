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
    title: 'Defect Name'
  },
  {
    dataIndex: 'mapTypeCode',
    key: 'mapTypeCode',
    align: 'center',
    title: 'Defect Code'
  },
  {
    dataIndex: 'createTm',
    key: 'createTm',
    title: 'Update Time',
    align:'center',
  },
  {
    dataIndex: 'matchTool',
    key: 'matchTool',
    title: 'Is Available',
    align:'center',
    scopedSlots: { customRender: 'matchTool' },
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

export const MAP_TYPE_SET_FORM_ITEMS = [
  {
    colLayout: {},
    label: "Map Type Name",
    field: "mapTypeName",
    type: "input",
    rules: [{ required: true, message: 'Please input Map Type Name!' }],
    compConfig: {}
  },
  {
    colLayout: {},
    label: "Map Type Code",
    field: "mapTypeCode",
    type: "input",
    rules: [{ required: true, message: 'Please input Map Type Code!' }],
    // rules:"",
    compConfig: {}
  },
  {
    colLayout: {},
    label: "Description",
    field: "remark",
    type: "textarea",
    // rules:"",
    compConfig: {}
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