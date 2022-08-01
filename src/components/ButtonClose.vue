<template>
  <button type="button" @click="close" class="button-close">
    <img alt="Back" class="button-close__img" src="@/assets/img/back.svg" />
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};
</script>

<style lang="scss" scoped>
.button-close {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 36px;
  min-width: 36px;
  height: 36px;
  min-height: 36px;
  margin-right: auto;

  background-color: transparent;
  border: 2px solid #333333;
  border-radius: 50%;

  cursor: pointer;

  .button-close__img {
    width: 16px;
    height: 16px;
  }
}
</style>
