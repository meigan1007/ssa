<template>
  <div class="task">
    <!-- 查询区域 -->
    <a-row type="flex" justify="space-between" class="ssa-header">
      <!-- 查询区域 -->
      <a-col :span="6">
        <a-space :size="4">
        <a-button size="small" type="primary" shape="circle" icon="plus" @click="addTask" />
        <a-button size="small" type="info" shape="circle" icon="reload" @click="onReload" />
        </a-space>
      </a-col>
      <a-col :span="18" style="text-align: right">
        <a-space>
          <a-select
            size="small"
            placeholder="Map Type"
            v-model="mapTypeCode"
            style="width: 120px"
            allowClear
            :options="mapTypeOption"
            :showSearch="true"
            :filterOption="
              selectFilterOption
            "
          />
          <a-input
            style="width: 200px"
            size="small"
            placeholder="Please input Model Name"
            v-model="filterContent"
          />
          <a-button size="small" type="primary" @click="onSearch">Search</a-button>
        </a-space>
      </a-col>
    </a-row>
    <a-collapse v-model="activeKey">
      <a-collapse-panel
        v-for="item in collapseList"
        :key="item.mapTypeCode"
        :header="item.mapTypeName + '(' + item.proModelNum + '/' + item.pirModelNum + ')'"
      >
        <a-table
          v-bind="tableConfig"
          :dataSource="item.taskVOList"
        >
          <!-- runningState区域 -->
            <a-tag  slot="runningState" slot-scope="text, record" :color="bgColorMap[record.runningState]" style="color:#000"  >
              {{record.runningState}}
            </a-tag>
          <!-- action操作区域 -->
          <a-space slot="action" slot-scope="text, record">
            <a-tooltip :style="{visibility:record.canPirun == 1 ?'visible' : 'hidden'}">
              <template slot="title"> PIRUN </template>
              <a-button
                :style="pirunStyle"
                @click="onChangePirun(record, item.mapTypeCode)"
                type="primary"
                shape="circle"
                size="small"
              />
            </a-tooltip>
            <a-tooltip :style="{visibility:record.canProduction == 1 ?'visible' : 'hidden'}" >
              <template slot="title"> PRODUCTION </template>
              <a-button
                :style="productionStyle"
                type="primary"
                shape="circle"
                size="small"
                @click="onChangeProduction(record, item.mapTypeCode)"
              />
            </a-tooltip>
            <a-tooltip :style="{visibility:record.canAbort == 1 ?'visible' : 'hidden'}">
              <template slot="title"> ABORT </template>
              <a-button
                :style="aboutStyle"
                @click="onChangeAbort(record)"
                type="primary"
                shape="circle"
                size="small"
              />
            </a-tooltip>
            <a-tooltip>
              <template slot="title"> Log </template>
              <a-button
                type="primary"
                shape="circle"
                size="small"
                icon="unordered-list"
                @click="onLog(record)"
              />
            </a-tooltip>
            <a-tooltip :style="{visibility:record.canRemove == 1 ?'visible' : 'hidden'}">
              <template slot="title"> Delete </template>
              <a-button
                type="danger"
                shape="circle"
                size="small"
                icon="delete"
                @click="onDeleteTask(record)"
              />
            </a-tooltip>
            <a-tooltip :style="{visibility:record.canResultSwitch == 1 ?'visible' : 'hidden'}"
            >
              <template slot="title"> {{record.resultSwitch === 'Y' ? 'All' : 'Only' }} prediction results </template>
              <a-button
                shape="circle"
                size="small"
                :style="{background:record.resultSwitch === 'Y' ? '#1890ff' : 'rgb(217, 218, 217)',borderColor:record.resultSwitch === 'Y' ? '1890ff' : 'rgb(217, 218, 217)'}"
                @click="onChangeResultStatus(record)"
              >
             <span :style="{color:record.resultSwitch === 'Y' ? '#FFF':'#000'} "> all</span>
              </a-button>
            </a-tooltip>
          </a-space>
        </a-table>
      </a-collapse-panel>
      <a-collapse-panel key="matchModel" header="Match Model">
        <a-table v-bind="matchModelTableConfig" :dataSource="matchModelData">
          <a-space slot="action" slot-scope="text, record">
            <a-tooltip v-if="record.runningState === 'RUNNING'">
              <template slot="title"> ABORT </template>
              <a-button
                :style="aboutStyle"
                @click="onChangeMatchAbort(record)"
                type="primary"
                shape="circle"
                size="small"
              />
            </a-tooltip>
            <a-tooltip v-else>
              <template slot="title"> START </template>
              <a-button
                :style="aboutStyle"
                @click="onChangeMatchStart(record)"
                type="primary"
                shape="circle"
                size="small"
              />
            </a-tooltip>
          </a-space>
        </a-table>
      </a-collapse-panel>
    </a-collapse>
    <model-task-modal
      ref="modelTaskModalRef"
      :mapTypeList="mapTypeAllOption"
      @saveModelTask="saveModelTask"
    ></model-task-modal>
    <task-log ref="taskLogRef"></task-log>
  </div>
