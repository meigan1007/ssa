import Vue from "vue";

Vue.directive("auth", {
  inserted: (el, binding) => {
    const value = binding.value;
    // 本地开发  直接给true的情况
    if (typeof value !== "boolean") {
      const AIYEI_USER = JSON.parse(localStorage.getItem("AIYEI_USER") || {});
      const { permissions } = AIYEI_USER;
      // 未配置auth的，总是可见
      if (value && !permissions.includes(value)) {
        el.parentNode.removeChild(el);
      }
    }
  },
});
