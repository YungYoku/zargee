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
import soundIcon from "@/assets/icons/sound.svg";
import noSoundIcon from "@/assets/icons/no-sound.svg";

const settingsStore = useSettingsStore();
const gameStore = useGameStore();

const swapSound = () => {
  settingsStore.swapSound();
};
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
