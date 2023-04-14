import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";
import SettingsUser from "@/components/settings/SettingsUser.vue";
import SettingsUserAbout from "@/components/settings/SettingsUserAbout.vue";
import AppPolitics from "@/components/AppPolitics.vue";
import SettingsUserDaily from "@/components/settings/SettingsUserDaily.vue";
import LoginEmail from "@/components/login/LoginEmail.vue";
import AuthOptions from "@/components/auth/AuthOptions.vue";
import GameLoseMenu from "@/components/game/GameLoseMenu.vue";
import { useGameStore } from "@/stores/game";
import GameHeal from "@/components/game/GameHeal.vue";

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
    children: [
      {
        path: "loseMenu",
        name: "GameLoseMenu",
        component: GameLoseMenu,
        meta: {
          audio: false,
          auth: true,
        },
        beforeEnter: (_, from) => {
          const gameStore = useGameStore();
          if (!!from.name && from.name === "Game" && gameStore.lose) {
            if (from.name === "Game") {
              if (gameStore.lose) {
                return true;
              } else {
                return { path: "/game" };
              }
            } else {
              return { path: "/" };
            }
          }

          return { path: "/" };
        },
        children: [
          {
            path: "heal",
            name: "GameLoseMenuHeal",
            component: GameHeal,
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
    path: "/demo",
    name: "Demo",
    component: () => import("@/views/DemoView.vue"),
    meta: {
      audio: false,
      auth: false,
    },
    beforeEnter: () => {
      const logged = !!localStorage["uid"];
      if (logged) return { path: "/" };

      return true;
    },
    children: [
      {
        path: "loseMenu",
        name: "DemoLoseMenu",
        component: GameLoseMenu,
        meta: {
          audio: false,
          auth: false,
        },
        beforeEnter: (_, from) => {
          const gameStore = useGameStore();
          if (!!from.name && from.name === "Demo" && gameStore.lose) {
            if (from.name === "Demo") {
              if (gameStore.lose) {
                return true;
              } else {
                return { path: "/demo" };
              }
            } else {
              return { path: "/" };
            }
          }

          return { path: "/login" };
        },
        children: [
          {
            path: "heal",
            name: "DemoLoseMenuHeal",
            component: GameHeal,
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
            component: AppPolitics,
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
          {
            path: "daily",
            name: "SettingsUserDaily",
            component: SettingsUserDaily,
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
    children: [
      {
        path: "",
        name: "AuthOptions",
        component: AuthOptions,
        meta: {
          audio: false,
          auth: false,
        },
      },
      {
        path: "email",
        name: "LoginEmail",
        component: LoginEmail,
        meta: {
          audio: false,
          auth: false,
        },
      },
    ],
  },

  {
    path: "/reg",
    name: "Registration",
    component: () => import("@/views/RegView.vue"),
    meta: {
      audio: false,
      auth: false,
    },
    children: [
      {
        path: "politics",
        name: "RegistrationPolitics",
        component: AppPolitics,
        meta: {
          audio: false,
          auth: false,
        },
      },
    ],
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

router.beforeEach((to, from) => {
  const logged = !!localStorage["uid"];
  if (to.meta["auth"]) {
    if (logged) {
      if (to.name === "Game" && from.name === undefined) {
        return "/";
      }

      return true;
    } else {
      return "/login";
    }
  }

  if (logged) {
    return "/";
  }

  return true;
});

export default router;
