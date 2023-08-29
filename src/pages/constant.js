/**
 * 左侧菜单
 * @param key [ 字段唯一值 ]
 * @param title [ 菜单标题 ]
 * @param auth [ 权限字段 ]
 * @param pages [ 是否嵌套子节点 ]
 * @param icon [ 菜单icon ]
 */

export const MENU = [
  {
    key: "management",
    title: "Management",
    icon: "robot",
    auth:'ssa:management:view',
    pages: [
      {
        key: "model",
        title: "Model List",
        icon: "robot",
        auth: "ssa:modelList:view",
      },
      {
        key: "task",
        title: "Task List",
        icon: "robot",
        auth: "ssa:taskList:view",
      },
    ],
  },
  {
    key:"defect",
    title:"Defect",
    
  },
  {
    key: "config",
    title: "Config",
    icon: "setting",
    auth:'ssa:config:view',
    pages: [
      {
        key: "defectType",
        title: "Defect Type",
        icon: "setting",
        auth: "ssa:mapType:view",
      },
      {
        key: "groupSet",
        title: "Group Set",
        icon: "setting",
        auth: "ssa:mapType:view",
      },
    ],
  },
];

/**
 * 菜单对应页面映射
 * @param key [ 字段唯一值/页面路径 ]
 * @param title [ tabs标题 ]
 * @param closable [ 是否带有关闭功能 ]
 * @param component [ 组件 ]
 */

export const PAGES = [
  {
    key: "/home",
    title: "Home",
    closable: false,
    component: () => import("@/pages/home"),
  },
  {
    key: "/management/model",
    title: "Model List",
    icon: "robot",
    auth: "ssa:modelList:view",
    component: () => import("@/pages/management/model"),
  },
  {
    key: "/management/task",
    title: "Task List",
    icon: "robot",
    auth: "ssa:taskList:view",
    component: () => import("@/pages/management/task"),
  },
  {
    key: "/config/defectType",
    title: "Defect Type",
    icon: "setting",
    auth: "ssa:mapType:view",
    component: () => import("@/pages/config/mapType"),
  },
  {
    key: "/config/groupSet",
    title: "Group Set",
    icon: "setting",
    auth: "ssa:mapType:view",
    component: () => import("@/pages/config/groupSet"),
  },
  {
    key: "/defect",
    title: "Defect",
    icon: "setting",
    auth: "ssa:mapType:view",
    component: () => import("@/pages/defect"),
  },
];
