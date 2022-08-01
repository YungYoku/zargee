<template>
  <div id="info" class="info">
    <div class="info__content">
      <div class="name">
        <h2>{{ mainStore.user.name }}</h2>

        <div class="name__lvl">{{ mainStore.user.lvl }}</div>

        <div class="name__info">
          <div @click="showPolitics">
            <img alt="Политика" src="@/assets/img/file.svg" />
          </div>

          <h5 @click="showAbout">i</h5>
        </div>
      </div>

      <h4 class="life">Жизни: {{ mainStore.user.hearts }}</h4>

      <h4 class="life">Золотые жизни: {{ mainStore.user.gold }}</h4>

      <settings-user-daily />

      <settings-user-earn />

      <settings-user-code />

      <settings-user-ref-code />

      <settings-user-complexity />

      <game-politics v-if="politicsShow" @close="hidePolitics" />

      <settings-user-about v-if="aboutShow" @close="hideAbout" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMainStore } from "@/stores/main";
import SettingsUserCode from "@/components/settings/SettingsUserCode.vue";
import SettingsUserEarn from "@/components/settings/SettingsUserEarn.vue";
import SettingsUserRefCode from "@/components/settings/SettingsUserRefCode.vue";
import SettingsUserDaily from "@/components/settings/SettingsUserDaily.vue";
import SettingsUserAbout from "@/components/settings/SettingsUserAbout.vue";
import GamePolitics from "@/components/AppPolitics.vue";
import SettingsUserComplexity from "@/components/settings/SettingsUserComplexity.vue";
import { ref } from "vue";

const mainStore = useMainStore();

const politicsShow = ref(false);
const aboutShow = ref(false);

const showPolitics = () => {
  politicsShow.value = true;
};

const hidePolitics = () => {
  politicsShow.value = false;
};

const showAbout = () => {
  aboutShow.value = true;
};

const hideAbout = () => {
  aboutShow.value = false;
};
</script>

<style lang="scss" scoped>
.info {
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100vh;

  background-color: rgba(0, 0, 0, 0.5);

  &__content {
    position: relative;

    display: grid;
    align-items: center;

    grid-gap: 5px;
    grid-template: repeat(8, 1fr) / 1fr;

    width: 50%;
    min-width: 300px;
    max-width: 380px;
    padding: 10px;
    overflow: hidden;

    text-align: center;

    background-color: #f5eee9;
    border-radius: 5px;

    .name {
      display: grid;
      align-items: center;

      grid-gap: 10px;
      grid-template: 100% / auto 1fr 1fr;

      h2 {
        font-size: 40px;
        font-weight: 600;
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

    .name__info {
      display: flex;
      justify-content: right;
      align-items: center;

      img {
        width: 16px;
        height: 16px;
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

    .life {
      padding: 10px;

      font-size: 16px;
      font-weight: 600;
      text-align: left;
      color: #333333;

      border: 2px solid #333333;
      border-radius: 5px;
    }
  }
}
</style>
