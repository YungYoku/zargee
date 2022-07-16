<template>
  <div class="settings">
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
              <img alt="Политика" src="@/assets/icons/politics.svg" />
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

        <div class="complexity">
          <input
            v-model.number="mainStore.user.complexity"
            max="4"
            min="1"
            step="1"
            type="range"
          />
          <div class="complexity__fire">
            <img
              v-for="complexity in 4"
              :key="complexity"
              :src="mainStore.user.complexity >= complexity ? fireOn : fireOff"
              alt="Fire"
              @click="changeComplexity(complexity)"
            />
          </div>
        </div>

        <game-politics v-if="politicsShow" @close="hidePolitics" />

        <the-about v-if="aboutShow" @close="hideAbout" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { useRoute } from "vue-router";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/main";
import TheCode from "@/components/settings/SettingsCode.vue";
import TheAd from "@/components/settings/SettingsEarn.vue";
import TheRefCode from "@/components/settings/SettingsRefCode.vue";
import TheDaily from "@/components/settings/SettingsDaily.vue";
import TheAbout from "@/components/settings/SettingsAbout.vue";
import TheSoundButton from "@/components/settings/SettingsSoundButton.vue";
import TheInfoButton from "@/components/settings/SettingsInfoButton.vue";
import TheLogoutButton from "@/components/settings/SettingsLogoutButton.vue";
import GamePolitics from "@/components/GamePolitics.vue";
import fireOn from "@/assets/icons/fireOn.svg";
import fireOff from "@/assets/icons/fireOff.svg";

const mainStore = useMainStore();
const route = useRoute();

mainStore.setFirstPage(route.name as string);

const politicsShow = ref(false);
const aboutShow = ref(false);
const infoShow = ref(false);

const buttonSize = computed<string>(() => {
  const tabWidth = window.screen.availWidth * 0.25;
  const tabHeight = window.screen.availHeight * 0.25;

  return tabWidth < tabHeight ? tabWidth + "px" : tabHeight + "px";
});

function changeComplexity(complexity: number) {
  updateDoc(doc(db, "users", mainStore.uid), {
    complexity,
  });
}

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
}

.name h2 {
  font-size: 40px;
  text-align: left;
}

.name__lvl {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 40px;
  height: 40px;

  color: #333333;

  border: 2px solid #333333;
  border-radius: 50%;
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
}

.name__info img {
  width: 16px;
  height: 16px;
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

.complexity {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 10px;

  border: 2px solid #333333;
  border-radius: 5px;

  input {
    width: calc(100% - 126px);
    height: 7px;

    background: linear-gradient(
      to right,
      rgba(51, 51, 51, 0) 0,
      rgba(51, 51, 51, 1) 33%
    );
    border: 2px solid #333333;
    border-radius: 5px;

    -webkit-appearance: none !important;

    &::-webkit-slider-thumb {
      background: #ffffff;
      border: 2px solid #333333;
      border-radius: 50%;

      cursor: pointer;

      -webkit-appearance: none !important;
    }

    &::-moz-range-thumb {
      background: #ffffff;
      border: 2px solid #333333;
      border-radius: 50%;

      cursor: pointer;
    }
  }
}

.complexity__fire {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  width: 96px;

  img {
    width: 24px;
    height: 24px;
    overflow: hidden;

    cursor: pointer;
    transition: all 0.2s;
  }
}

@media screen and (max-width: 768px) {
  .info {
    width: 50%;
  }
}
</style>
