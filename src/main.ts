import { createApp } from "vue";
import { createPinia } from "pinia";
import "./assets/main.scss";

import App from "./App.vue";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import router from "./router";

const app = createApp(App);
app.use(createPinia());

app.use(router);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

initializeApp(firebaseConfig);
export const db = getFirestore();

app.mount("#app");
