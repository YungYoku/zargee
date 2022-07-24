<template>
  <button @click="share">
    Поделиться
    <img alt="Share" src="@/assets/icons/share.svg" />
  </button>
</template>

<script lang="ts" setup>
import { useTipStore } from "@/stores/tip";
import { useMainStore } from "@/stores/main";
import { useGameStore } from "@/stores/game";

const mainStore = useMainStore();
const gameStore = useGameStore();

const tipStore = useTipStore();

const share = () => {
  navigator.clipboard.writeText(
    `Смотри! Я дошёл до ${gameStore.lvl} уровня в Zargee! До какого сможешь дойти ты? Введи мой код ${mainStore.user.ref} при регистрации и получи приятный бонус! https://zargee-4c93f.web.app/reg?ref=${mainStore.user.ref}`
  );

  tipStore.update("Скопировано!");
};
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
