<template>
<a-drawer
    title="Utilization"
    placement="right"
    :closable="false"
    :visible="visible"
    @close="onClose"
    :width="600"
    :headerStyle="headerStyle"
    :bodyStyle="bodyStyle"
    >
        <ssa-form ref="ssaFormRef" :formItems="FORM_ITEMS" :formConfig="FORM_CONFIG" :dict="DICT"></ssa-form>
        <!-- <a-space direction="vertical" style="width:100%">
            <div>Defect Type Map :</div>
            <div><span style="margin-right:20px">Defect Count</span> 显示选中的边框为红色</div>
            <div id="bar_stack_chart"></div>
            <a-space>
                Data By: 
                <a-select :options="DATA_BY" v-model="dataBy" style="width: 300px" @change="handleChange" />
                <a-checkbox >
                    是否联动
                </a-checkbox>
            </a-space>
            <div id="bar_stack_chart_1"></div>
        </a-space> -->
    </a-drawer>
</template>

<script>
import SsaForm from '@/components/ssaForm/index.vue'
import { DICT,FORM_CONFIG,FORM_ITEMS,DEFAULT_CHART_OPTION,DATA_BY,DEFAULT_CHART_1_OPTION } from './constant'
    export default {
        data() {
            return {
                visible:false,
                headerStyle:{
                    padding:'10px'
                },
                bodyStyle:{
                    padding:'20px'
                },
                FORM_CONFIG,
                FORM_ITEMS,
                DICT,
                DATA_BY,
                dataBy:'1'
            }
        },
        components:{
            SsaForm
        },
        watch:{
            visible(val){
                if(val){
                    this.$nextTick(() => {
                        this.$refs.ssaFormRef.form.setFieldsValue({
                            groupBy:'1',
                            dataStatus:'1',
                            modelStatus:'1',
                            defectTypeFilter:['1','2','3'],
                            defectType:'1',
                            moduleName:['1']
                        })
                        this.initChart()
                        this.initChar1()
                    })
                }
            }
        },
        
        methods:{
            onClose(){
                this.visible = false
            },
            // 初始化chart堆叠图
            initChart(){
                console.log(document.getElementById('bar_stack_chart'));
                const chart = this.$echarts.init(document.getElementById('bar_stack_chart'))
                const option = DEFAULT_CHART_OPTION
                chart.setOption(option)
            },
            initChar1(){
                const chart = this.$echarts.init(document.getElementById('bar_stack_chart_1'))
                const option = DEFAULT_CHART_1_OPTION
                chart.setOption(option)
            }
        }
    }
</script>

<style lang="less" scoped>
#bar_stack_chart{
    width: 100%;
    height: 300px;
}
#bar_stack_chart_1{
    width: 100%;
    height: 300px;
}
</style>