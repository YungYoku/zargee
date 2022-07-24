<template>
  <router-view />

  <audio v-if="audioPlaying" autoplay loop>
    <source src="@/assets/sounds/bg.mp3" />
  </audio>

  <game-tip />
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import GameTip from "@/components/GameTip.vue";
import { useMainStore } from "@/stores/main";
import { useRouter } from "vue-router";
import { useLanguagesStore } from "@/stores/languages";
import { useSettingsStore } from "@/stores/settings";

const mainStore = useMainStore();
const settingsStore = useSettingsStore();
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
  return (
    router.currentRoute.value.name !== "Game" &&
    router.currentRoute.value.name !== "LoginView.vue" &&
    settingsStore.isMusicPlayable
  );
});
</script>

<style lang="scss" scoped>
#app {
  isolation: isolate;
}
</style>
