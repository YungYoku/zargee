<template>
  <div class="home">
    <router-link class="home__link" to="/game">
      <img alt="Play" class="home__link-img" src="@/assets/img/play.svg" />
    </router-link>

    <router-link class="home__link" to="/settings">
      <img
        alt="Settings"
        class="home__link-img"
        src="@/assets/img/settings.svg"
      />
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { useMainStore } from "@/stores/main";
import { useRoute } from "vue-router";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useGameStore } from "@/stores/game";

const enum ButtonSize {
  min = 80,
  max = 160,
}

const mainStore = useMainStore();
const gameStore = useGameStore();
const route = useRoute();

const tabWidth = ref(ButtonSize.min);
const tabHeight = ref(ButtonSize.min);

mainStore.setFirstPage(route.name as string);

const linkLength = computed(() =>
  tabWidth.value < tabHeight.value
    ? tabWidth.value + "px"
    : tabHeight.value + "px"
);

const resizeLinksSize = () => {
  tabWidth.value = formatLinkSize(window.screen.availWidth * 0.3);
  tabHeight.value = formatLinkSize(window.screen.availHeight * 0.3);
};

const formatLinkSize = (size: number) => {
  if (size > ButtonSize.max) {
    return ButtonSize.max;
  }

  if (size < ButtonSize.min) {
    return ButtonSize.min;
  }
  return size;
};

window.addEventListener("resize", resizeLinksSize);

onMounted(() => {
  resizeLinksSize();
  gameStore.reset();
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeLinksSize);
});
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100vh;

  gap: 20px;

  &__link {
    display: flex;
    justify-content: center;
    align-items: center;

    width: v-bind(linkLength);
    height: v-bind(linkLength);

    border: 4px solid #333333;
    border-radius: 50%;

    cursor: pointer;

    &-img {
      width: 50%;
      height: 50%;
    }
  }
}
</style>
