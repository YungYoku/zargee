<template>
  <div class="login">
    <game-loading v-if="loadingStore.loading" />

    <div class="login__form-wrap">
      <h2 class="title">Логин</h2>

      <login-email v-if="loginType === 'email'" />

      <auth-options
        v-else
        @email="setLoginType('email')"
        @google="setLoginType('google')"
      />

      <animated-link :link="'/reg'" class="swapMode" text="РЕГИСТРАЦИЯ" />
    </div>

    <animated-link :link="'/demo'" :text="'ДЕМО ВЕРСИЯ'" />
  </div>
</template>

<script lang="ts" setup>
import { useLoadingStore } from "@/stores/loading";
import AnimatedLink from "@/components/AnimatedLink.vue";
import GameLoading from "@/components/AppLoading.vue";
import { ref } from "vue";
import AuthOptions from "@/components/auth/AuthOptions.vue";
import LoginEmail from "@/components/login/LoginEmail.vue";

const loadingStore = useLoadingStore();

const loginType = ref("not specified");

const setLoginType = (type: "email" | "google") => {
  loginType.value = type;
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
  gap: 30px;

  &__form-wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 30%;
    min-width: 400px;
    max-width: 460px;
    margin: 0 auto;
    padding: 30px 40px 20px 40px;

    background-color: #fbfaf7;
    border-radius: 10px;
    box-shadow: 0 14px 20px 6px #eae0d5;

    gap: 20px;

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
  }
}
</style>
