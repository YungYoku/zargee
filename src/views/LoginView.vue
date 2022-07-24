<template>
  <div class="authWrap">
    <game-loading v-if="loadingStore.loading" />

    <form class="login" @submit.prevent="submit">
      <h2 class="login__item title">
        {{ languagesStore.language.login.title }}
      </h2>

      <label class="login__item email" for="emailInput">
        <input
          id="emailInput"
          v-model.trim="form.email"
          :placeholder="languagesStore.language.registration.email"
          class="inputLine"
          type="email"
        />
      </label>

      <label class="login__item pass" for="passwordInput">
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

      <div class="login__item passForgot">
        <router-link to="/reset">Забыли пароль?</router-link>
      </div>

      <button class="login__item btnSubmit" type="submit">
        {{ languagesStore.language.login.button }}
      </button>

      <animated-link
        :link="'/reg'"
        :text="languagesStore.language.login.swapMode"
        class="login__item swapMode"
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
import AnimatedLink from "@/components/AnimatedLink.vue";
import { useLoadingStore } from "@/stores/loading";
import { useTipStore } from "@/stores/tip";
import GameLoading from "@/components/GameLoading.vue";
import type { AuthResponse } from "@/interfaces/authResponse";
import type { AuthError } from "@/interfaces/authError";

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

const emailReg = new RegExp(
  /^[_a-z\d-+-]+(\.[_a-z\d-]+)*@[a-z\d-]+(\.[a-z\d-]+)*(\.[a-z]{2,})$/i
);

const form = reactive<Login>({
  email: "",
  password: "",
  isValid() {
    return this.password.length >= 6 && emailReg.test(this.email);
  },
});

const passDom = ref();

const passIcon = ref("passInvisible");

const showPass = () => {
  if (passDom.value.type === "text") {
    passIcon.value = "passInvisible";
    passDom.value.type = "password";
  } else {
    passIcon.value = "passVisible";
    passDom.value.type = "text";
  }
};

const handleResponse = async (response: AuthResponse) => {
  mainStore.login(response.user.uid);
  await mainStore.loadInfo();
  await router.push("/");

  loadingStore.hide();
};

const handleError = (error: AuthError) => {
  switch (error.code) {
    case "auth/wrong-password":
      tipStore.update("Неверный пароль");
      form.password = "";
      break;
    case "auth/user-not-found":
      tipStore.update("Почта не зарегистрирована");
      form.email = "";
      form.password = "";
      break;
    default:
      tipStore.update("Ошибка");
      form.email = "";
      form.password = "";
      break;
  }
};

const submit = async () => {
  if (form.isValid()) {
    loadingStore.show();

    await signInWithEmailAndPassword(getAuth(), form.email, form.password)
      .then(handleResponse)
      .catch(handleError);

    loadingStore.hide();
  }
};
</script>

<style lang="scss" scoped>
.authWrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100vh;
  gap: 30px;

  .login {
    display: flex;
    flex-direction: column;
    gap: 18px;

    width: 30%;
    min-width: 400px;
    max-width: 460px;
    margin: 0 auto;
    padding: 30px 40px 20px 40px;

    background-color: #fbfaf7;
    border-radius: 10px;
    box-shadow: 0 14px 20px 6px #eae0d5;

    @media screen and (max-width: 480px) {
      width: 90%;
      min-width: 300px;
    }

    &__item {
      position: relative;
    }

    .title {
      margin-bottom: auto;

      font-size: 32px;
      font-weight: 400;
      text-align: center;
      color: #333333;
    }

    .email,
    .pass {
      &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;

        width: 100%;
        height: 1px;

        background-color: #d3d3d3;
      }

      input {
        width: 100%;
        height: 100%;

        font-size: 16px;

        background-color: transparent;

        user-select: text;
      }

      &:focus-within::after {
        bottom: -1px;

        height: 2px;

        background-color: #333333;
      }
    }

    label {
      > img {
        position: absolute;
        top: 0;
        right: 0;

        width: 20px;
        height: 20px;

        cursor: pointer;
      }
    }

    .passForgot {
      a {
        font-size: 14px;
        color: #727270;

        cursor: pointer;

        &:hover {
          color: #333333;
        }
      }
    }

    .btnSubmit {
      z-index: 3;

      padding: 10px 0;

      font-size: 20px;
      font-weight: 400;
      text-align: center;
      color: white;

      background-color: #333333;
      border: none;
      border-radius: 5px;
      outline: none;

      cursor: pointer;

      &:hover {
        box-shadow: 0 10px 14px 5px lightgray;

        transform: scale(1.05);
      }
    }

    .inputLine {
      border-top: none;
      border-right: none;
      border-bottom: 1px solid lightgray;
      border-left: none;
    }
  }
}
</style>
