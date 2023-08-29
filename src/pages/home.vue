<template>
  <ul class="product">
    <li v-for="p in products" :key="p.key" v-auth="p.auth">
      <div class="product-module" @click="onClickTab(p.key)">
        <!-- {{ ICONS[p.icon] || ICONS.CloudOutlined }} -->
        <a-icon :type="p.icon" />
        <h3>{{ p.title }}</h3>
      </div>
    </li>
  </ul>
</template>

<script>
import { PAGES } from "./constant";

export default {
  data() {
    return {
      products: [],
    };
  },
  methods: {
    onClickTab(key) {
      this.$store.commit("account/onAddTab", { key });
    },
    onPageInit() {
      function getPages() {
        let pages = [];
        for (const m of PAGES) {
          if (m.pages) {
            for (const p of m.pages) {
              pages.push({ ...p, key: `${m.key}/${p.key}` });
            }
          } else {
            if (m.key !== "/home") {
              pages.push({ ...m, key: `${m.key}` });
            }
          }
        }
        return pages.filter((p) => !p.hidden);
      }
      this.products = getPages();
      // 权限过滤
      // pages = pages.filter((p) => !p.auth || permissions.includes(p.auth));
    },
  },
  created() {
    this.onPageInit();
  },
};
</script>

<style lang="less" scoped>
ul.product {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  li {
    width: calc(25% - 8px);
    height: 150px;
    margin: 4px;
    user-select: none;
  }
}
.product-module {
  text-align: center;
  width: 100%;
  font-size: 16px;
  height: 100%;
  background-color: #ddd;
  border-radius: 2px;
  padding: 25px 0 0;
  &:hover {
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.6);
    cursor: pointer;
  }
  .anticon {
    margin: 0 auto 20px;
    font-size: 60px;
    color: #1890ff;
  }
}
</style>
