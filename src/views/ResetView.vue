<template>
  <div class="authWrap">
    <h2>{{ languagesStore.language.reset.title }}</h2>

    <form
      :class="{
        beforeSend: form.mode === 'default',
        resetPassword: form.mode === 'resetPassword',
      }"
      :style="{
        boxShadow: '0 14px 20px 6px ' + theme.shadow,
      }"
      class="reset beforeSend"
      @submit.prevent="submitHandle"
    >
      <label v-if="form.mode === 'default'" class="email" for="emailInput">
        <input
          id="emailInput"
          v-model.trim="form.email"
          :placeholder="languagesStore.language.registration.email"
          class="inputLine"
          type="email"
        />
      </label>

      <label
        v-if="form.mode === 'resetPassword'"
        class="pass"
        for="passwordInput"
      >
        <input
          id="passwordInput"
          ref="passDom"
          v-model.trim="form.password"
          :placeholder="languagesStore.language.reset.password"
          class="inputLine"
          type="password"
          @keyup="changePower"
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

      <label
        v-if="form.mode === 'resetPassword'"
        class="passRep"
        for="passwordRepeatInput"
      >
        <input
          id="passwordRepeatInput"
          ref="passRepDom"
          v-model.trim="form.passwordRep"
          :placeholder="languagesStore.language.reset.passwordRepeat"
          class="inputLine"
          type="password"
          @keyup="changePower"
        />
      </label>

      <div v-if="form.mode === 'resetPassword'" class="passPower">
        <span ref="lineI" class="powerLines"></span>
        <span ref="lineII" class="powerLines"></span>
        <span ref="lineIII" class="powerLines"></span>
      </div>

      <button :class="{ mailSend: isMailSend }" class="btnSubmit" type="submit">
        {{
          isMailSend
            ? languagesStore.language.reset.buttonSend
            : languagesStore.language.reset.button
        }}
      </button>

      <router-link to="/login">
        <div class="swapMode">
          <h5>{{ languagesStore.language.reset.toLogin }}</h5>
        </div>
      </router-link>
    </form>

    <router-link to="/demo" @click="mainStore.loginDemo">
      <div class="demoVersion">
        <h5>ДЕМО ВЕРСИЯ</h5>
      </div>
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { useMainStore } from "@/stores/main";
import { useLanguagesStore } from "@/stores/languages";
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { theme } from "@/api/theme";
import {
  confirmPasswordReset,
  getAuth,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useLoadingStore } from "@/stores/loading";
import { useTipStore } from "@/stores/tip";

interface Reset {
  mode: string;
  email: string;
  password: string;
  passwordRep: string;
  isValid: () => boolean;
}

const mainStore = useMainStore();
const languagesStore = useLanguagesStore();
const loadingStore = useLoadingStore();
const tipStore = useTipStore();

const router = useRouter();
const route = useRoute();

const query = route.query;
const isMailSend = ref(false);
const passDom = ref();
const passRepDom = ref();
const lineI = ref();
const lineII = ref();
const lineIII = ref();
const passIcon = ref("passInvisible");

const form = reactive<Reset>({
  mode: (query.mode as string) || "default",
  email: "",
  password: "",
  passwordRep: "",
  isValid() {
    return this.email !== "";
  },
});

function showPass() {
  if (passDom.value.type === "text") {
    passIcon.value = "passInvisible";
    passDom.value.type = "password";
    passRepDom.value.type = "password";
  } else {
    passIcon.value = "passVisible";
    passDom.value.type = "text";
    passRepDom.value.type = "text";
  }
}

const colors = {
  main: "#333333",
  additional: "#d3d3d3",
  error: "#cc6666",
  valid: "#66cc68",
};

function changePower() {
  if (form.password.length >= 6 && form.passwordRep.length >= 6) {
    lineI.value.style.backgroundColor = colors.main;
  } else {
    lineI.value.style.backgroundColor = colors.additional;
    lineII.value.style.backgroundColor = colors.additional;
    lineIII.value.style.backgroundColor = colors.additional;
  }

  if (form.password.length >= 10 && form.passwordRep.length >= 10) {
    lineII.value.style.backgroundColor = colors.main;
  } else {
    lineII.value.style.backgroundColor = colors.additional;
    lineIII.value.style.backgroundColor = colors.additional;
  }

  if (form.password.length >= 14 && form.passwordRep.length >= 14) {
    lineIII.value.style.backgroundColor = colors.main;
  } else {
    lineIII.value.style.backgroundColor = colors.additional;
  }
  rightPass();
}

