<template>
  <div class="home">
    <router-link
      :style="{
        width: tabWidth < tabHeight ? tabWidth + 'px' : tabHeight + 'px',
        height: tabWidth < tabHeight ? tabWidth + 'px' : tabHeight + 'px',
      }"
      class="play"
      to="/game"
    >
      <img alt="Play" src="@/assets/icons/play.svg" />
    </router-link>

    <router-link
      :style="{
        width: tabWidth < tabHeight ? tabWidth + 'px' : tabHeight + 'px',
        height: tabWidth < tabHeight ? tabWidth + 'px' : tabHeight + 'px',
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
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100vh;
}

.play,
.settings {
  margin: 20px 0;

  border: 6px solid #333333;
  border-radius: 50%;

  cursor: pointer;
}

a img {
  width: 50%;
  height: 50%;
  margin: 25%;
}
</style>
