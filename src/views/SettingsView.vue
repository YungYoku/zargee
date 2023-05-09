<template>
  <div class="settings">
    <game-loading v-if="loadingStore.loading" />

    <router-link alt="Назад" class="back" draggable="false" to="/">
      <img alt="Back" src="@/assets/img/back.svg" />
    </router-link>

    <settings-button-user :size="buttonSize" />

    <settings-button-sound :size="buttonSize" />

    <settings-button-logout :size="buttonSize" />

    <router-view @click.stop="hideInfo" />

    <div class="version">Версия: {{ version }}</div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useLoadingStore } from "@/stores/loading";
import { useRouter } from "vue-router";
import SettingsButtonSound from "@/components/settings/SettingsButtonSound.vue";
import SettingsButtonUser from "@/components/settings/SettingsButtonUser.vue";
import SettingsButtonLogout from "@/components/settings/SettingsButtonLogout.vue";
import GameLoading from "@/components/AppLoading.vue";

const enum ButtonSize {
  min = 92,
  max = 184,
}

const loadingStore = useLoadingStore();
const router = useRouter();

const tabWidth = ref(ButtonSize.min);
const tabHeight = ref(ButtonSize.min);

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
  gap: 24px;

  .back {
    position: absolute;
    top: 24px;
    left: 24px;

    display: flex;
    justify-content: center;
    align-items: center;

    width: 48px;
    height: 48px;

    border: 1px solid #333333;
    border-radius: 50%;

    cursor: pointer;

    img {
      width: 24px;
      height: 24px;
    }
  }

  .version {
    position: absolute;
    bottom: 20px;

    font-size: 16px;
  }
}
</style>
