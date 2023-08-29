<template>
  <div v-if="JSON.stringify(userInfo) !== '{}'">
    <header>
      <div class="logo">
        <img
          src="http://10.0.81.161:31958/resized/0/0/yms_latest_uat:webtools-bucket/tool-icon/logo/logo.png"
          alt=""
        />
        <div class="text">AI+YEI</div>
      </div>
      <img src="@/assets/icons/avatar.png" class="avatar" alt="" @click="onLogout" />
    </header>
    <div class="container">
      <div class="sider">
        <a-menu
          style="width: 200px"
          :open-keys.sync="openKeys"
          mode="inline"
          :selectable="false"
          @click="onClickMenu"
        >
          <template v-for="m in menu">
            <!-- pages 判断是否有2级菜单 -->
            <a-sub-menu v-if="m.pages && m.pages.length > 0" :key="m.key" v-auth="m.auth">
              <span slot="title">
                <a-icon :type="m.icon" />
                <span>{{ m.title }}</span>
              </span>
              <a-menu-item
                v-for="p in m.pages"
                :disabled="p.disabled"
                :key="p.key"
                v-auth="p.auth"
              >
                <!-- <a-icon :type="m.icon" /> -->
                {{ p.title }}
              </a-menu-item>
            </a-sub-menu>
            <a-menu-item v-else :disabled="m.disabled" :key="m.key" v-auth="m.auth">
              <a-icon :type="m.icon" />{{ m.title }}
            </a-menu-item>
          </template>
        </a-menu>
      </div>
      <div class="main">
        <a-tabs
          class="header-tabs"
          hideAdd
          :activeKey="activeTab"
          type="editable-card"
          @edit="onEdit"
          @change="onChangeTab"
        >
          <a-tab-pane
            v-for="pane in tabs"
            :key="pane.key"
            :tab="pane.title"
            :closable="pane.closable"
            class="container-pane"
          >
            <component
              class="global-component"
              v-show="activeTab === pane.key"
              v-bind:is="pane.component"
              :sign="pane.key"
              :param="pane.param"
            ></component>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { getUser, fetchConfig } from "@/pages/login/service";
import { MENU, PAGES } from "./constant";
import Cookies from "js-cookie";
export default {
  data() {
    return {
      pages: _.cloneDeep(PAGES),
      // tabs: [],
      // activeTab: "hha",
      menu: _.cloneDeep(MENU),
      openKeys: ["default"],
      userInfo: {},
    };
  },
  computed: {
    tabs() {
      return this.$store?.state.account.tabs || [];
    },
    activeTab() {
      return this.$store?.state.account.activeTab || "";
    },
  },
  methods: {
    // 获取当前登录用户信息
    async getUserInfo() {
      const res = await getUser();
      this.userInfo = res;
      //  数据存储到storage
      localStorage.setItem("AIYEI_USER", JSON.stringify(res));
    },
    // 获取全局相关定义
    async getGLOBAL() {
      const res = await fetchConfig();
      const config = {};
      res.forEach((item) => {
        config[item.code] = item.value;
      });
      localStorage.setItem("GLOBAL", JSON.stringify(config));
    },
    // tabs发生切换 触发
    onChangeTab(targetKey) {
      this.$store.commit("account/setActiveTab", targetKey);
    },

    onEdit(targetKey, action) {
      if (action === "remove") {
        let activeTab = this.activeTab;
        let lastIndex;
        this.tabs.forEach((pane, i) => {
          if (pane.key === targetKey) {
            lastIndex = i - 1;
          }
        });
        const tabs = this.tabs.filter((pane) => pane.key !== targetKey);
        if (tabs.length && activeTab === targetKey) {
          if (lastIndex >= 0) {
            activeTab = tabs[lastIndex].key;
          } else {
            activeTab = tabs[0].key;
          }
        }
        this.$store.commit("account/setTabs", tabs);
        this.$store.commit("account/setActiveTab", activeTab);
      }
    },
    onClickMenu(e) {
      let key = "";
      if (e.keyPath && e.keyPath.length > 1) {
        key = `/${e.keyPath[1]}/${e.keyPath[0]}`;
      } else {
        key = `/${e.keyPath[0]}`;
      }
      // 判断是否已经存在，如果存在直接切换到该页面
      let exist = false;
      for (const p of this.tabs) {
        if (p.key === key) {
          exist = true;
          break;
        }
      }
      if (exist) {
        // this.activeTab = key;
        this.$store.commit("account/setActiveTab", key);
      } else {
        this.$store.commit("account/onAddTab", { key });
      }
    },
    onLogout() {
      this.$confirm({
        title: "Confirm",
        content: "Do you really want to logout?",
        onOk: () => {
          this.$router.push("/login");
          Cookies.remove("AI_YEI_TOKEN");
          localStorage.removeItem("AI_YEI_USER");
        },
        onCancel() {},
      });
    },
  },
  created() {
    this.getUserInfo();
    this.getGLOBAL();
    this.$store.commit("account/onAddTab", { key: "/home" });
    // this.$store.commit("account/onAddTab", { key: "/markmap" });
    // this.$store.commit("account/onAddTab", { key: "/config/mapType" });
  },
};
</script>

<style lang="less">
header {
  width: 100%;
  height: 40px;
  line-height: 40px;
  background: #1183fb linear-gradient(-90deg, #0a48d1 0, #1183fb 100%);
  display: flex;
  justify-content: space-between;
  .logo {
    width: 200px;
  }
  img {
    height: 40px;
    display: block;
    float: left;
    cursor: pointer;
  }
  .text {
    font-family: Arial;
    height: 32px;
    line-height: 32px;
    padding: 4px 0;
    text-align: center;
    color: #fff;
    font-size: 20px;
    font-weight: 500;
    user-select: none;
    &:hover {
      cursor: pointer;
    }
  }
}
.container {
  width: 100%;
  height: calc(100vh - 40px);
  padding: 0;
  display: flex;

  .sider {
    width: 200px;
    height: 100%;
    border-right: 1px solid #ddd;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .main {
    width: calc(100% - 200px);
    height: 100%;
    padding: 0;
  }
}

// 头部tabs
.header-tabs {
  & > .ant-tabs-bar {
    margin: 0;
    width: calc(100vw - 200px - 48px);
    position: fixed;
    top: 0;
    left: 200px;
    .anticon-ellipsis {
      color: #fff;
    }
  }
  .ant-tabs-top > .ant-tabs-bar::before,
  .ant-tabs-bottom > .ant-tabs-bar::before,
  .ant-tabs-top > div > .ant-tabs-bar::before,
  .ant-tabs-bottom > div > .ant-tabs-bar::before {
    border-bottom: none;
  }

  .container-pane {
    height: calc(100vh - 40px);
    overflow: auto;
    padding: 4px;
    border-top: none;
  }
}

.avatar {
  width: 30px;
  height: 30px;
  position: fixed;
  right: 5px;
  top: 5px;
  cursor: pointer;
}
</style>
