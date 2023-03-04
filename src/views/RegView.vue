<template>
  <div class="authWrap">
    <game-loading v-if="loadingStore.loading" />

    <form class="registration" @submit.prevent="register">
      <h2 class="title">Регистрация</h2>

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

      <label class="name" for="nameInput">
        <input
          id="nameInput"
          v-model.trim="form.name"
          class="inputLine"
          placeholder="Имя"
          required
          type="text"
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
          @keyup="changePower"
        />

        <button type="button" @click="swapPassShowing">
          <img :src="passShowingIcon" alt="view" />
        </button>
      </label>

      <label class="passRep" for="passwordRepeatInput">
        <input
          id="passwordRepeatInput"
          ref="passRepDom"
          v-model.trim="form.passwordRep"
          class="inputLine"
          placeholder="Повторите пароль"
          required
          type="password"
          @keyup="changePower"
        />
      </label>

      <div class="passPower">
        <span ref="lineI" class="powerLines"></span>
        <span ref="lineII" class="powerLines"></span>
        <span ref="lineIII" class="powerLines"></span>
      </div>

      <label class="refCode" for="refInput">
        <input
          id="refInput"
          v-model.trim="form.refCode"
          class="inputLine"
          placeholder="Реф код(опционально)"
          type="text"
        />
      </label>

      <label class="rules">
        <input v-model="form.rules" type="checkbox" />

        <span> Я согласен с правилами. </span>

        <button class="politicsBtn" @click="showPolitics">
          <img alt="Политика" src="@/assets/img/file.svg" />
        </button>

        <game-politics v-if="politicsShow" @close="hidePolitics" />
      </label>

      <button class="btnSubmit" type="submit">Отправить</button>

      <animated-link :link="'/login'" class="swapMode" text="ЛОГИН" />
    </form>

    <animated-link :link="'/demo'" :text="'ДЕМО ВЕРСИЯ'" />
  </div>
</template>

<script lang="ts" setup>
import { useMainStore } from "@/stores/main";
import { useSettingsStore } from "@/stores/settings";
import { useLoadingStore } from "@/stores/loading";
import { useTipStore } from "@/stores/tip";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useRouter } from "vue-router";
import GameLoading from "@/components/AppLoading.vue";
import AnimatedLink from "@/components/AnimatedLink.vue";
import GamePolitics from "@/components/AppPolitics.vue";
import type { AuthError } from "@/interfaces/authError";
import type { AuthResponse } from "@/interfaces/authResponse";
import { useAuthStore } from "@/stores/auth";
import passVisible from "@/assets/img/passVisible.svg";
import passInvisible from "@/assets/img/passInvisible.svg";

interface Registration {
  mode: string;
  email: string;
  name: string;
  password: string;
  passwordRep: string;
  refCode: string;
  rules: boolean;
  isValid: () => boolean;
}

const mainStore = useMainStore();
const authStore = useAuthStore();
const settingsStore = useSettingsStore();
const loadingStore = useLoadingStore();
const tipStore = useTipStore();
const router = useRouter();

const emailReg = new RegExp(
  /^[_a-z\d-+-]+(\.[_a-z\d-]+)*@[a-z\d-]+(\.[a-z\d-]+)*(\.[a-z]{2,})$/i
);

const form = reactive<Registration>({
  mode: "reg",
  email: "",
  name: "",
  password: "",
  passwordRep: "",
  refCode: "",
  rules: false,
  isValid() {
    return (
      this.password === this.passwordRep &&
      this.password.length >= 6 &&
      emailReg.test(this.email) &&
      this.name !== "" &&
      this.rules
    );
  },
});
const passDom = ref();
const passRepDom = ref();
const lineI = ref();
const lineII = ref();
const lineIII = ref();

const passIcon = ref("passInvisible");
const politicsShow = ref(false);

