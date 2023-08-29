export const MOCK = {
  productId: [
    {
      id: "AAA10",
      name: "AAA10",
    },
    {
      id: "AAA11",
      name: "AAA11",
    },
    {
      id: "AAA12",
      name: "AAA12",
    },
  ],
  stepId: [
    {
      id: "AAA10",
      name: "AAA10",
    },
    {
      id: "AAA11",
      name: "AAA11",
    },
    {
      id: "AAA12",
      name: "AAA12",
    },
  ],
  lotId: [
    {
      id: "AAA10",
      name: "AAA10",
    },
    {
      id: "AAA11",
      name: "AAA11",
    },
    {
      id: "AAA12",
      name: "AAA12",
    },
  ],
  waferId: [
    {
      id: "AAA10",
      name: "AAA10",
    },
    {
      id: "AAA11",
      name: "AAA11",
    },
    {
      id: "AAA12",
      name: "AAA12",
    },
  ],
  groupId: [
    {
      id: "AAA10",
      name: "AAA10",
    },
    {
      id: "AAA11",
      name: "AAA11",
    },
    {
      id: "AAA12",
      name: "AAA12",
    },
  ],
  moduleName: [
    {
      id: "AAA10",
      name: "AAA10",
    },
    {
      id: "AAA11",
      name: "AAA11",
    },
    {
      id: "AAA12",
      name: "AAA12",
    },
  ],
};

export const DICT = {
  groupBy: [{ label: "Product ID + Step ID", value: "1" }],
  dataStatus: [
    {label:'All',value:'all'},
    {label:'Untreated',value:'untreated'},
    { label: "Treated", value: "treated" }
  ],
  modelStatus: [
    { label: "All", value: "all" },
    { label: "Production", value: "production" },
    { label: "Pirun", value: "pirun" },
  ],
  defectTypeFilter: [
    { label: "No Defect", value: "1" },
    { label: "1:气泡", value: "2" },
    { label: "2:划伤", value: "3" },
    { label: "3:particle", value: "4" },
    { label: "4:水痕", value: "5" },
  ],
  defectType: [
    { label: "All", value: "all" },
    { label: "True", value: "true" },
    { label: "False", value: "false" },
  ],
  switchPicture:[
    {label:1,value:1},
    {label:2,value:2},
    {label:3,value:3},
    {label:4,value:4},
    {label:5,value:5},
    {label:6,value:6},
    {label:7,value:7},
    {label:8,value:8},
    {label:9,value:9},
    {label:10,value:10}
  ],
  moduleName: [{ label: "All", value: "1" }],
  labelSize: [
    { label: 12, value: 12 },
    { label: 14, value: 14 },
    { label: 16, value: 16 },
    { label: 18, value: 18 }
  ],
  column:[
    { label: 3, value: 3 },
    { label: 4, value: 4 },
    { label: 5, value: 5 },
    { label: 6, value: 6 }
  ]
};

export const DATA_BY = [{ label: "Product ID + Step ID", value: "1" }];

export const FORM_CONFIG = {
  labelCol: { span: 7 },
  wrapperCol: { span: 16 },
};

export const FORM_ITEMS = [
  {
    field: "groupBy",
    label: "Group By",
    type: "select",
    compConfig: {
      size: "small",
    },
    formLayout: {
      labelAlign: "left",
    },
    // colStyle: {
    //   "margin-bottom": "10px",
    // },
  },
  {
    field: "dataStatus",
    label: "数据状态",
    type: "select",
    compConfig: {
      size: "small",
    },
    formLayout: {
      labelAlign: "left",
    },
    // colStyle: {
    //   "margin-bottom": "10px",
    // },
  },
  {
    field: "modelStatus",
    label: "数据被处理时模型状态",
    type: "select",
    compConfig: {
      size: "small",
    },
    formLayout: {
      labelAlign: "left",
    },
  },
  {
    field: "defectTypeFilter",
    label: "Defect Type Filter",
    type: "checkbox",
    compConfig: {
      size: "small",
    },
    formLayout: {
      labelAlign: "left",
    },
  },
  {
    field: "defectType",
    label: "Defect Type",
    type: "radio",
    compConfig: {
      size: "small",
    },
    formLayout: {
      labelAlign: "left",
    },
  },
  {
    field: "switchPicture",
    label: "Switch Picture",
    type: "select",
    compConfig: {
      size: "small",
    },
    formLayout: {
      labelAlign: "left",
    },
  },
  {
    field: "moduleName",
    label: "Module Name",
    type: "select",
    compConfig: {
      size: "small",
      mode: "multiple",
    },
    formLayout: {
      labelAlign: "left",
    },
  },
  {
    field: "column",
    label: "Column",
    type: "select",
    compConfig: {
      size: "small",
    },
    formLayout: {
      labelAlign: "left",
    },
  },
  {
    field: "showLabel",
    label: "Show Label",
    type: "switch",
    compConfig: {
      size: "small",
    },
    formLayout: {
      labelAlign: "left",
    },
  },
  {
    field: "bundle",
    label: "Bundle",
    type: "switch",
    compConfig: {
      size: "small",
    },
    formLayout: {
      labelAlign: "left",
    },
  },
  {
    field: "labelSize",
    label: "Label Size",
    type: "select",
    compConfig: {
      size: "small",
    },
    formLayout: {
      labelAlign: "left",
    },
  },
];