</template>

<script>
import {selectFilterOption} from '@/utils/web'
import { TASK_COLUMN, MATCH_COLUMN } from "./constant";
import {
  fetchTasks,
  fetchMapTypes,
  fetchAllMapTypes,
  deleteModel,
  bindModel,
  aboutTask,
  pirunTask,
  productionTask,
  fetchTaskMatch,
  matchAbortTask,
  matchStartTask,
  updateResultSwitch
} from "./service";
import ModelTaskModal from "./components/modelTaskModal.vue";
import TaskLog from "./components/taskLog.vue";
export default {
  data() {
    return {
      mapTypeCode: undefined,
      filterContent: "",
      mapTypeOption: [],
      mapTypeAllOption: [],
      activeKey: [],
      collapseList: [],
      selectFilterOption,
      params: {
        filterContent: "",
        mapTypeCode: "",
      },
      tableConfig: {
        bordered: true,
        size: "small",
        rowKey: "modelBindId",
        pagination: false,
        columns: TASK_COLUMN,
        tableLayout: "fixed",
        // style: {
        //   width: "90%",
        // },
        scroll:{
          x:true
        }
      },
      matchModelTableConfig: {
        bordered: true,
        size: "small",
        rowKey: "matchModelName",
        pagination: false,
        columns: MATCH_COLUMN,
        tableLayout: "fixed",
        // style: {
        //   width: "90%",
        // },
      },
      matchModelData: [],
      pirunStyle: {
        borderColor: "#fae0b4",
        backgroundColor: "#fae0b4",
      },
      productionStyle: {
        borderColor: "#71cfcc",
        backgroundColor: "#71cfcc",
      },
      aboutStyle: {
        borderColor: "#d9dad9",
        backgroundColor: "#d9dad9",
      },
      bgColorMap: {
        RUNNING: "#52c41a",
        ERROR: "#f50",
        STOP: "#C4C4C4",
      },
    };
  },
  components: {
    ModelTaskModal,
    TaskLog,
  },
  created() {
    this.getMapTypes();
    this.getAllMapTypes();
    this.getTaskList();
    this.getMacthTool();
  },
  methods: {
    // customRow(record) {
    //   return {
    //     style: {
    //       "background-color": this.bgColorMap[record.runningState],
    //     },
    //   };
    // },
    // 获取mapType列表
    async getMapTypes() {
      const res = await fetchMapTypes();
      this.mapTypeOption = res.map((item) => {
        return {
          value: item.mapTypeCode,
          label: item.mapTypeName,
        };
      });
    },
    // 获取mapType全量列表
    async getAllMapTypes() {
      const res = await fetchAllMapTypes();
      this.mapTypeAllOption = res.map((item) => {
        return {
          value: item.mapTypeCode,
          label: item.mapTypeName,
        };
      });
    },
    // 获取task列表
    async getTaskList() {
      const res = await fetchTasks(this.params);
      const activekey = res.map((item) => item.mapTypeCode);
      this.activeKey = [...activekey, "matchModel"];
      this.collapseList = res;
    },
    async getMacthTool() {
      this.matchModelData = [];
      const { matchModelName, runningState } = await fetchTaskMatch();
      this.matchModelData.push({
        matchModelName,
        runningState,
      });
    },
    async onChangeResultStatus({modelBindId,resultSwitch}){
      await updateResultSwitch({
        modelBindId,
        resultSwitch:resultSwitch === 'Y' ? 'N' :'Y'
       })
       this.getTaskList()
    },
    onChangeMatchAbort({ matchModelName }) {
      this.editMatchStatus({ type: "Abort", matchModelName }, async () => {
        try {
          await matchAbortTask({ matchModelName });
        } catch (error) {
          console.log(error);
        }
        this.getMacthTool();
      });
    },
    onChangeMatchStart({ matchModelName }) {
      this.editMatchStatus({ type: "Start", matchModelName }, async () => {
        try {
          await matchStartTask({ matchModelName });
        } catch (error) {
          console.log(error);
        }
        this.getMacthTool();
      });
    },
    onSearch() {
      this.params.filterContent = this.filterContent;
      this.params.mapTypeCode = this.mapTypeCode ? this.mapTypeCode : "";
      this.getTaskList();
    },
    // 添加任务
    addTask() {
      this.$refs.modelTaskModalRef.initModal();
    },
    async saveModelTask(value) {
      const { mapTypeCode, CLASSIFICATION, RECOGNITION } = value;
      const params = {
        mapTypeCode,
        modelList: [
          {
            modelType: "CLASSIFICATION",
            refModelId: CLASSIFICATION,
          },
          {
            modelType: "RECOGNITION",
            refModelId: RECOGNITION,
          },
        ],
      };
      await bindModel(params);
      this.$refs.modelTaskModalRef.visible = false;
      this.getTaskList();
    },
    onChangePirun({ modelBindId, runningType, models }, mapTypeCode) {
      this.editStatus({ type: "Pirun", models }, async () => {
        try {
          await pirunTask({ modelBindId, runningType, mapTypeCode });
        } catch (error) {
          console.log(error);
        }

        this.getTaskList();
      });
    },
    onChangeProduction({ modelBindId, runningType, models }, mapTypeCode) {
      this.editStatus({ type: "Production", models }, async () => {
        try {
          await productionTask({
            modelBindId,
            runningType,
            mapTypeCode,
          });
        } catch (error) {
          console.log(error);
        }
        this.getTaskList();
      });
    },
    onChangeAbort({ taskId, modelBindId, models }) {
      console.log(taskId);
      this.editStatus({ type: "Abort", models }, async () => {
        try {
          await aboutTask({
            taskId,
            modelBindId,
          });
        } catch (error) {
          console.log(error);
        }
        this.getTaskList();
      });
    },
    editStatus({ type, models }, callback) {
      this.$confirm({
        title: this.formatModalTitle(models),
        content: {
          tag: "div",
          data: {
            style: {
              fontWeight: 600,
              fontSize: "16px",
              color: "#000",
            },
          },
          text: `Are you sure to ${type}?`,
        },
        okText: "Yes",
        okType: "primary",
        cancelText: "No",
        onOk: callback,
        onCancel() {},
      });
    },
    editMatchStatus({ type, matchName }, callback) {
      this.$confirm({
        title: matchName,
        content: {
          tag: "div",
          data: {
            style: {
              fontWeight: 600,
              fontSize: "16px",
              color: "#000",
            },
          },
          text: `Are you sure to ${type}?`,
        },
        okText: "Yes",
        okType: "primary",
        cancelText: "No",
        onOk: callback,
        onCancel() {},
      });
    },
    // 删除当前task
    onDeleteTask({ modelBindId, models }) {
      console.log(models);
      this.$confirm({
        // title: `《strongModel：${classification}-${recognition}`,
        title: this.formatModalTitle(models),
        content: {
          tag: "div",
          data: {
            style: {
              fontWeight: 600,
              fontSize: "16px",
              color: "#000",
            },
          },
          text:
            "Are you sure you want to delete the model task? This operation does not delete the model file.",
        },

        okText: "Yes",
        cancelText: "No",
        okType: "danger",
        onOk: async () => {
          // 发送删除请求
          await deleteModel({ modelBindId });
          this.getTaskList();
        },
        onCancel() {},
      });
    },
    formatModalTitle(models) {
      let classification = "";
      let recognition = "";
      models.forEach((item) => {
        if (item.modelType === "CLASSIFICATION") {
          classification = item.modelName;
        } else if (item.modelType === "RECOGNITION") {
          recognition = item.modelName;
        }
      });
      return {
        tag: "div",
        data: {
          class: "test",
        },
        children: [
          {
            tag: "span",
            data: {
              style: {
                fontWeight: 600,
                fontSize: "20px",
              },
            },
            text: "Model:",
          },
          {
            tag: "span",
            data: {
              style: {
                fontWeight: 400,
                fontSize: "14px",
                color: "rgba(0, 0, 0, 0.65)",
              },
            },
            text: `[${classification}]-[${recognition}]`,
          },
        ],
      };
    },
    onLog({ modelBindId, models }) {
      let classification = "";
      let recognition = "";
      models.forEach((item) => {
        if (item.modelType === "CLASSIFICATION") {
          classification = item.modelName;
        } else if (item.modelType === "RECOGNITION") {
          recognition = item.modelName;
        }
      });
      this.$refs.taskLogRef.initModal(modelBindId, `${classification} -${recognition}`);
    },
    onReload(){
      this.params.filterContent = ""
      this.params.mapTypeCode = ""
      this.filterContent = ""
      this.mapTypeCode = undefined
      this.getTaskList()
      this.getMacthTool()
    }
  },
};
</script>

<style lang="less" scoped>
.task {
  /deep/ tr:hover .ant-table-row-cell-break-word {
    background: inherit !important;
  }
  /deep/ .ant-table.ant-table-small .ant-table-tbody > tr > td {
    white-space: pre-wrap;
  }
}
</style>
