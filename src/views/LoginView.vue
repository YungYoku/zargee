<template>
  <div class="login">
    <game-loading v-if="loadingStore.loading" />

    <div class="login__form-wrap">
      <h2 class="title">Вход</h2>

      <router-view
        @close="setLoginType(LoginType.notSpecified)"
        @email="setLoginType(LoginType.email)"
        @google="loginGoogle"
      />

      <animated-link :link="'/reg'" class="swapMode" text="РЕГИСТРАЦИЯ" />
    </div>

    <animated-link :link="'/demo'" :text="'ДЕМО ВЕРСИЯ'" />
  </div>
</template>

<script lang="ts" setup>
import { useLoadingStore } from "@/stores/loading";
import { ref } from "vue";
import AnimatedLink from "@/components/AnimatedLink.vue";
import GameLoading from "@/components/AppLoading.vue";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useMainStore } from "@/stores/main";
import { useSettingsStore } from "@/stores/settings";
import { useRouter } from "vue-router";
import type { AuthResponse } from "@/interfaces/authResponse";
import { useAuthStore } from "@/stores/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/main";

const enum LoginType {
  email = "email",
  google = "google",
  notSpecified = "",
}

const mainStore = useMainStore();
const authStore = useAuthStore();
const settingsStore = useSettingsStore();
const loadingStore = useLoadingStore();
const router = useRouter();

const loginType = ref<LoginType>(LoginType.notSpecified);

const setLoginType = (type: LoginType) => {
  if (type !== LoginType.google) {
    router.push(`/login/${type}`);
  }
  loginType.value = type;
};

const isUserInfoExist = async (uid: string) => {
  let userInfoExist = false;

  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    userInfoExist = true;
  }

  return userInfoExist;
};

const handleGoogleResponse = async (response: AuthResponse) => {
  const uid = response.user.uid;

  const userInfoExist = await isUserInfoExist(uid);
  if (!userInfoExist) {
    await authStore.addEmptyUserToDb(uid, "Имя", false);
  }

  mainStore.login(uid);
  settingsStore.updateSettings();
  settingsStore.swapSound();
  await mainStore.loadInfo();
  await router.push("/");

  loadingStore.hide();
};

const loginGoogle = async () => {
  loadingStore.show();

  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  await signInWithPopup(auth, provider)
    .then(async (response) => {
      //const credential = GoogleAuthProvider.credentialFromResult(result);
      //const token = credential.accessToken;
      await handleGoogleResponse(response);
    })
    .catch((error) => {
      //const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      //const email = error.customData.email;

      //const credential = GoogleAuthProvider.credentialFromError(error);

      loadingStore.hide();
    });
};
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100vh;
  gap: 24px;

  &__form-wrap {
    position: relative;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 30%;
    min-width: 384px;
    max-width: 480px;
    margin: 0 auto;
    padding: 24px;

    background-color: #fbfaf7;
    border-radius: 5px;
    box-shadow: 0 14px 20px 6px #eae0d5;

    gap: 24px;

    @media (max-width: 480px) {
      width: 90%;
      min-width: 288px;
    }

    .title {
      margin-bottom: auto;

      font-size: 32px;
      font-weight: 400;
      text-align: center;
      color: #333333;
    }
  }
}
</style>
