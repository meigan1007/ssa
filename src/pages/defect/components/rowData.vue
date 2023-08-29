<template>
    <a-space direction="vertical" style="width:100%;margin:10px 0;height:250px">
    <div style="margin:0 12px">
        <span style="line-height: 32px;">{{ value === '1' ? 'By Defect-Row Data' : 'By Product ID-Row Data' }}</span>
        <a-select :options="ROW_DATA_TYPE" v-model="value" style="width: 300px;float:right" /></div>
        <a-table :rowKey="record => record.id" size="small" bordered v-if="value === '1'" :columns="DEFECT_TABLE_COLUMN" :data-source="defectData" :pagination="false" />
        <a-table :rowKey="record => record.id" class="muti-table" size="small" bordered v-else :columns="PRODUCT_TABLE_COLUMN" :data-source="productData" :pagination="false" />
    </a-space>
</template>

<script>
    import { ROW_DATA_TYPE,DEFECT_TABLE_COLUMN,PRODUCT_TABLE_COLUMN,DEFECT_DATA,PRODUCT_DATA} from './constant'
    
    export default {
        name:'rowData',
        data() {
            return {
                title:'',
                value:'2',
                ROW_DATA_TYPE,
                DEFECT_TABLE_COLUMN,
                PRODUCT_TABLE_COLUMN,
                defectData:DEFECT_DATA,
                productData:PRODUCT_DATA,

            }
        },
        mounted() {
        },
    }
</script>

<style lang="less" scoped>
.muti-table{
    /deep/ .ant-table-thead 
    tr:nth-child(2){
        display: none;
    }
}
</style>