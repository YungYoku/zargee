<template>
  <div class="authWrap">
    <form class="reset" @submit.prevent="submitHandle">
      <h2 class="title">
        {{ languagesStore.language.reset.title }}
      </h2>

      <label
        v-if="form.mode === 'default' && !isMailSend"
        class="email"
        for="emailInput"
      >
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

      <animated-link
        :text="languagesStore.language.reset.toLogin"
        class="swapMode"
        link="login"
      />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { useMainStore } from "@/stores/main";
import { useLanguagesStore } from "@/stores/languages";
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  confirmPasswordReset,
  getAuth,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useLoadingStore } from "@/stores/loading";
import { useTipStore } from "@/stores/tip";
import AnimatedLink from "@/components/AnimatedLink.vue";

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

const emailReg = new RegExp(
  /^[_a-z\d-+-]+(\.[_a-z\d-]+)*@[a-z\d-]+(\.[a-z\d-]+)*(\.[a-z]{2,})$/i
);

const form = reactive<Reset>({
  mode: (query.mode as string) || "default",
  email: "",
  password: "",
  passwordRep: "",
  isValid() {
    return emailReg.test(this.email);
  },
});

const showPass = () => {
  if (passDom.value.type === "text") {
    passIcon.value = "passInvisible";
    passDom.value.type = "password";
    passRepDom.value.type = "password";
  } else {
    passIcon.value = "passVisible";
    passDom.value.type = "text";
    passRepDom.value.type = "text";
  }
};

const colors = {
  main: "#333333",
  additional: "#d3d3d3",
  error: "#cc6666",
  valid: "#66cc68",
};

const changePower = () => {
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
};

const rightPass = () => {
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
};

const submitHandle = () => {
  switch (form.mode) {
    case "default":
      sendEmailReset();
      break;
    case "resetPassword":
      resetPassword();
      break;
  }
};

const sendEmailReset = async () => {
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
};

const resetPassword = async () => {
  if (form.password.length >= 6 && form.password === form.passwordRep) {
    loadingStore.show();

    await confirmPasswordReset(
      getAuth(),
      query.oobCode as string,
      form.password
    ).then(async () => {
      await router.push("/login");
      tipStore.update("Пароль изменён");
    });

    loadingStore.hide();
  }
};
</script>

<style lang="scss" scoped>
.authWrap {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100vh;

  .reset {
    display: flex;
    flex-direction: column;

    width: 30%;
    min-width: 400px;
    max-width: 460px;
    margin: 0 auto;
    padding: 30px 40px 20px 40px;
    gap: 18px;

    background-color: #fbfaf7;
    border-radius: 15px;
    box-shadow: 0 14px 20px 6px #eae0d5;

    @media screen and (max-width: 480px) {
      width: 90%;
      min-width: 300px;
    }
  }

  .title {
    margin-bottom: auto;

    font-size: 32px;
    font-weight: 400;
    text-align: center;
    color: #333333;
  }

  .email {
    position: relative;
  }

  .email,
  .pass,
  .passRep {
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

  .pass {
    position: relative;
  }

  .passRep {
    position: relative;
  }

  .passPower {
    display: grid;

    grid-gap: 5%;
    grid-template: 100% / 1fr 1fr 1fr;
  }

  .powerLines {
    width: 100%;
    height: 5px;

    background-color: lightgray;

    transition: all 0.5s;
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

  .btnSubmit {
    z-index: 3;

    padding: 10px 0;

    font-size: 20px;
    font-weight: 400;
    text-align: center;
    color: white;

    background-color: #333333;
    border: none;
    border-radius: 10px;
    outline: none;

    cursor: pointer;

    &:hover {
      box-shadow: 0 10px 14px 5px lightgray;

      transform: scale(1.05);
    }
  }

  .btnSubmit.mailSend {
    cursor: not-allowed;

    &:hover {
      box-shadow: none;

      transform: none;
    }
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
