import { createRouter, createWebHashHistory } from "vue-router";
import collection from "@/pages/collection/index.vue";
import article from "@/pages/article/index.vue";
const Home = () => import("../pages/home/index.vue");

const routes = [
  { path: "/", redirect: "/home" },
  {
    path: "/home",
    component: Home,
    children: [
      { path: "/collection", component: collection },
      { path: "/article", component: article },
    ],
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
