<template>
  <div class="earn">
    <button class="earn__button" @click="watchAd">Смотреть рекламу</button>

    <h4 class="earn__counter">+1</h4>

    <earn-video
      v-if="adShowing"
      :timer="timer"
      laptop-block-id="R-A-1981739-11"
      mobile-block-id="R-A-1981739-14"
      pc-block-id="R-A-1981739-5"
      @hideAd="hideAd"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { db } from "@/main";
import { doc, updateDoc } from "firebase/firestore";
import { useMainStore } from "@/stores/main";
import { useTipStore } from "@/stores/tip";
import EarnVideo from "@/components/earnVideo/EarnVideoWrap.vue";

const mainStore = useMainStore();
const tipStore = useTipStore();

const adShowing = ref(false);
const timer = ref(9);
let adWatching: number;

const adWatchTime = computed(() => {
  return (
    mainStore.getCurrentDayInYear() * 86_400 +
    new Date().getHours() * 3600 +
    new Date().getMinutes() * 60 +
    new Date().getSeconds()
  );
});

const watchAd = async () => {
  const expireTime = mainStore.user.adWatchTime + 3600;

  if (adWatchTime.value > expireTime) {
    await updateDoc(doc(db, "users", mainStore.uid), {
      adWatchTime: adWatchTime.value,
    }).then(() => {
      timer.value = 9;
      adShowing.value = true;
      adWatching = setInterval(() => {
        if (timer.value > 0) {
          timer.value--;
        } else {
          clearInterval(adWatching);
        }
      }, 1000);
    });
  } else {
    const leftTime = Math.floor((expireTime - adWatchTime.value) / 60);
    tipStore.update(`Осталось ${leftTime} минут`);
  }
};

const hideAd = async () => {
  await claimReward();
  adShowing.value = false;
};

const claimReward = async () => {
  await updateDoc(doc(db, "users", mainStore.uid), {
    hearts: mainStore.user.hearts + 1,
  }).then(() => {
    tipStore.update(`Получено 1 сердце`);
  });
};
</script>

<style lang="scss" scoped>
.earn {
  display: grid;

  grid-gap: 12px;
  grid-template: 100% / 1fr 48px;

  height: 100%;

  &__button {
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

  &__counter {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 48px;
    height: 48px;
    padding: 10px;

    font-size: 16px;
    font-weight: 700;
    text-align: center;
    color: #333333;

    border: 1px solid #333333;
    border-radius: 5px;
  }
}
</style>
