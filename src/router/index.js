import { createRouter, createWebHashHistory } from "vue-router";
import collection from "@/pages/collection/index.vue";
import article from "@/pages/article/index.vue";
import games from "@/pages/games/index.vue";
import note from "@/pages/note/index.vue";
import phone from "@/pages/phone/index.vue";
const Home = () => import("../pages/home/index.vue");

const routes = [
  { path: "/", redirect: "/collection" },
  {
    path: "/home",
    component: Home,
    children: [
      { path: "/collection", component: collection },
      { path: "/note", component: note },
      { path: "/article", component: article },
      { path: "/games", component: games },
      { path: "/phone", component: phone },
    ],
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
