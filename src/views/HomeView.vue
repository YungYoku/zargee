<template>
  <div class="home">
    <router-link
      :style="{
        width: linkWidth,
        height: linkHeight,
      }"
      class="play"
      to="/game"
    >
      <img alt="Play" src="@/assets/icons/play.svg" />
    </router-link>

    <router-link
      :style="{
        width: linkWidth,
        height: linkHeight,
      }"
      class="settings"
      to="/settings"
    >
      <img alt="Settings" src="@/assets/icons/settings.svg" />
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { useMainStore } from "@/stores/main";
import { useRoute } from "vue-router";
import { computed } from "vue";

const mainStore = useMainStore();
const route = useRoute();

const tabWidth = computed(() => window.screen.availWidth * 0.3);
const tabHeight = computed(() => window.screen.availHeight * 0.3);

mainStore.setFirstPage(route.name as string);

const linkWidth = computed(() =>
  tabWidth.value < tabHeight.value
    ? tabWidth.value + "px"
    : tabHeight.value + "px"
);

const linkHeight = computed(() =>
  tabWidth.value < tabHeight.value
    ? tabWidth.value + "px"
    : tabHeight.value + "px"
);
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100vh;

  .play,
  .settings {
    margin: 20px 0;

    border: 6px solid #333333;
    border-radius: 50%;

    cursor: pointer;

    img {
      width: 50%;
      height: 50%;
      margin: 25%;
    }
  }
}
</style>
