<template>
<a-space direction="vertical" class="search-defect" :size="4">
    <a-space>
        <a-range-picker show-time size="small" @change="onPickerChange" v-model="timeRange" />
        <strong style="font-size:13px">快速选择</strong>
        last:
        <a-input-number size="small" style="width:100px" :min="1" :max="selectMax" v-model="quickSelectParams.timeValue"  />
        <a-select size="small" @change="timeTypeChange" v-model="quickSelectParams.timeType" default-value="day" style="width: 120px" :options="dateOption"></a-select>
        <a-button type="primary" :disabled="!quickSelectParams.timeValue" icon="check-circle" @click="onOk" size="small">Ok</a-button>
        <a-button
        type="primary"
        size="small"
        shape="circle"
        icon="filter"
        />
    </a-space>
    <a-checkbox-group
      v-model="value"
      name="checkboxgroup"
      :options="plainOptions"
      @change="onChange"
    />
    <a-space class="drap">
        <div class="drap-item" v-for="item in plainOptions.filter(i => value.includes(i.value))" :key="item.value">
            <div class="title">{{ item.label }}【{{ checkedObj[item.value].length }}/{{ mockList[item.value].length }}】</div>
            <a-input-search size="small" enter-button @search="onSearch" />
            <a-list size="small" :data-source="mockList[item.value]">
                <a-list-item slot="renderItem" slot-scope="listItem">
                    <div :class="checkedObj[item.value].includes(listItem.id) ? 'checked-item item' : 'item'" @click="onSelectItems(item.value,listItem.id)">{{ listItem.name }}</div>
                </a-list-item>
            </a-list>
            <!-- <div class="list" v-for="subItem in mockList[item.value]" :key="subItem.id"> -->
            <!-- </div> -->
        </div>
    </a-space>
    <a-space class="edit-area" :size="24">
        <a-button type="primary" icon="reload" @click="onOk" >Load</a-button>
        <a-button type="info" icon="reload" @click="onOk" >Reset</a-button>
        <a-button type="primary" @click="onJumpRowData" >Row Data</a-button>
    </a-space>
</a-space>
</template>

<script>
import { fastSelectTimes } from '@/utils/web'
import { MOCK,DATE_TYPE,SEARCH_FIELD,DATE_TYPE_MAP } from './constant'
    export default {
        data() {
            return {
                dateOption:DATE_TYPE,
                plainOptions:SEARCH_FIELD,
                quickSelectDict:DATE_TYPE_MAP,
                value:['productId'],
                checkedObj:{
                    // 记录每组选中的数据
                    productId:[],
                    stepId:[],
                    lotId:[],
                    waferId:[],
                    groupId:[],
                    moduleName:[],
                },
                mockList:MOCK,
                timeRange:[],
                quickSelectParams:{
                    timeValue:3,
                    timeType:'days'
                },
                dateMap:{
                    fullDays:'days',
                    fullWeeks:'week',
                    fullMonths:'month',
                }
            }
        },
        computed: {
            selectMax() {
                return this.quickSelectDict[this.timeType]
            }
        },
        created(){
            // 初始化日期时间选择器：默认3天
            this.setDateRange()
        },
        methods:{
            setDateRange(){
                const {timeValue,timeType} = this.quickSelectParams
                this.timeRange = fastSelectTimes(timeType,timeValue,this.dateMap)
            },
            onChange(checkedValues){
                console.log(this.value,checkedValues);
            },
            onPickerChange(){
                // 发生切换重置 快速选择框
                this.resetQuickSelect()
            },
            // 类型发生切换
            timeTypeChange(value){
                this.quickSelectParams.timeValue = this.quickSelectParams.timeValue > this.quickSelectDict[value] ? this.quickSelectDict[value] : this.quickSelectParams.timeValue
            },
            resetQuickSelect(){
                this.quickSelectParams = {
                    timeValue:null,
                    timeType:'days'
                }
            },
            onOk(){
                this.setDateRange()
            },
            search(){

            },
            onSearch(){

            },
            onJumpRowData(){
                this.$emit('onJumpRowData','2')
            },
            onSelectItems(type,id){
                console.log(type,id);
                const Index = this.checkedObj[type].indexOf(id)
                if(Index > -1) {
                    this.checkedObj[type].splice(Index, 1)
                }else{
                    this.checkedObj[type].push(id)
                }
            }
        }
    }
</script>

<style lang="less" scoped>
.search-defect{
    min-width: 728px;
    width: 100%;
    .drap{
    width: 100%;
    overflow-x: auto;
    .drap-item{
    width: 160px;
    border: 1px solid #f0f0f0;
    height: 200px;
    padding: 5px;
    /deep/ .ant-list-sm .ant-list-item{
        padding-top: 2px;
        padding-bottom: 0;
        border-bottom: none;
        font-size: 12px;
        .checked-item{
            font-weight: bold;
            background-color: rgba(64, 158, 255, 0.314);
            font-weight: 600;
        }
        .item{
            width: 100%;
        }
    }
    .title{
        margin-bottom:5px;
        font-weight: 600;
    }
    
}
}
}


.edit-area{
    justify-content: center;
    width: 100%;
    margin: 4px 0 ;
}
</style>