import { createRouter, createWebHistory } from "vue-router";
// Import your Todos component
import HomeView from "@/views/HomeView.vue";
import UserView from "@/views/UserView.vue";
import TodosView from "@/views/TodosView.vue";
import SettingsView from "@/views/SettingsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: SettingsView,
      children: [
        {
          path: "",
          redirect: "/todos",
        },
        {
          path: "home",
          name: "home",
          component: HomeView,
        },
        {
          path: "todos",
          name: "todos",
          component: TodosView,
        },
        {
          path: "settings",
          name: "settings",
          component: SettingsView,
        },
      ],
    },
    {
      path: "/detailTodos",
      name: "detail",
      component: UserView,
    },
    // {
    //   path: '/user',
    //   name: 'user',
    //   component: () => import('../views/AboutView.vue')
    // }
  ],
});

export default router;
