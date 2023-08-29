/* eslint-disable no-unused-vars */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import * as echarts from "echarts";
import Antd from "ant-design-vue";
import store from './store'
import "@/utils/directive";
import "ant-design-vue/dist/antd.css";
// import './assets/antd.min.css';
import "./global.less";
import "./global.vue.less";
import './assets/icons/iconfont/iconfont.css'
import GolbalComponents from '@/components';

Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;
Vue.use(GolbalComponents)
Vue.use(Antd);

new Vue({
  router,
  store,
  render: (h) => h(App),
  beforeCreate() {
    Vue.prototype.$bus = this //安装全局事件总线
  },
}).$mount('#app')
