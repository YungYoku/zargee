<template>
  <div class="settings">
    <game-loading v-if="loadingStore.loading" />

    <router-link class="back" to="/">
      <img alt="Back" src="../assets/icons/back.svg" />
    </router-link>

    <the-info-button :size="buttonSize" @open="showInfo" />

    <the-sound-button :size="buttonSize" />

    <the-logout-button :size="buttonSize" />

    <div
      v-if="infoShow"
      id="infoWrap"
      class="infoWrap"
      @click.stop="hideInfo($event)"
    >
      <div class="info">
        <div class="name">
          <h2>{{ mainStore.user.name }}</h2>

          <div class="name__lvl">{{ mainStore.user.lvl }}</div>

          <div class="name__info">
            <div @click="showPolitics">
              <img alt="Политика" src="@/assets/icons/file.svg" />
            </div>

            <h5 @click="showAbout">i</h5>
          </div>
        </div>

        <h4 class="life">Жизни: {{ mainStore.user.hearts }}</h4>

        <h4 class="life">Золотые жизни: {{ mainStore.user.gold }}</h4>

        <the-daily />

        <the-ad />

        <the-code />

        <the-ref-code />

        <settings-complexity />

        <game-politics v-if="politicsShow" @close="hidePolitics" />

        <the-about v-if="aboutShow" @close="hideAbout" />
      </div>
    </div>

    <div class="version">Версия: {{ version }}</div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { useRoute } from "vue-router";
import TheCode from "@/components/settings/SettingsCode.vue";
import TheAd from "@/components/settings/SettingsEarn.vue";
import TheRefCode from "@/components/settings/SettingsRefCode.vue";
import TheDaily from "@/components/settings/SettingsDaily.vue";
import TheAbout from "@/components/settings/SettingsAbout.vue";
import TheSoundButton from "@/components/settings/SettingsSoundButton.vue";
import TheInfoButton from "@/components/settings/SettingsInfoButton.vue";
import TheLogoutButton from "@/components/settings/SettingsLogoutButton.vue";
import GamePolitics from "@/components/GamePolitics.vue";
import GameLoading from "@/components/GameLoading.vue";
import { useLoadingStore } from "@/stores/loading";
import SettingsComplexity from "@/components/settings/SettingsComplexity.vue";

const mainStore = useMainStore();
const loadingStore = useLoadingStore();
const route = useRoute();

mainStore.setFirstPage(route.name as string);

const politicsShow = ref(false);
const aboutShow = ref(false);
const infoShow = ref(false);
const version = __APP_VERSION__;

const buttonSize = computed<string>(() => {
  const tabWidth = window.screen.availWidth * 0.25;
  const tabHeight = window.screen.availHeight * 0.25;

  return tabWidth < tabHeight ? tabWidth + "px" : tabHeight + "px";
});

function showPolitics() {
  politicsShow.value = true;
}

function hidePolitics() {
  politicsShow.value = false;
}

function showAbout() {
  aboutShow.value = true;
}

function hideAbout() {
  aboutShow.value = false;
}

function showInfo(id: string) {
  if (id === "infoWrap" || id === "infoButton" || id === "infoButtonImg") {
    infoShow.value = true;
  }
}

function hideInfo(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.id === "infoWrap") {
    infoShow.value = false;
  }
}
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
}

.infoWrap {
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100vh;

  background-color: rgba(0, 0, 0, 0.5);
}

.info {
  position: relative;

  display: grid;
  align-items: center;

  grid-gap: 5px;
  grid-template: repeat(8, 1fr) / 1fr;

  width: 30%;
  min-width: 300px;
  padding: 10px;
  overflow: hidden;

  text-align: center;

  background-color: #f5eee9;
  border-radius: 5px;
}

.name {
  display: grid;
  align-items: center;

  grid-gap: 10px;
  grid-template: 100% / auto 1fr 1fr;

  h2 {
    font-size: 40px;
    text-align: left;
  }

  &__lvl {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 40px;
    height: 40px;

    color: #333333;

    border: 2px solid #333333;
    border-radius: 50%;
  }
}

.name h5,
.name__info div {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 26px;
  height: 26px;
  margin-left: 10px;

  color: #333333;

  border: 2px solid #333333;
  border-radius: 50%;

  cursor: pointer;
}

.name__info {
  display: flex;
  justify-content: right;
  align-items: center;

  img {
    width: 16px;
    height: 16px;
  }

  h5 {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.life {
  padding: 10px;

  font-size: 16px;
  font-weight: 600;
  color: #333333;

  border: 2px solid #333333;
  border-radius: 5px;
}

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

  img {
    width: 20px;
    height: 20px;
  }
}

.version {
  margin-top: 20px;

  font-size: 16px;
}

@media screen and (max-width: 768px) {
  .info {
    width: 50%;
  }
}
</style>
