<template>
  <div ref="yandex_left" class="yandex_wrap left">
    <div id="yandex_left_pc"></div>

    <div id="yandex_left_laptop"></div>
  </div>

  <router-view />

  <app-tip />

  <div ref="yandex_right" class="yandex_wrap right">
    <div id="yandex_right_pc"></div>

    <div id="yandex_right_laptop"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useMainStore } from "@/stores/main";
import { useRouter } from "vue-router";
import { useSettingsStore } from "@/stores/settings";
import { useSoundsStore } from "@/stores/sounds";
import AppTip from "@/components/AppTip.vue";

const mainStore = useMainStore();
const settingsStore = useSettingsStore();
const soundsStore = useSoundsStore();
const router = useRouter();
const yandex_left = ref(null);
const yandex_right = ref(null);

const isRouteGame = computed(() => {
  const routeName = router.currentRoute.value.name;
  return routeName === "Game" || routeName === "Demo";
});
watch(isRouteGame, () => {
  if (isRouteGame.value) {
    hideSideAds();
  } else {
    showSideAds();
  }
});

const changeVolumeOnPageView = () => {
  if (settingsStore.isMusicChangeable) {
    if (document.visibilityState === "visible") {
      settingsStore.onSound();
    } else {
      settingsStore.offSound();
    }
  }
};

const hideSideAds = () => {
  if (yandex_right.value) {
    const yrDom = yandex_right.value as HTMLElement;
    yrDom.classList.add("hide");
  }
  if (yandex_left.value) {
    const ylDom = yandex_left.value as HTMLElement;
    ylDom.classList.add("hide");
  }
};
const showSideAds = () => {
  if (yandex_right.value) {
    const yrDom = yandex_right.value as HTMLElement;
    yrDom.classList.remove("hide");
  }
  if (yandex_left.value) {
    const ylDom = yandex_left.value as HTMLElement;
    ylDom.classList.remove("hide");
  }
};

const mountSideAds = () => {
  const ads = [
    {
      renderTo: "yandex_left_pc",
      blockId: "R-A-1981739-1",
    },
    {
      renderTo: "yandex_left_laptop",
      blockId: "R-A-1981739-7",
    },
    {
      renderTo: "yandex_right_pc",
      blockId: "R-A-1981739-2",
    },
    {
      renderTo: "yandex_right_laptop",
      blockId: "R-A-1981739-8",
    },
  ];

  ads.forEach((ad) => {
    window.yaContextCb.push(() => {
      // eslint-disable-next-line no-undef
      Ya.Context.AdvManager.render(ad);
    });
  });
};

const start = () => {
  mainStore.loadUIDFromLocalStorage();

  settingsStore.updateSettings();

  mainStore.loadInfo();
};

start();
onMounted(() => {
  document.addEventListener("visibilitychange", changeVolumeOnPageView);

  mountSideAds();
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

  .yandex_wrap {
    position: absolute;
    top: 10vh;
    z-index: 10;

    display: flex;
    justify-content: center;
    align-items: center;

    max-width: 225px;
    height: 80vh;

    &.left {
      left: 9%;
    }

    &.right {
      right: 9%;
    }

    &.hide {
      display: none;
    }

    @media (max-width: 1200px) {
      &.left {
        left: 5%;
      }

      &.right {
        right: 5%;
      }
    }

    @media (max-width: 1024px) {
      max-width: 160px;
      &.left {
        left: 2%;
      }

      &.right {
        right: 2%;
      }
    }
  }

  #yandex_left_pc,
  #yandex_right_pc {
    height: 675px;

    @media (max-width: 1024px) {
      display: none;
    }
  }

  #yandex_left_laptop,
  #yandex_right_laptop {
    height: 600px;

    @media (min-width: 1024px) {
      display: none;
    }

    @media (max-width: 768px) {
      display: none;
    }
  }
}
</style>
