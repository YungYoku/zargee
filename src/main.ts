import { createApp } from "vue";
import { createPinia } from "pinia";
import { VueReCaptcha } from "vue-recaptcha-v3";
import "./assets/main.scss";

import App from "./App.vue";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

import router from "./router";

const app = createApp(App);
app.use(createPinia());

// For more options see below
app.use(router);

app.use(VueReCaptcha, { siteKey: "6Ld3yVIhAAAAAGk3si4mQCHfbfIBOqZFLmkVtAnK" });

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

const fbApp = initializeApp(firebaseConfig);
export const db = getFirestore();
getAnalytics(fbApp);

app.mount("#app");
