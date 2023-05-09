<template>
  <div class="home">
    <router-link class="home__link" draggable="false" to="/game">
      <img alt="Play" class="home__link-img" src="@/assets/img/play.svg" />
    </router-link>

    <router-link class="home__link" draggable="false" to="/settings">
      <img
        alt="Settings"
        class="home__link-img"
        src="@/assets/img/settings.svg"
      />
    </router-link>

    <router-link class="home__link" draggable="false" to="/analytics">
      <img
        alt="Analytics"
        class="home__link-img"
        src="@/assets/img/stats.svg"
      />
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useGameStore } from "@/stores/game";

const enum ButtonSize {
  min = 92,
  max = 184,
}

const gameStore = useGameStore();

const tabWidth = ref<ButtonSize | number>(ButtonSize.min);
const tabHeight = ref<ButtonSize | number>(ButtonSize.min);

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

  gap: 24px;

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
