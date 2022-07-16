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
  apiKey: "AIzaSyCzaiL332ikJtK0IaPMbIBCYyZXCfoB-gg",
  authDomain: "zargee-4c93f.firebaseapp.com",
  projectId: "zargee-4c93f",
  storageBucket: "zargee-4c93f.appspot.com",
  messagingSenderId: "768088300597",
  appId: "1:768088300597:web:2ae81c70b0561ba45aa57c",
};

initializeApp(firebaseConfig);
export const db = getFirestore();

app.mount("#app");
