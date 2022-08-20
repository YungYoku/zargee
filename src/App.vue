<template>
  <router-view />

  <game-tip />
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, watch } from "vue";
import { useMainStore } from "@/stores/main";
import { useRouter } from "vue-router";
import { useSettingsStore } from "@/stores/settings";
import { useSoundsStore } from "@/stores/sounds";
import GameTip from "@/components/AppTip.vue";

const mainStore = useMainStore();
const settingsStore = useSettingsStore();
const soundsStore = useSoundsStore();
const router = useRouter();

const changeVolumeOnPageView = () => {
  if (settingsStore.isMusicChangeable) {
    if (document.visibilityState === "visible") {
      settingsStore.onSound();
    } else {
      settingsStore.offSound();
    }
  }
};

onMounted(() => {
  mainStore.loadUIDFromLocalStorage();

  settingsStore.updateSettings();

  mainStore.loadInfo();

  document.addEventListener("visibilitychange", changeVolumeOnPageView);
});

onUnmounted(() => {
  document.removeEventListener("visibilitychange", changeVolumeOnPageView);
});

const audioPlaying = computed(() => {
  return (
    router.currentRoute.value.meta["audio"] && settingsStore.isMusicPlayable
  );
});

watch(
  audioPlaying,
  () => {
    if (audioPlaying.value) {
      soundsStore.playBgMusic();
    } else {
      soundsStore.stopBgMusic();
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
#app {
  isolation: isolate;
}
</style>
