import {selectFilterOption} from '@/utils/web'

export const TASK_COLUMN = [
  {
    dataIndex: 'models',
    key: 'models',
    align:'center',
    title:'分类模型',
    customRender:(text,record) => {
      let classification = ''
      record.models.forEach(item => {
        if(item.modelType === 'CLASSIFICATION'){
          classification = item.modelName
        }
      })
      return classification
    }
  },
  {
    dataIndex: 'models1',
    key: 'models1',
    align:'center',
    title:'处理模型',
    customRender:(text,record) => {
      let recognition = ''
      record.models.forEach(item => {
        if(item.modelType === 'RECOGNITION'){
          recognition = item.modelName
        }
      })
      return recognition
    }
  },
  {
    dataIndex: 'modelState',
    key: 'modelState',
    align:'center',
    title:'Model Status',
    width:100,
  },
  {
    dataIndex: 'runningState',
    key: 'runningState',
    align:'center',
    title:'Running Status',
    width:100,
    scopedSlots: { customRender: 'runningState' },
  },
  {
    dataIndex: 'action',
    key: 'action',
    align:'center',
    title:'Action',
    width:200,
    scopedSlots: { customRender: 'action' },
  },
]
export const MATCH_COLUMN = [
  {
    dataIndex: 'matchModelName',
    key: 'matchModelName',
    align:'center',
    title:'Model Name',
    width:'40%',
  },
  {
    dataIndex: 'runningState',
    key: 'runningState',
    align:'center',
    title:'Running Status(Stop/Running/Error)',
    width:'40%',
  },
  {
    dataIndex: 'action',
    key: 'action',
    align:'center',
    title:'Action(Log)',
    width:'20%',
    scopedSlots: { customRender: 'action' },
  },
]

export const MODEL_TASK_FORM_ITEMS = [
  {
    colLayout:{

    },
    formLayout:{

    },
    label:"Map Type",
    field:"mapTypeCode",
    type:"select",
    rules:[{ required: true, message: 'Please select Map Type!' }],
    compConfig:{
      showSearch:true,
      filterOption:selectFilterOption
    },
  },
  {
    colLayout:{},
    label:"分类模型",
    field:"CLASSIFICATION",
    type:"select",
    rules:[{ required: true, message: 'Please select 分类模型!' }],
    compConfig:{
      showSearch:true,
      filterOption:selectFilterOption
    },
  },
  {
    colLayout:{},
    label:"处理模型",
    field:"RECOGNITION",
    type:"select",
    rules:[{ required: true, message: 'Please select 处理模型!' }],
    compConfig:{
      showSearch:true,
      filterOption:selectFilterOption
    },
  },
]

export const LOG_COLUMN = [
  {
    dataIndex: 'taskId',
    key: 'taskId',
    align:'center',
    title:'Task ID',
    width:"15%",
  },
  {
    dataIndex: 'actionType',
    key: 'actionType',
    align:'center',
    title:'活动状态',
    width:"15%"
  },
  {
    dataIndex: 'actionTm',
    key: 'actionTm',
    align:'center',
    title:'活动时间',
    width:"15%"
  },
  {
    dataIndex: 'message',
    key: 'message',
    align:'left',
    title:'信息',
    width:"55%"
  },
]  