onMounted(() => {
  const queryRef = router.currentRoute.value.query["ref"] as string;
  if (queryRef) {
    if (queryRef.length === 9) {
      form.refCode = queryRef;
    } else {
      router.push("/reg");
    }
  }
});

watch(
  () => form.name,
  () => {
    form.name = form.name.slice(0, 8);
  }
);

const showPolitics = () => {
  politicsShow.value = true;
};

const hidePolitics = () => {
  politicsShow.value = false;
};

const passShowingIcon = computed(() => {
  if (passIcon.value === "passVisible") {
    return passVisible;
  }
  return passInvisible;
});

const swapPassShowing = () => {
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

const handleResponse = async (response: AuthResponse) => {
  const uid = response.user.uid;

  const bonus = await authStore.isUsedRefCodeReal(form.name, form.refCode);

  await authStore.addEmptyUserToDb(uid, form.name, bonus);

  mainStore.login(uid);
  settingsStore.updateSettings();
  settingsStore.swapSound();
  await mainStore.loadInfo();
  await router.push("/");
};

const handleError = (error: AuthError) => {
  switch (error.code) {
    case "auth/email-already-in-use":
      tipStore.update("Почта уже используется");
      form.email = "";
      form.name = "";
      form.password = "";
      form.passwordRep = "";
      form.refCode = "";
      form.rules = false;
      changePower();
      break;
    default:
      tipStore.update("Ошибка");
      form.email = "";
      form.name = "";
      form.password = "";
      form.passwordRep = "";
      form.refCode = "";
      form.rules = false;
      changePower();
      break;
  }
};

const register = async () => {
  if (form.isValid()) {
    loadingStore.show();

    await createUserWithEmailAndPassword(getAuth(), form.email, form.password)
      .then(handleResponse)
      .catch(handleError);

    loadingStore.hide();
  } else {
    console.error("Form is not valid!");
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

  .registration {
    position: relative;

    display: flex;
    flex-direction: column;
    gap: 18px;

    width: 30%;
    min-width: 400px;
    max-width: 460px;
    margin: 0 auto;
    padding: 30px 40px 20px 40px;
    overflow: hidden;

    background-color: #fbfaf7;
    border-radius: 5px;
    box-shadow: 0 14px 20px 6px #eae0d5;

    @media screen and (max-width: 480px) {
      width: 90%;
      min-width: 300px;
    }

    .title {
      margin-bottom: auto;

      font-size: 32px;
      font-weight: 400;
      text-align: center;
      color: #333333;
    }

    .email,
    .name,
    .pass,
    .passRep,
    .refCode {
      position: relative;

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

    .politicsBtn {
      display: flex;
      justify-content: center;
      align-items: center;

      width: 26px;
      height: 26px;
      margin-left: 10px;

      color: #333333;

      border: 1px solid #333333;
      border-radius: 50%;

      cursor: pointer;

      img {
        width: 16px;
        height: 16px;
      }
    }

    .pass {
      position: relative;

      button {
        position: absolute;
        top: 0;
        right: 0;

        width: 20px;
        height: 20px;

        img {
          width: 100%;
          height: 100%;

          cursor: pointer;
        }
      }
    }

    .passPower {
      display: grid;

      grid-gap: 10px;
      grid-template: 100% / 1fr 1fr 1fr;
    }

    .powerLines {
      width: 100%;
      height: 5px;

      background-color: lightgray;

      transition: all 0.5s;
    }

    .rules {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      font-size: 14px;
      color: initial;

      input {
        position: relative;

        width: 14px;
        height: 14px;
        margin: 0 5px 0 0;

        border: 1px solid #333333;
        border-radius: 2px;

        cursor: pointer;
      }

      span {
        line-height: 14px;
      }

      button {
        margin-left: auto;
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

  .demoVersion {
    margin-top: 20px;
    padding: 10px;

    background-color: #ffffff;
    border-radius: 10px;

    h5 {
      position: relative;

      font-weight: 700;
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
  }
}
</style>
