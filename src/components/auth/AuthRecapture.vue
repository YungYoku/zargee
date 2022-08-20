<template>
  <div class="recaptcha">
    <vue-recaptcha
      :sitekey="'6Ld3yVIhAAAAAGk3si4mQCHfbfIBOqZFLmkVtAnK'"
      :load-recaptcha-script="true"
      @verify="handleSuccess"
      @error="handleError"
    />
  </div>
</template>

<script setup lang="ts">
import { VueRecaptcha } from "vue-recaptcha";

const handleSuccess = () => {
  return;
};

const handleError = () => {
  return;
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
