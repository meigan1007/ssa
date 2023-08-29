<template>
    <div ref="echartRef" :style="{width,height}"> </div>
</template>

<script >
    export default {
        name:'echarts',
        data() {
            return {
                chatInstance: null,
            }
        },
        props:{
            width:{
                type:String,
                default:'100%'
            },
            height:{
                type:String,
                default:'360px'
            },
            options:{
                type:Object,
                default(){
                    return {}
                }
            }
        },
        watch:{
            options:{
                handler(val){
                    this.$nextTick(() => {
                        this.initChart(val)
                    })
                },
                deep:true
            }
            
        },
        mounted() {
            this.initChart(this.options)
            window.addEventListener('resize', () => {
                this.chatInstance.resize()
            })
        },
        methods:{
            initChart(options){
                this.chatInstance = this.$echarts.init(this.$refs.echartRef)
                this.chatInstance.setOption(options)
            }
        }
    }
</script>

<style lang="less" scoped>

</style>