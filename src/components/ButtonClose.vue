<template>
  <button class="button-close" type="button" @click="close">
    <img alt="Back" class="button-close__img" src="@/assets/img/back.svg" />
  </button>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";

const emit = defineEmits(["close"]);

const router = useRouter();

const close = async () => {
  emit("close");
  await router.go(-1);
};
</script>

<style lang="scss" scoped>
.button-close {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 48px;
  min-width: 48px;
  height: 48px;
  min-height: 48px;
  margin-right: auto;

  background-color: transparent;
  border: 1px solid #333333;
  border-radius: 50%;

  cursor: pointer;

  .button-close__img {
    width: 24px;
    height: 24px;
  }
}
</style>
