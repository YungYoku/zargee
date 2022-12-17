<template>
  <div class="settings">
    <game-loading v-if="loadingStore.loading" />

    <router-link class="back" to="/">
      <img alt="Back" src="@/assets/img/back.svg" />
    </router-link>

    <router-link class="userButton" to="/settings/user">
      <settings-button-user :size="buttonSize" />
    </router-link>

    <settings-button-sound :size="buttonSize" />

    <settings-button-logout :size="buttonSize" />

    <router-view @click.stop="hideInfo" />

    <div class="version">Версия: {{ version }}</div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { useLoadingStore } from "@/stores/loading";
import { useRoute, useRouter } from "vue-router";
import SettingsButtonSound from "@/components/settings/SettingsButtonSound.vue";
import SettingsButtonUser from "@/components/settings/SettingsButtonUser.vue";
import SettingsButtonLogout from "@/components/settings/SettingsButtonLogout.vue";
import GameLoading from "@/components/AppLoading.vue";

const enum ButtonSize {
  min = 80,
  max = 160,
}

const mainStore = useMainStore();
const loadingStore = useLoadingStore();
const router = useRouter();
const route = useRoute();

mainStore.setFirstPage(route.name as string);

const tabWidth = ref(ButtonSize.min);
const tabHeight = ref(ButtonSize.min);

const infoShow = ref(false);
// eslint-disable-next-line no-undef
const version = APP_VERSION;

const buttonSize = computed(() => {
  return tabWidth.value < tabHeight.value
    ? tabWidth.value + "px"
    : tabHeight.value + "px";
});

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

onMounted(resizeLinksSize);

onUnmounted(() => {
  window.removeEventListener("resize", resizeLinksSize);
});

const showInfo = (id: string) => {
  if (id === "info" || id === "infoButton" || id === "infoButtonImg") {
    infoShow.value = true;
  }
};

const hideInfo = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.id === "info") {
    router.push("/settings");
  }
};
</script>

<style lang="scss" scoped>
.settings {
  position: relative;
  z-index: 2;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100vh;
  gap: 20px;

  .back {
    position: absolute;
    top: 20px;
    left: 20px;

    display: flex;
    justify-content: center;
    align-items: center;

    width: 46px;
    height: 46px;

    border: 1px solid #333333;
    border-radius: 50%;

    cursor: pointer;

    img {
      width: 20px;
      height: 20px;
    }
  }

  .version {
    position: absolute;
    bottom: 20px;

    font-size: 16px;
  }
}
</style>
