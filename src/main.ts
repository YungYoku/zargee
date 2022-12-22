import { createApp } from "vue";
import { createPinia } from "pinia";
import "./assets/main.scss";

import App from "./App.vue";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

import router from "./router";
import { reportError } from "@/api/api";

window.screen.orientation.lock("portrait");

const app = createApp(App);
app.use(createPinia());

app.use(router);

const firebaseConfig = {
  apiKey: import.meta.env["VITE_FB_KEY"],
  authDomain: import.meta.env["VITE_AUTH_DOMAIN"],
  projectId: import.meta.env["VITE_PROJECT_ID"],
  storageBucket: import.meta.env["VITE_STORAGE_BUCKET"],
  messagingSenderId: import.meta.env["VITE_MESSAGING_SENDER_ID"],
  appId: import.meta.env["VITE_APP_ID"],
};

const fbApp = initializeApp(firebaseConfig);
export const db = getFirestore();
getAnalytics(fbApp);
initializeAppCheck(fbApp, {
  provider: new ReCaptchaV3Provider("6Ld3yVIhAAAAAGk3si4mQCHfbfIBOqZFLmkVtAnK"),
  isTokenAutoRefreshEnabled: true,
});

app.config.errorHandler = (err: unknown) => {
  reportError(err);
};

app.mount("#app");
