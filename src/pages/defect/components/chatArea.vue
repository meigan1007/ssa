<template>
    <div style="width:100%;padding:8px">
        <a-button
        class="filter"
        type="primary"
        shape="circle"
        icon="filter"
        @click="showModal"
        />
        <a-space direction="vertical" style="width:100%;margin-top:24px" :size="4">
        <base-chart height="350px" :options="DEFAULT_CHART_OPTION"></base-chart>
        <a-space>
            Data By: 
            <a-select :options="DATA_BY" v-model="dataBy" style="width: 250px"  />
        </a-space>
        <a-space>是否联动: <a-checkbox ></a-checkbox></a-space>
        <base-chart height="350px" :options="DEFAULT_CHART_1_OPTION"></base-chart>
        </a-space>
        <chart-form-modal ref="chartFormRef" @submitForm="submitForm"></chart-form-modal>
    </div>
</template>

<script >
import { DEFAULT_CHART_OPTION,DATA_BY,DEFAULT_CHART_1_OPTION } from './constant'
import ChartFormModal from './chartFormModal.vue'
import BaseChart from '@/components/baseChart/index.vue'
import { EventBus } from './eventbus'
    export default {
        name:'chatArea',
        data() {
            return {
                DATA_BY,
                dataBy:'1',
                DEFAULT_CHART_OPTION,
                DEFAULT_CHART_1_OPTION
            }
        },
        components:{
            ChartFormModal,
            BaseChart
        },
        methods: {
            showModal(){
                this.$refs.chartFormRef.visible = true
            },
            submitForm(value){
                console.log(value);
                EventBus.$emit('filterForm',value)
            }
        },
    }
</script>

<style lang="less" scoped>
#bar_stack_chart{
    width: 100%;
    height: 350px;
}
#bar_stack_chart_1{
    width: 100%;
    height: 350px;
}
.filter{
    position: absolute;
    right: 20px;
}
</style>