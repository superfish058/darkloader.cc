import { createRouter, createWebHistory } from "vue-router";
const Home = () => import("../pages/home/index.vue");

const routes = [
  { path: "/", redirect: "/home" },
  { path: "/home", component: Home },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

