import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/HomeView.vue"),
    meta: {
      auth: true,
    },
  },

  {
    path: "/game",
    name: "Game",
    component: () => import("../views/GameView.vue"),
    meta: {
      auth: true,
    },
  },

  {
    path: "/demo",
    name: "Demo",
    component: () => import("../views/DemoView.vue"),
    meta: {
      auth: true,
    },
  },

  {
    path: "/settings",
    name: "Settings",
    component: () => import("../views/SettingsView.vue"),
    meta: {
      auth: true,
    },
  },

  {
    path: "/login",
    name: "Login",
    component: () => import("../views/LoginView.vue"),
    meta: {
      auth: false,
    },
  },

  {
    path: "/reg",
    name: "Registration",
    component: () => import("../views/RegView.vue"),
    meta: {
      auth: false,
    },
  },

  {
    path: "/reset",
    name: "Reset",
    component: () => import("../views/ResetView.vue"),
    meta: {
      auth: false,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const logged = !!localStorage.uid;

  if (to.name === "Demo") {
    localStorage.uid = "JyLHqEGLjAeEyVUUMjEK6U3PC4b2";
  }

  const loggedDemo = localStorage.uid === "JyLHqEGLjAeEyVUUMjEK6U3PC4b2";

  if (loggedDemo) {
    if (to.name === "Demo") {
      next();
    } else {
      next("/demo");
    }
  } else if (to.meta.auth) {
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
