import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";
import SettingsUser from "@/components/settings/SettingsUser.vue";
import GamePolitics from "@/components/AppPolitics.vue";
import SettingsUserAbout from "@/components/settings/SettingsUserAbout.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/HomeView.vue"),
    meta: {
      audio: true,
      auth: true,
    },
  },

  {
    path: "/game",
    name: "Game",
    component: () => import("@/views/GameView.vue"),
    meta: {
      audio: false,
      auth: true,
    },
  },

  {
    path: "/demo",
    name: "Demo",
    component: () => import("@/views/DemoView.vue"),
    meta: {
      audio: false,
      auth: true,
    },
  },

  {
    path: "/settings",
    name: "Settings",
    component: () => import("@/views/SettingsView.vue"),
    meta: {
      audio: true,
      auth: true,
    },
    children: [
      {
        path: "user",
        name: "SettingsUser",
        component: SettingsUser,
        meta: {
          audio: true,
          auth: true,
        },
        children: [
          {
            path: "politics",
            name: "SettingsUserPolitics",
            component: GamePolitics,
            meta: {
              audio: true,
              auth: true,
            },
          },
          {
            path: "about",
            name: "SettingsUserAbout",
            component: SettingsUserAbout,
            meta: {
              audio: true,
              auth: true,
            },
          },
        ],
      },
    ],
  },

  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/LoginView.vue"),
    meta: {
      audio: false,
      auth: false,
    },
  },

  {
    path: "/reg",
    name: "Registration",
    component: () => import("@/views/RegView.vue"),
    meta: {
      audio: false,
      auth: false,
    },
  },

  {
    path: "/reset",
    name: "Reset",
    component: () => import("@/views/ResetView.vue"),
    meta: {
      audio: false,
      auth: false,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  const logged = !!localStorage["uid"];

  if (to.name === "Demo") {
    if (!logged) {
      return true;
    } else {
      return "/";
    }
  } else if (to.meta["auth"]) {
    if (logged) {
      return true;
    } else {
      return "/login";
    }
  } else {
    if (logged) {
      return "/";
    } else {
      return true;
    }
  }
});

export default router;
