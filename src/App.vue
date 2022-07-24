<template>
  <router-view />

  <game-tip />
</template>

<script lang="ts" setup>
import { computed, onMounted, watch } from "vue";
import GameTip from "@/components/GameTip.vue";
import { useMainStore } from "@/stores/main";
import { useRouter } from "vue-router";
import { useLanguagesStore } from "@/stores/languages";
import { useSettingsStore } from "@/stores/settings";
import { useSoundsStore } from "@/stores/sounds";

const mainStore = useMainStore();
const settingsStore = useSettingsStore();
const soundsStore = useSoundsStore();
const languagesStore = useLanguagesStore();
const router = useRouter();

const visibility = computed(() => document.visibilityState);
if (!visibility.value) {
  settingsStore.offSound();
}

if (localStorage.language) {
  languagesStore.swapLanguage(localStorage.language);
} else {
  languagesStore.swapLanguage("ru");
}

onMounted(() => {
  mainStore.loadUIDFromLocalStorage();

  settingsStore.updateSettings();

  mainStore.loadInfo();
});

document.addEventListener("visibilitychange", () => {
  if (settingsStore.isMusicChangeable) {
    if (document.visibilityState === "visible") {
      settingsStore.onSound();
    } else {
      settingsStore.offSound();
    }
  }
});

const audioPlaying = computed(() => {
  return router.currentRoute.value.meta.audio && settingsStore.isMusicPlayable;
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
