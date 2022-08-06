<template>
  <div class="recaptcha">
    <button class="recaptcha__button" type="button" @click="recaptcha">
      Recaptcha
    </button>
  </div>
</template>

<script setup lang="ts">
import { useReCaptcha } from "vue-recaptcha-v3";

const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();
const recaptcha = async () => {
  // (optional) Wait until recaptcha has been loaded.
  await recaptchaLoaded();

  // Execute reCAPTCHA with action "login".
  const token = await executeRecaptcha("login");

  // Do stuff with the received token.
};
</script>

<style lang="scss" scoped>
.recaptcha {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;

  &__button {
    padding: 5px;

    border: 1px solid #333333;
    border-radius: 5px;
  }
}
</style>
