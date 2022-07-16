<template>
  <div class="authWrap">
    <h2>{{ languagesStore.language.login.title }}</h2>

    <game-loading v-if="loadingStore.loading" />

    <form
      :style="{
        boxShadow: '0 14px 20px 6px ' + theme.shadow,
      }"
      @submit.prevent="submit"
    >
      <label class="email" for="emailInput">
        <input
          id="emailInput"
          v-model.trim="form.email"
          :placeholder="languagesStore.language.registration.email"
          class="inputLine"
          type="email"
        />
      </label>

      <label class="pass" for="passwordInput">
        <input
          id="passwordInput"
          ref="passDom"
          v-model.trim="form.password"
          :placeholder="languagesStore.language.registration.password"
          class="inputLine"
          type="password"
        />

        <img
          v-if="passIcon === 'passVisible'"
          alt="view"
          src="@/assets/icons/passVisible.svg"
          @click="showPass"
        />

        <img
          v-if="passIcon === 'passInvisible'"
          alt="view"
          src="@/assets/icons/passInvisible.svg"
          @click="showPass"
        />
      </label>

      <div class="passForgot">
        <router-link to="/reset">Забыли пароль?</router-link>
      </div>

      <button class="btnSubmit" type="submit">
        {{ languagesStore.language.login.button }}
      </button>

      <animated-link
        :link="'/reg'"
        :text="languagesStore.language.login.swapMode"
        class="swapMode"
      />
    </form>

    <animated-link :link="'/demo'" :text="'ДЕМО ВЕРСИЯ'" />
  </div>
</template>

<script lang="ts" setup>
import { useMainStore } from "@/stores/main";
import { useLanguagesStore } from "@/stores/languages";
import { reactive, ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";
import { theme } from "@/api/theme";
import AnimatedLink from "@/components/AnimatedLink.vue";
import { useLoadingStore } from "@/stores/loading";
import { useTipStore } from "@/stores/tip";
import GameLoading from "@/components/GameLoading.vue";

interface Login {
  email: string;
  password: string;
  isValid: () => boolean;
}

const mainStore = useMainStore();
const languagesStore = useLanguagesStore();
const loadingStore = useLoadingStore();
const tipStore = useTipStore();
const router = useRouter();

const form = reactive<Login>({
  email: "",
  password: "",
  isValid() {
    return this.password.length >= 6 && this.email !== "";
  },
});

const passDom = ref();

const passIcon = ref("passInvisible");

function showPass() {
  if (passDom.value.type === "text") {
    passIcon.value = "passInvisible";
    passDom.value.type = "password";
  } else {
    passIcon.value = "passVisible";
    passDom.value.type = "text";
  }
}

async function submit() {
  if (form.isValid()) {
    loadingStore.show();

    await signInWithEmailAndPassword(getAuth(), form.email, form.password)
      .then(async (userCredential) => {
        mainStore.login(userCredential.user.uid);
        await mainStore.loadInfo();
        await router.push("/");

        loadingStore.hide();
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/wrong-password":
            tipStore.update("Неверный пароль");
            break;
          case "auth/user-not-found":
            tipStore.update("Почта не зарегистрирована");
            break;
          default:
            tipStore.update("Ошибка");
            break;
        }
      });
  }
}
</script>

<style lang="scss" scoped>
.authWrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100vh;
  gap: 20px;

  h2 {
    margin: 0 0 40px 0;

    font-size: 70px;
    font-weight: 500;
    text-align: center;
    color: #999999;

    @media screen and (max-width: 768px) {
      font-size: 50px;
    }

    @media screen and (max-width: 480px) {
      font-size: 40px;
    }
  }

  form {
    display: grid;
    justify-content: center;
    align-items: center;

    grid-template: 50px 50px 30px 70px 50px / 1fr;
    grid-template-areas:
      "email"
      "pass"
      "passForgot"
      "btnSubmit"
      "swap";

    width: 30%;
    min-width: 400px;
    margin: 0 auto;
    padding: 30px 40px 20px 40px;

    background-color: #fbfaf7;
    border-radius: 30px;

    @media screen and (max-width: 480px) {
      width: 90%;
      min-width: 300px;
      padding: 30px 40px 20px 40px;
    }

    .email {
      position: relative;

      grid-area: email;
    }

    .email::after,
    .pass::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;

      width: 100%;
      height: 1px;

      background-color: #d3d3d3;
    }

    .email input,
    .pass input {
      width: 100%;
      height: 100%;

      font-size: 18px;

      background-color: transparent;

      user-select: text;
    }

    .email:focus-within::after,
    .pass:focus-within::after {
      bottom: -1px;

      height: 2px;

      background-color: #333333;
    }

    label > img {
      position: absolute;
      top: 0;
      right: 0;

      width: 20px;
      height: 20px;

      cursor: pointer;
    }

    .pass {
      position: relative;

      grid-area: pass;
    }

    .passForgot {
      grid-area: passForgot;
    }

    .passForgot a {
      font-size: 14px;
      color: #727270;
    }

    .passForgot a:hover {
      color: #333333;
    }

    .btnSubmit {
      grid-area: btnSubmit;

      padding: 10px 0;

      font-size: 24px;
      font-weight: 400;
      color: white;

      background-color: #333333;
      border: none;
      border-radius: 20px;
      outline: none;

      cursor: pointer;
    }

    .btnSubmit:hover {
      box-shadow: 0 10px 14px 5px lightgray;

      transform: scale(1.05);
    }

    .inputLine {
      border-top: none;
      border-right: none;
      border-bottom: 1px solid lightgray;
      border-left: none;
    }

    .swapMode {
      grid-area: swap;
    }
  }
}
</style>
