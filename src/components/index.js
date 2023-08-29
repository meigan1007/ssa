import CollectButton from '@/components/collectButton/index.vue'


export default {
  // 插件的初始化，插件给你提供的全局的功能，都可以在这里配置
  install(Vue) {
    // 定义全局组件
    Vue.component('CollectButton', CollectButton) // 封装全局收藏组件
  }
}