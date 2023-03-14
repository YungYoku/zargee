<template>
  <div class="lvl">
    <h3>Уровень: {{ gameStore.lvl }}</h3>

    <button class="sound" type="button" @click="swapSound">
      <img v-if="settingsStore.isMusicPlayable" :src="soundIcon" alt="Sound" />

      <img v-else :src="noSoundIcon" alt="No sound" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useGameStore } from "@/stores/game";
import { useSettingsStore } from "@/stores/settings";
import soundIcon from "@/assets/img/sound.svg";
import noSoundIcon from "@/assets/img/no-sound.svg";

const settingsStore = useSettingsStore();
const gameStore = useGameStore();

const swapSound = () => {
  console.log("e");
  settingsStore.swapSound();
};
</script>

<style lang="scss" scoped>
.lvl {
  z-index: 4;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;

  font-size: 20px;
  text-align: center;

  h3 {
    padding: 10px;

    font-size: 20px;
  }

  .sound {
    width: 20px;
    height: 20px;

    background-color: transparent;

    cursor: pointer;

    img {
      width: 20px;
      height: 20px;

      background-color: transparent;

      cursor: pointer;
    }
  }
}
</style>