function rightPass() {
  if (form.password !== form.passwordRep) {
    passDom.value.style.color = colors.error;
    passRepDom.value.style.color = colors.error;
  } else if (!form.password && !form.passwordRep) {
    passDom.value.style.color = colors.additional;
    passRepDom.value.style.color = colors.additional;
  } else {
    passDom.value.style.color = colors.valid;
    passRepDom.value.style.color = colors.valid;
  }

  if (form.password.length < 6) {
    passDom.value.style.color = colors.error;
  }

  if (form.passwordRep.length < 6) {
    passRepDom.value.style.color = colors.error;
  }
}

function submitHandle() {
  switch (form.mode) {
    case "default":
      sendEmailReset();
      break;
    case "resetPassword":
      resetPassword();
      break;
  }
}

async function sendEmailReset() {
  if (form.isValid() && !isMailSend.value) {
    loadingStore.show();

    await sendPasswordResetEmail(getAuth(), form.email)
      .then(() => {
        isMailSend.value = true;
      })
      .catch((error) => {
        tipStore.update(error.message);
        loadingStore.hide();
      });
  }
}

async function resetPassword() {
  if (form.password.length >= 6 && form.password === form.passwordRep) {
    loadingStore.show();

    await confirmPasswordReset(
      getAuth(),
      query.oobCode as string,
      form.password
    ).then(() => {
      router.push("/login");
      tipStore.update("Пароль изменён");
      loadingStore.hide();
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

  form {
    display: grid;
    justify-content: center;
    align-items: center;

    width: 30%;
    min-width: 400px;
    margin: 0 auto;
    padding: 30px 40px 20px 40px;

    background-color: #fbfaf7;
    border-radius: 30px;
  }

  form.beforeSend {
    grid-template: 50px 90px 10px / 1fr;
    grid-template-areas:
      "email"
      "btnSubmit"
      "swap";
  }

  form.resetPassword {
    grid-template: 50px 50px 20px 90px 10px / 1fr;
    grid-template-areas:
      "pass"
      "passRep"
      "passPower"
      "btnSubmit"
      "swap";
  }

  h2 {
    margin: 0 0 60px 0;

    font-size: 70px;
    font-weight: 500;
    text-align: center;
    color: #999999;
  }

  .email {
    position: relative;

    grid-area: email;
  }

  .email::after,
  .pass::after,
  .passRep::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;

    width: 100%;
    height: 1px;

    background-color: #d3d3d3;
  }

  .email input,
  .pass input,
  .passRep input {
    width: 100%;
    height: 100%;

    font-size: 18px;

    background-color: transparent;

    user-select: text;
  }

  .email:focus-within::after,
  .pass:focus-within::after,
  .passRep:focus-within::after {
    bottom: -1px;

    height: 2px;

    background-color: #333333;
  }

  .pass {
    position: relative;

    grid-area: pass;
  }

  .passRep {
    position: relative;

    grid-area: passRep;
  }

  .passPower {
    display: grid;

    grid-area: passPower;
    grid-gap: 5%;
    grid-template: 100% / 1fr 1fr 1fr;
  }

  .powerLines {
    width: 100%;
    height: 5px;

    background-color: lightgray;

    transition: all 0.5s;
  }

  label > img {
    position: absolute;
    top: 0;
    right: 0;

    width: 20px;
    height: 20px;

    cursor: pointer;
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

  .btnSubmit.mailSend {
    cursor: not-allowed;
  }

  .btnSubmit.mailSend:hover {
    box-shadow: none;

    transform: none;
  }

  .inputLine {
    border-top: none;
    border-right: none;
    border-bottom: 1px solid lightgray;
    border-left: none;
  }

  .swapMode {
    display: flex;
    justify-content: center;

    grid-area: swap;
  }

  h5 {
    position: relative;

    font-weight: 600;
    color: gray;

    cursor: pointer;

    &::after {
      content: "";
      position: absolute;
      bottom: -2px;
      left: 0;

      width: 0;
      height: 2px;

      background-color: #333333;

      transition: all 0.4s;
    }

    &:hover::after {
      width: 100%;

      transition: all 0.4s;
    }
  }

  .demoVersion {
    margin-top: 20px;
    padding: 10px;

    background-color: #ffffff;
    border-radius: 10px;
  }

  @media screen and (max-width: 768px) {
    h2 {
      font-size: 50px;
    }
  }

  @media screen and (max-width: 480px) {
    form {
      width: 30%;
      min-width: 300px;
      padding: 30px 40px 20px 40px;
    }

    h2 {
      font-size: 40px;
    }
  }
}
</style>
