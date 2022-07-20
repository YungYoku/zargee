<template>
  <button
    :style="{
      width: size,
      minWidth: size,
      height: size,
      minHeight: size,
    }"
    class="soundButton"
    @click="turnOnSound"
  >
    <img :src="mainStore.sound ? sound : noSound" alt="Sound" />
  </button>
</template>

<script lang="ts" setup>
import { useMainStore } from "@/stores/main";
import sound from "@/assets/icons/sound.svg";
import noSound from "@/assets/icons/no-sound.svg";

defineProps({
  size: {
    type: String,
    required: true,
  },
});
const mainStore = useMainStore();

function turnOnSound() {
  mainStore.swapSound();
}
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
