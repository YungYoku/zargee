<template>
  <div class="settings">
    <game-loading v-if="loadingStore.loading" />

    <router-link class="back" to="/">
      <img alt="Back" src="@/assets/icons/back.svg" />
    </router-link>

    <settings-button-user :size="buttonSize" @open="showInfo" />

    <settings-button-sound :size="buttonSize" />

    <settings-button-logout :size="buttonSize" />

    <settings-user v-if="infoShow" @click.stop="hideInfo" />

    <div class="version">Версия: {{ version }}</div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { useLoadingStore } from "@/stores/loading";
import { useRoute } from "vue-router";
import SettingsButtonSound from "@/components/settings/SettingsButtonSound.vue";
import SettingsButtonUser from "@/components/settings/SettingsButtonUser.vue";
import SettingsButtonLogout from "@/components/settings/SettingsButtonLogout.vue";
import GameLoading from "@/components/GameLoading.vue";
import SettingsUser from "@/components/settings/SettingsUser.vue";

const mainStore = useMainStore();
const loadingStore = useLoadingStore();
const route = useRoute();

mainStore.setFirstPage(route.name as string);

const infoShow = ref(false);
// eslint-disable-next-line no-undef
const version = APP_VERSION;

const buttonSize = computed(() => {
  const tabWidth = window.screen.availWidth * 0.25;
  const tabHeight = window.screen.availHeight * 0.25;

  return tabWidth < tabHeight ? tabWidth + "px" : tabHeight + "px";
});

const showInfo = (id: string) => {
  if (id === "info" || id === "infoButton" || id === "infoButtonImg") {
    infoShow.value = true;
  }
};

const hideInfo = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.id === "info") {
    infoShow.value = false;
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

    border: 2px solid #333333;
    border-radius: 50%;

    cursor: pointer;

    img {
      width: 20px;
      height: 20px;
    }
  }

  .version {
    margin-top: 20px;

    font-size: 16px;
  }
}
</style>