export const DEFAULT_CHART_OPTION = {
  tooltip: {
    show: false,
  },
  legend: {
    show: false,
  },
  grid: {
    left: "2%",
    right: "10%",
    bottom: "5%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    name: "Product Id",
    axisLine: {
      symbol: ["none", "triangle"],
      symbolOffset: [0, 5],
    },
    nameTextStyle: {
      align:'center',
      lineHeight:20,
      verticalAlign:'bottom'
    },
    axisTick: {
      show: false,
    },
    data: ["P1 S1", "P1 S2", "P2 S2", "P4 S4"],
  },
  yAxis: {
    type: "value",
    name: "Defect Count",
    axisLine: {
      show: true,
      symbol: ["none", "triangle"],
      symbolOffset: [0, 5],
    },
    nameTextStyle: {
      lineHeight: 30,
      align:'left',
    },
    axisLabel: {
      show: false,
    },
    splitLine: {
      show: false,
    },
  },
  color:['#e99e42','#fdff54','#7715f5','#a9f04b','#c72b2a','#4aa5ea'],
  series: [
    {
      name: "埋尘",
      type: "bar",
      stack: "Ad",
      barWidth: 25,
      emphasis: {
        focus: "series",
      },
      data: [
        0,
        0,
        {
          value: 40,
          label: {
            show: true,
            formatter: "埋\n尘",
            color:'#333'
          },
        },
        0,
      ],
    },
    {
      name: "气泡",
      type: "bar",
      stack: "Ad",
      emphasis: {
        focus: "series",
      },
      barWidth: 25,
      data: [
        {
          value: 30,
          label: {
            show: true,
            formatter: "气\n泡",
            color:'#333'
          },
        },
        0,
        {
          value: 30,
          label: {
            show: true,
            formatter: "气\n泡",
            color:'#333'
          },
        },
        0,
      ],
    },
    {
      name: "油脂",
      type: "bar",
      stack: "Ad",
      emphasis: {
        focus: "series",
      },
      barWidth: 25,
      data: [
        {
          value: 30,
          label: {
            show: true,
            formatter: "油\n脂",
            color:'#fff'
          },
        },
        0,
        0,
        0,
      ],
    },
    {
      name: "残留物",
      type: "bar",
      stack: "Ad",
      barWidth: 25,
      emphasis: {
        focus: "series",
      },
      data: [
        0,
        {
          value: 40,
          label: {
            show: true,
            formatter: "残\n留\n物",
            color:'#333'
          },
        },
        0,
        0,
      ],
    },
    {
      name: "划伤",
      type: "bar",
      stack: "Ad",
      barWidth: 25,
      emphasis: {
        focus: "series",
      },
      data: [
        0,
        {
          value: 30,
          label: {
            show: true,
            formatter: "划\n伤",
            color:'#333'
          },
        },
        0,
        0,
      ],
    },
    {
      name: "水痕",
      type: "bar",
      stack: "Ad",
      barWidth: 25,
      emphasis: {
        focus: "series",
      },
      data: [
        0,
        0,
        0,
        {
          value: 80,
          label: {
            show: true,
            formatter: "水\n痕",
            color:'#333'
          },
        },
      ],
    },
  ],
};

