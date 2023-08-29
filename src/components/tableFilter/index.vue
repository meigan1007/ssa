<template>
   <a-form :form="form" class="table-filter">
     <div>筛选条件:</div>
    <a-form-item>
      <a-select :options="filterOptions" style="width:168px" v-decorator="['select1']"  />
    </a-form-item>
    <a-form-item>
      <a-input
        v-if="showInput1"
        style="width:168px"
        v-decorator="['input1']"
      >
        <a-icon @click="onClickIcon(1)" slot="suffix" type="calendar"></a-icon>
      </a-input>
      <a-date-picker v-else style="width:168px" valueFormat="YYYY-MM-DD" v-decorator="['input1']"   @change="inputDateChange(1)" >
        <a-icon @click="onClickPickerIcon(1)" slot="suffixIcon" type="edit"></a-icon>
      </a-date-picker>
    </a-form-item>
    <a-form-item>
      <a-select :options="changeOptions" style="width:100px" v-decorator="['select2']"  />
    </a-form-item>
    <a-form-item>
      <a-select :options="filterOptions" style="width:168px" v-decorator="['select3']"  />
    </a-form-item>
    <a-form-item>
            <a-input
        v-if="showInput2"
        style="width:168px"
        v-decorator="['input2']"
      >
        <a-icon @click="onClickIcon(2)" slot="suffix" type="calendar"></a-icon>
      </a-input>
      <a-date-picker v-else style="width:168px" valueFormat="YYYY-MM-DD" v-decorator="['input2']"   @change="inputDateChange(2)" >
        <a-icon @click="onClickPickerIcon(2)" slot="suffixIcon" type="edit"></a-icon>
      </a-date-picker>
    </a-form-item>
      <a-button
        type="primary"
        style="width: 80px;"
        @click="handleSearch"
      >
        筛选
      </a-button>
      <a-button style="width: 80px" @click="handleReset">
        清空
      </a-button>
   </a-form>
</template>

<script>
  export default {
    name:"tableFilter",
    data() {
      return {
        form:this.$form.createForm(this, { name: 'table_filter' }),
        filterOptions:[
          {
            label:'大于等于',
            value:'大于等于'
          },
          {
            label:'等于',
            value:'等于'
          },
          {
            label:'小于等于',
            value:'小于等于'
          },
        ],
        changeOptions:[
          {
            label:'or',
            value:'or'
          },
          {
            label:'and',
            value:'and'
          },
        ],
        showInput1:true,
        showInput2:true,
      }
    },
    props:{
      field:{
        type:String,
        default:''
      },
      initVal:{
        type:Object,
        default(){
          return {}
        }
      },
    },
    watch:{
      initVal:{
        handler(newVal){
          console.log(newVal,'newVal');
        },
        deep:true
      }
    },
    methods:{
      handleSearch(){
        console.log(this.form.getFieldsValue());
        this.$emit('handleForm',{
          field:this.field,
          value:this.form.getFieldsValue()
        })
      },
      handleReset(){
        this.form.resetFields()
      },
      // 点击input框icon触发事件
      // index为选项当前位置
      onClickIcon(index){
        console.log('clickIcon');
        if(index === 1){
          this.showInput1 = false
          this.form.setFieldsValue({
            input1:undefined
          })
        }else if(index === 2){
          this.showInput2 = false
          this.form.setFieldsValue({
            input2:undefined
          })
        }

      },
      // 点击日期框图标
      onClickPickerIcon(index){
        if(index === 1){
          this.showInput1 = true
          this.form.setFieldsValue({
            input1:''
          })
        }else if(index === 2){
          this.showInput2 = true
          this.form.setFieldsValue({
            input2:''
          })
        }
      },
      inputDateChange(index){
        console.log(this.form.getFieldsValue(['input1']));
        if(index === 1){
          this.showInput1 = true
        }else if(index === 2){
          this.showInput2 = true
        }
      }
    }
  }
</script>

<style lang="less" scoped>
.table-filter{
  /deep/ .ant-form-item{
    margin-bottom: 0px;
  }
}

</style>