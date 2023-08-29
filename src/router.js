import Vue from "vue";

import Router from "vue-router";

Vue.use(Router);
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/login",
      name: "Login",
      component: () => import("@/pages/login"),
    },
    {
      path: "/",
      name: "HHA",
      desc:"",
      component: () => import("@/pages"),
    },
    {
      path: "/home/n",
      name: "HHA1",
      desc:"",
      component: () => import("@/pages"),
    },
    // {
    //   path: "/",
    //   name: "HOME",
    //   component: () => import("@/pages"),
    //   // redirect: "/hha",
    // },
  ],
});
