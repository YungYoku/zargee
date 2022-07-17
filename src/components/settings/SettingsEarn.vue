<template>
  <div class="earnWrap">
    <button class="earnWatchButton" @click="watchAd">Смотреть рекламу</button>
    <h4 class="earnCounter">+1</h4>

    <ad-video v-if="adShowing" :timer="timer" class="earn" @hideAd="hideAd" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { db } from "@/main";
import { doc, updateDoc } from "firebase/firestore";
import AdVideo from "@/components/EarnVideo.vue";
import { useTipStore } from "@/stores/tip";

const mainStore = useMainStore();
const tipStore = useTipStore();

const adShowing = ref(false);
const timer = ref(5);
let adWatching: number;
const adWatchTime = computed(() => {
  return (
    mainStore.getCurrentDayInYear() * 86_400 +
    new Date().getHours() * 3600 +
    new Date().getMinutes() * 60 +
    new Date().getSeconds()
  );
});

async function watchAd() {
  const expireTime = mainStore.user.adWatchTime + 3600;

  if (adWatchTime.value > expireTime) {
    await updateDoc(doc(db, "users", mainStore.uid), {
      adWatchTime: adWatchTime.value,
    }).then(() => {
      timer.value = 5;
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
}

async function hideAd() {
  await claimReward();
  adShowing.value = false;
}

async function claimReward() {
  await updateDoc(doc(db, "users", mainStore.uid), {
    hearts: mainStore.user.hearts + 1,
  }).then(() => {
    tipStore.update(`Получено 1 сердце`);
  });
}
</script>

<style lang="scss" scoped>
.earnWrap {
  display: grid;
  align-items: center;

  grid-gap: 5px;
  grid-template: 100% / 1fr 50px;
}

.earnWatchButton {
  padding: 10px;

  font-size: 16px;
  font-weight: 600;
  color: #333333;

  background-color: transparent;
  border: 2px solid #333333;
  border-radius: 5px;

  cursor: pointer;
}

.earnCounter {
  width: 50px;
  height: 50px;
  padding: 10px;

  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: #333333;

  border: 2px solid #333333;
  border-radius: 5px;
}
</style>
