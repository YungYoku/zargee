<template>
  <div id="info" class="info">
    <div class="info__content">
      <div class="name">
        <settings-user-name />

        <div class="name__info">
          <router-link draggable="false" to="/settings/user/politics">
            <img alt="Политика" src="@/assets/img/file.svg" />
          </router-link>

          <router-link draggable="false" to="/settings/user/about">
            i
          </router-link>
        </div>
      </div>

      <h4 class="life">Жизни: {{ mainStore.user.hearts }}</h4>

      <h4 class="life">Золотые жизни: {{ mainStore.user.gold }}</h4>

      <router-link class="daily" to="/settings/user/daily">
        <button type="button">Получить жизнь</button>

        <div class="heartsWrap">
          <img
            v-if="dailyImageShowing"
            alt="Approve"
            src="@/assets/img/approve.svg"
          />

          <h4 v-if="dailyRewardShowing">+{{ mainStore.user.rewardDay }}</h4>
        </div>
      </router-link>

      <settings-user-earn />

      <settings-user-code />

      <settings-user-ref-code />

      <settings-user-complexity />

      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMainStore } from "@/stores/main";
import SettingsUserCode from "@/components/settings/SettingsUserCode.vue";
import SettingsUserEarn from "@/components/settings/SettingsUserEarn.vue";
import SettingsUserRefCode from "@/components/settings/SettingsUserRefCode.vue";
import SettingsUserComplexity from "@/components/settings/SettingsUserComplexity.vue";
import SettingsUserName from "@/components/settings/SettingsUserName.vue";
import { computed } from "vue";

const mainStore = useMainStore();

const dailyImageShowing = computed(() => {
  return !(
    !mainStore.user.rewardParts?.first || !mainStore.user.rewardParts?.second
  );
});

const dailyRewardShowing = computed(() => {
  return (
    !mainStore.user.rewardParts?.first || !mainStore.user.rewardParts?.second
  );
});
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
    z-index: 1;

    display: grid;
    align-items: center;

    grid-gap: 12px;
    grid-template: repeat(8, auto) / 1fr;

    width: 80%;
    min-width: 300px;
    max-width: 368px;
    padding: 12px;
    overflow: hidden;

    text-align: center;

    background-color: #ffffff;
    border-radius: 5px;

    .name {
      display: grid;
      align-items: center;

      grid-gap: 10px;
      grid-template: 100% / 1fr 62px;
    }

    .name__info {
      display: flex;
      justify-content: right;
      align-items: center;

      gap: 10px;

      a,
      button {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 26px;
        height: 26px;

        color: #333333;

        border: 1px solid #333333;
        border-radius: 50%;

        cursor: pointer;

        img {
          width: 16px;
          height: 16px;
        }
      }
    }

    .life {
      padding: 10px;

      font-size: 16px;
      font-weight: 400;
      text-align: left;
      color: #333333;

      border: 1px solid #333333;
      border-radius: 5px;
    }

    .daily {
      display: grid;

      grid-gap: 12px;
      grid-template: 100% / 1fr 48px;

      button {
        padding: 10px;

        font-size: 16px;
        font-weight: 400;
        text-align: left;
        color: #333333;

        background-color: transparent;
        border: 1px solid #333333;
        border-radius: 5px;

        cursor: pointer;
      }

      .heartsWrap {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 48px;
        height: 48px;
        padding: 10px;

        border: 1px solid #333333;
        border-radius: 5px;

        img {
          width: 19px;
          height: 19px;
        }

        h4 {
          font-size: 16px;
          font-weight: 700;
          text-align: center;
          color: #333333;
        }
      }
    }
  }
}
</style>