export const DEFAULT_CHART_1_OPTION = {
  legend: {
    show: false,
  },
  tooltip: {
    show: false,
  },
  grid: {
    left: "2%",
    right: "15%",
    bottom: "5%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    name: "Defect Type",
    nameTextStyle: {
      align:'center',
      lineHeight:20,
      verticalAlign:'bottom'
    },
    axisLine: {
      symbol: ["none", "triangle"],
      symbolOffset: [0, 5],
    },
    axisTick: {
      show: false,
    },
    data: ["气泡", "划伤", "particle", "水痕"],
  },
  yAxis: {
    type: "value",
    name: "Defect Count",
    nameTextStyle: {
      lineHeight: 30,
      align:'left',
    },
    axisLine: {
      show: true,
      symbol: ["none", "triangle"],
      symbolOffset: [0, 5],
    },
    axisLabel: {
      show: false,
    },
    splitLine: {
      show: false,
    },
  },
  color:['#fdff54','#aaf14b','#fdff54','#4aa5eb',],
  series: [
    {
      name: "P1S1",
      type: "bar",
      stack: "Ad",
      emphasis: {
        focus: "series",
      },
      barWidth: 25,
      data: [
        {
          value: 25,
          label: {
            show: true,
            formatter: "p1\ns1",
          },
        },
        0,
        0,
        0,
      ],
      markPoint: {
        data: [
          {
            coord: [0, 50],
            value: "60(38.46%)",
            symbol: "rect",
            symbolOffset: [0, -10],
            itemStyle: {
              color: "#fff",
            },
            symbolSize: [60, 20],
            label: {
              color: "#333",
              height: 20,
            },
          },
          {
            coord: [1, 25],
            value: "25(19.23%)",
            symbol: "rect",
            symbolOffset: [0, -10],
            itemStyle: {
              color: "#fff",
            },
            symbolSize: [60, 20],
            label: {
              color: "#333",
              height: 20,
            },
          },
          {
            coord: [2, 25],
            name: "diyi",
            value: "25(19.23%)",
            symbol: "rect",
            symbolOffset: [0, -10],
            itemStyle: {
              color: "#fff",
            },
            symbolSize: [60, 20],
            label: {
              color: "#333",
              height: 20,
            },
          },
          {
            coord: [3, 30],
            name: "diyi",
            value: "30(23.08%)",
            symbol: "rect",
            symbolOffset: [0, -10],
            itemStyle: {
              color: "#fff",
            },
            symbolSize: [60, 20],
            label: {
              color: "#333",
              height: 20,
            },
          },
        ],
      },
    },
    {
      name: "P2S2",
      type: "bar",
      stack: "Ad",
      emphasis: {
        focus: "series",
      },
      barWidth: 25,
      data: [
        {
          value: 25,
          label: {
            show: true,
            formatter: "p2\ns2",
          },
        },
        0,
        0,
        0,
      ],
    },
    {
      name: "P1S2",
      type: "bar",
      stack: "Ad",
      barWidth: 25,
      emphasis: {
        focus: "series",
      },
      data: [
        0,
        {
          value: 25,
          label: {
            show: true,
            formatter: "p1\ns2",
          },
        },
        0,
        0,
      ],
    },
    {
      name: "P2S2",
      type: "bar",
      stack: "Ad",
      barWidth: 25,
      emphasis: {
        focus: "series",
      },
      data: [
        0,
        0,
        {
          value: 25,
          label: {
            show: true,
            formatter: "p2\ns2",
          },
        },
        0,
      ],
    },
    {
      name: "P4S4",
      type: "bar",
      stack: "Ad",
      barWidth: 25,
      emphasis: {
        focus: "series",
      },
      data: [
        0,
        0,
        0,
        {
          value: 30,
          label: {
            show: true,
            formatter: "p4\ns4",
          },
        },
      ],
    },
  ],
};

export const ROW_DATA_TYPE = [
  {
    label: "By Defect",
    value: "1",
  },
  {
    label: "By Product ID",
    value: "2",
  },
];

export const DEFECT_TABLE_COLUMN = [
  {
    title: "Defect Type",
    dataIndex: "defectType",
    key: "defectType",
    align: "center",
  },
  {
    title: "总数",
    dataIndex: "total",
    key: "total",
    align: "center",
  },
  {
    title: "true",
    dataIndex: "true",
    key: "true",
    align: "center",
  },
  {
    title: "false",
    dataIndex: "false",
    key: "false",
    align: "center",
  },
  {
    title: "Max Product",
    dataIndex: "maxProduct",
    key: "maxProduct",
    align: "center",
  },
  {
    title: "Max Step",
    dataIndex: "maxStep",
    key: "maxStep",
    align: "center",
  },
];

export const DEFECT_DATA = [
  {
    defectType: "油滴",
    total: "100",
    true: "50",
    false: "50",
    maxProduct: "H0025",
    maxStep: "SAW",
  },
  {
    defectType: "划伤",
    total: "200",
    true: "180",
    false: "20",
    maxProduct: "H0026",
    maxStep: "CMP",
  },
  {
    defectType: "微粒",
    total: "300",
    true: "200",
    false: "100",
    maxProduct: "H0025",
    maxStep: "CMP",
  },
  {
    defectType: "微粒",
    total: "300",
    true: "200",
    false: "100",
    maxProduct: "H0025",
    maxStep: "CMP",
  },
  {
    defectType: "微粒",
    total: "300",
    true: "200",
    false: "100",
    maxProduct: "H0025",
    maxStep: "CMP",
  },
  {
    defectType: "微粒",
    total: "300",
    true: "200",
    false: "100",
    maxProduct: "H0025",
    maxStep: "CMP",
  },
  {
    defectType: "微粒",
    total: "300",
    true: "200",
    false: "100",
    maxProduct: "H0025",
    maxStep: "CMP",
  },
];

