<template>
  <form class="login-email" @submit.prevent="submit">
    <button-close @close="close" />

    <label class="email" for="emailInput">
      <input
        id="emailInput"
        v-model.trim="form.email"
        class="inputLine"
        placeholder="Почта"
        required
        type="email"
      />
    </label>

    <label class="pass" for="passwordInput">
      <input
        id="passwordInput"
        ref="passDom"
        v-model.trim="form.password"
        class="inputLine"
        placeholder="Пароль"
        required
        type="password"
      />

      <img
        v-if="passIcon === 'passVisible'"
        alt="view"
        src="@/assets/img/passVisible.svg"
        @click="showPass"
      />

      <img
        v-if="passIcon === 'passInvisible'"
        alt="view"
        src="@/assets/img/passInvisible.svg"
        @click="showPass"
      />
    </label>

    <div class="passForgot">
      <router-link to="/reset">Забыли пароль?</router-link>
    </div>

    <button class="btnSubmit" type="submit">Войти</button>
  </form>
</template>

<script lang="ts" setup>
import { useMainStore } from "@/stores/main";
import { useSettingsStore } from "@/stores/settings";
import { useLoadingStore } from "@/stores/loading";
import { useTipStore } from "@/stores/tip";
import { useRouter } from "vue-router";
import { reactive, ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import type { AuthResponse } from "@/interfaces/authResponse";
import type { AuthError } from "@/interfaces/authError";
import ButtonClose from "@/components/ButtonClose.vue";

interface Login {
  email: string;
  password: string;
  isValid: () => boolean;
}

const mainStore = useMainStore();
const settingsStore = useSettingsStore();
const loadingStore = useLoadingStore();
const tipStore = useTipStore();
const router = useRouter();

const emit = defineEmits(["close"]);

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
  settingsStore.updateSettings();
  settingsStore.swapSound();
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

const close = () => {
  emit("close");
};
</script>

<style lang="scss" scoped>
.login-email {
  position: relative;

  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
  margin-right: auto;
  gap: 18px;

  .pass {
    position: relative;
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
</style>
