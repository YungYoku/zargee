<template>
  <div class="authWrap">
    <h2>{{ languagesStore.language.registration.title }}</h2>

    <game-loading v-if="loadingStore.loading" />

    <form
      :style="{
        boxShadow: '0 14px 20px 6px ' + theme.shadow,
      }"
      class="registration"
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

      <label class="name" for="nameInput">
        <input
          id="nameInput"
          v-model.trim="form.name"
          :placeholder="languagesStore.language.registration.name"
          class="inputLine"
          type="text"
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

      <label class="passRep" for="passwordRepeatInput">
        <input
          id="passwordRepeatInput"
          ref="passRepDom"
          v-model.trim="form.passwordRep"
          :placeholder="languagesStore.language.registration.passwordRepeat"
          class="inputLine"
          type="password"
          @keyup="changePower"
        />
      </label>

      <label class="refCode" for="refInput">
        <input
          id="refInput"
          v-model.trim="form.refCode"
          class="inputLine"
          placeholder="Реф код(опционально)"
          type="text"
        />
      </label>

      <div class="passPower">
        <span ref="lineI" class="powerLines"></span>
        <span ref="lineII" class="powerLines"></span>
        <span ref="lineIII" class="powerLines"></span>
      </div>

      <label class="rules">
        <input v-model="form.rules" type="checkbox" />

        {{ languagesStore.language.registration.rulesCheck }}

        <button class="politicsBtn" @click="showPolitics">
          <img alt="Политика" src="@/assets/icons/politics.svg" />
        </button>

        <game-politics v-if="politicsShow" @close="hidePolitics" />
      </label>

      <button class="btnSubmit" type="submit">
        {{ languagesStore.language.registration.button }}
      </button>

      <animated-link
        :link="'/login'"
        :text="languagesStore.language.registration.swapMode"
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
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/main";
import { useRouter } from "vue-router";
import { theme } from "@/api/theme";
import { useTipStore } from "@/stores/tip";
import { useLoadingStore } from "@/stores/loading";
import GameLoading from "@/components/GameLoading.vue";
import AnimatedLink from "@/components/AnimatedLink.vue";
import GamePolitics from "@/components/GamePolitics.vue";

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
const languagesStore = useLanguagesStore();
const loadingStore = useLoadingStore();
const tipStore = useTipStore();
const router = useRouter();

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
      this.email !== "" &&
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

function showPolitics() {
  politicsShow.value = true;
}

function hidePolitics() {
  politicsShow.value = false;
}

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

async function submit() {
  if (form.isValid()) {
    loadingStore.show();

    await createUserWithEmailAndPassword(getAuth(), form.email, form.password)
      .then(async (userCredential) => {
        const uid = userCredential.user.uid;

        let _refCode = "";
        for (let i = 0; i < 9; i++) {
          _refCode += Math.floor(Math.random() * 9);
        }

        let bonus = false;
        if (form.refCode) {
          try {
            await updateDoc(doc(db, "refs", form.refCode), {
              refs: arrayUnion(form.name),
            });
            bonus = true;
          } catch (e) {
            tipStore.update("Такой код не существует");
          }
        }

        await setDoc(doc(db, "users", uid), {
          adWatchTime: 0,
          codes: [],
          complexity: 1,
          gold: bonus ? 1 : 0,
          hearts: bonus ? 10 : 1,
          lvl: 0,
          name: form.name,
          ref: _refCode,
          refUsers: 0,
          resetDay: 0,
          rewardDay: 1,
          rewardParts: {
            first: false,
            second: false,
          },
        });

        await setDoc(doc(db, "refs", _refCode), {
          name: form.name,
          refs: [],
        });

        mainStore.login(uid);
        await mainStore.loadInfo();
        await router.push("/");

        loadingStore.hide();
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/email-already-in-use":
            tipStore.update("Почта уже используется");
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
    position: relative;

    display: grid;
    justify-content: center;
    align-items: center;

    grid-template: 50px 50px 50px 50px 50px 50px 30px 70px 50px / 1fr;
    grid-template-areas:
      "email"
      "name"
      "pass"
      "passRep"
      "refCode"
      "passPower"
      "rules"
      "btnSubmit"
      "swap";

    width: 30%;
    min-width: 400px;
    margin: 0 auto;
    padding: 30px 40px 20px 40px;
    overflow: hidden;

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
    .name::after,
    .pass::after,
    .passRep::after,
    .refCode::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;

      width: 100%;
      height: 1px;

      background-color: #d3d3d3;
    }

    .email input,
    .name input,
    .pass input,
    .passRep input,
    .refCode input {
      width: 100%;
      height: 100%;

      font-size: 18px;

      background-color: transparent;

      user-select: text;
    }

    .email:focus-within::after,
    .name:focus-within::after,
    .pass:focus-within::after,
    .passRep:focus-within::after,
    .refCode:focus-within::after {
      bottom: -1px;

      height: 2px;

      background-color: #333333;
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

    .name {
      position: relative;

      grid-area: name;
    }

    .pass {
      position: relative;

      grid-area: pass;
    }

    .passRep {
      position: relative;

      grid-area: passRep;
    }

    .refCode {
      position: relative;

      grid-area: refCode;
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

    .rules {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      grid-area: rules;

      color: initial;

      input {
        margin: 0 10px 0 0;
      }

      button {
        margin-left: auto;
      }
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

    .swapMode {
      grid-area: swap;
    }
  }

  .demoVersion {
    margin-top: 20px;
    padding: 10px;

    background-color: #ffffff;
    border-radius: 10px;

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
  }

  .politicsBtn {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 26px;
    height: 26px;
    margin-left: 10px;

    color: #333333;

    border: 3px solid #333333;
    border-radius: 50%;

    cursor: pointer;

    img {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
