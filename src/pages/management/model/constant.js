
import {selectFilterOption} from '@/utils/web'
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
    dataIndex: 'modelType',
    key: 'modelType',
    align:'center',
    title:'Model Type',
    width:160
  },
  {
    dataIndex: 'modelName',
    key: 'modelName',
    align:'center',
    title:'Model Name',
  },
  {
    dataIndex: 'mapTypeName',
    key: 'mapTypeName',
    align:'center',
    title:'Map Type',
    width:200
  },
  {
    dataIndex: 'modelState',
    key: 'modelState',
    align:'center',
    title:'Model Status',
    width:120
  },
  {
    dataIndex: 'uploadState',
    key: 'uploadState',
    align:'center',
    title:'Upload Status',
    width:120
  },
  {
    dataIndex: 'message',
    key: 'message',
    align:'center',
    title:'Message',
    width:200
  },
  {
    dataIndex: 'action',
    key: 'action',
    title:'Action',
    align:'left',
    width:108,
    scopedSlots: { customRender: 'action' },
  },
]


export const UPLOAD_MODEL_FILE_FORM_ITEMS = [
  {
    colLayout:{},
    label:"Map Type",
    field:"mapTypeCode",
    type:"select",
    rules:[{ required: true, message: 'Please input Map Type!' }],
    compConfig:{
      showSearch:true,
      filterOption:selectFilterOption
    },
  },
  {
    colLayout:{},
    label:"Model Type",
    field:"modelTypeCode",
    type:"select",
    rules:[{ required: true, message: 'Please input Model Type!' }],
    compConfig:{
      showSearch:true,
      filterOption:selectFilterOption
    },
  },
  {
    colLayout:{},
    label:"Remark",
    field:"remark",
    type:"textarea",
  },
  {
    colLayout:{},
    label:"Model Files",
    field:"moduleFiles",
    type:"slot",
    rules:[{ required: true, message: 'Please upload Model Files!' }],
  },
  {
    colLayout:{},
    field:"progress",
    type:"slot",
  }
]

export const EDIT_MODEL_FILE_FORM_ITEMS = [
  {
    label:"Model Name",
    field:"modelName",
    type:"input",
    rules:[{ required: true, message: 'Please input Model Name!' }],
  },
  {
    label:"Remark",
    field:"remark",
    type:"textarea",
  },
]

export const MODEL_TYPE_LIST = [
  {
    label:'Classifiy Model',
    value:'CLASSIFICATION'
  },
  {
    label:'Identity Model',
    value:'RECOGNITION'
  }
]