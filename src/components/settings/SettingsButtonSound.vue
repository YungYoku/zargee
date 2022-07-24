<template>
  <button
    :style="{
      width: size,
      minWidth: size,
      height: size,
      minHeight: size,
    }"
    class="soundButton"
    type="button"
    @click="turnOnSound"
  >
    <img :src="soundIcon" alt="Sound" />
  </button>
</template>

<script lang="ts" setup>
import sound from "@/assets/icons/sound.svg";
import noSound from "@/assets/icons/no-sound.svg";
import { computed } from "vue";
import { useSettingsStore } from "@/stores/settings";

defineProps({
  size: {
    type: String,
    required: true,
  },
});

const settingsStore = useSettingsStore();

const turnOnSound = () => {
  settingsStore.swapSound();
};

const soundIcon = computed(() => {
  return settingsStore.isMusicPlayable ? sound : noSound;
});
</script>

<style lang="scss" scoped>
.soundButton {
  overflow: hidden;

  background-color: transparent;
  border: 6px solid #333333;
  border-radius: 50%;

  cursor: pointer;
}

img {
  width: 50%;
  height: 50%;
  margin: 25%;
}
</style>
