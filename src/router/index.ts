import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";

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

router.beforeEach((to, _, next) => {
  const logged = !!localStorage["uid"];

  if (to.name === "Demo") {
    localStorage["uid"] = "8gS1vixzWIaTOQZNz5IzG0PGfMr2";
  }

  const loggedDemo = localStorage["uid"] === "8gS1vixzWIaTOQZNz5IzG0PGfMr2";

  if (loggedDemo) {
    if (to.name === "Demo") {
      next();
    } else {
      next("/demo");
    }
  } else if (to.meta["auth"]) {
    if (logged) {
      next();
    } else {
      next("/login");
    }
  } else {
    if (logged) {
      next("/");
    } else {
      next();
    }
  }
});

export default router;