export const PRODUCT_TABLE_COLUMN = [
  {
    title: "Product ID",
    dataIndex: "productId",
    key: "productId",
    align: "center",
  },
  {
    title: "油滴(总数/True/False)",
    align: "center",
    children: [
      {
        title: "总数",
        dataIndex: "youdiTotal",
        key: "youdiTotal",
        align: "center",
      },
      {
        title: "True",
        dataIndex: "youdiTrue",
        key: "youdiTrue",
        align: "center",
      },
      {
        title: "False",
        dataIndex: "youdiFalse",
        key: "youdiFalse",
        align: "center",
      },
    ],
  },
  {
    title: "划伤(总数/True/False)",
    align: "center",
    children: [
      {
        title: "总数",
        dataIndex: "huashangTotal",
        key: "huashangTotal",
        align: "center",
      },
      {
        title: "True",
        dataIndex: "huashangTrue",
        key: "huashangTrue",
        align: "center",
      },
      {
        title: "False",
        dataIndex: "huashangFalse",
        key: "huashangFalse",
        align: "center",
      },
    ],
  },
  {
    title: "微粒(总数/True/False)",
    align: "center",
    children: [
      {
        title: "总数",
        dataIndex: "weiliTotal",
        key: "weiliTotal",
        align: "center",
      },
      {
        title: "True",
        dataIndex: "weiliTrue",
        key: "weiliTrue",
        align: "center",
      },
      {
        title: "False",
        dataIndex: "weiliFalse",
        key: "weiliFalse",
        align: "center",
      },
    ],
  },
];

export const PRODUCT_DATA = [
  {
    productId: "H0025",
    youdiTotal: 80,
    youdiTrue: 70,
    youdiFalse: 10,
    huashangTotal: 90,
    huashangTrue: 70,
    huashangFalse: 20,
    weiliTotal: 200,
    weiliTrue: 200,
    weiliFalse: 0,
  },
  {
    productId: "H0026",
    youdiTotal: 20,
    youdiTrue: 20,
    youdiFalse: 0,
    huashangTotal: 110,
    huashangTrue: 100,
    huashangFalse: 10,
    weiliTotal: 100,
    weiliTrue: 50,
    weiliFalse: 50,
  },
  {
    productId: "H0026",
    youdiTotal: 20,
    youdiTrue: 20,
    youdiFalse: 0,
    huashangTotal: 110,
    huashangTrue: 100,
    huashangFalse: 10,
    weiliTotal: 100,
    weiliTrue: 50,
    weiliFalse: 50,
  },
  {
    productId: "H0026",
    youdiTotal: 20,
    youdiTrue: 20,
    youdiFalse: 0,
    huashangTotal: 110,
    huashangTrue: 100,
    huashangFalse: 10,
    weiliTotal: 100,
    weiliTrue: 50,
    weiliFalse: 50,
  },
  {
    productId: "H0026",
    youdiTotal: 20,
    youdiTrue: 20,
    youdiFalse: 0,
    huashangTotal: 110,
    huashangTrue: 100,
    huashangFalse: 10,
    weiliTotal: 100,
    weiliTrue: 50,
    weiliFalse: 50,
  },
  {
    productId: "H0026",
    youdiTotal: 20,
    youdiTrue: 20,
    youdiFalse: 0,
    huashangTotal: 110,
    huashangTrue: 100,
    huashangFalse: 10,
    weiliTotal: 100,
    weiliTrue: 50,
    weiliFalse: 50,
  },
  {
    productId: "H0026",
    youdiTotal: 20,
    youdiTrue: 20,
    youdiFalse: 0,
    huashangTotal: 110,
    huashangTrue: 100,
    huashangFalse: 10,
    weiliTotal: 100,
    weiliTrue: 50,
    weiliFalse: 50,
  },
];




// search defect 
export const DATE_TYPE = [
  {label:'Hours',value:'hour'},
  {label:'Days',value:'day'},
  {label:'Weeks',value:'week'},
  {label:'Months',value:'month'},
  {label:'Full Days',value:'fullDays'},
  {label:'Full Weeks',value:'fullWeeks'},
  {label:'Full Months',value:'fullMonths'}
]

export const SEARCH_FIELD = [
  { label: 'Product Id', value: 'productId' },
  { label: 'Step Id', value: 'stepId' },
  { label: 'Lot Id', value: 'lotId' },
  { label: 'Wafer Id', value: 'waferId' },
  { label: 'Group Id', value: 'groupId' },
  { label: 'Module Name', value: 'moduleName' },
]

export const DATE_TYPE_MAP = {
  'days':30,
  'weeks':53,
  'month':12,
  'fullDays':30,
  'fullWeeks':53,
  'fullMonth':12
}