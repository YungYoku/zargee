<template>
  <button @click="share">
    Поделиться
    <img alt="Share" src="@/assets/icons/share.svg" />
  </button>
</template>

<script lang="ts" setup>
import { useTipStore } from "@/stores/tip";

const tipStore = useTipStore();

function share() {
  tipStore.update("Недоступно");
}
</script>

<style lang="scss" scoped>
button {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
  padding: 20px;

  font-size: 28px;
  font-weight: 500;
  text-align: center;
  color: #333333;

  background-color: transparent;
  border: 6px solid #333333;
  border-radius: 5px;

  cursor: pointer;
}

img {
  width: 32px;
  height: 32px;
  margin-left: 20px;
}
</style>
