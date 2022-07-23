<template>
  <div class="lvl">
    <h3>Уровень: {{ gameStore.lvl }}</h3>

    <button class="sound" @click="swapSound">
      <img
        v-if="mainStore.isMusicPlayable"
        alt="Sound"
        src="@/assets/icons/sound.svg"
      />

      <img v-else alt="No sound" src="@/assets/icons/no-sound.svg" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useGameStore } from "@/stores/game";
import { useMainStore } from "@/stores/main";

const mainStore = useMainStore();
const gameStore = useGameStore();

function swapSound() {
  mainStore.swapSound();
}
</script>

<style lang="scss" scoped>
.lvl {
  z-index: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;

  font-size: 20px;
  text-align: center;
}

.lvl h3 {
  z-index: 2;

  padding: 10px;

  font-size: 20px;
}

.sound {
  z-index: 4;

  width: 20px;
  height: 20px;

  background-color: transparent;

  cursor: pointer;
}

.sound img {
  z-index: 4;

  width: 20px;
  height: 20px;

  background-color: transparent;

  cursor: pointer;
}
</style>
