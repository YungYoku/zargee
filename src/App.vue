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

const mainStore = useMainStore();
const languagesStore = useLanguagesStore();
const router = useRouter();

const visibility = computed(() => document.visibilityState);
if (!visibility.value) mainStore.offSound();

if (localStorage.language) {
  languagesStore.swapLanguage(localStorage.language);
} else {
  languagesStore.swapLanguage("ru");
}

onMounted(() => {
  mainStore.loadInfo();
});

document.addEventListener("visibilitychange", () => {
  if (mainStore.soundChange) {
    if (document.visibilityState === "visible") {
      mainStore.onSound();
    } else {
      mainStore.offSound();
    }
  }
});

const audioPlaying = computed(() => {
  return (
    router.currentRoute.value.name !== "Game" &&
    router.currentRoute.value.name !== "LoginView.vue" &&
    mainStore.sound
  );
});
</script>

<style lang="scss" scoped>
#app {
  isolation: isolate;
}
</style>
