<template>
  <div class="daily">
    <button @click="swapCalendar">Получить жизнь</button>

    <div class="heartsWrap">
      <img v-if="imageShowing" alt="Approve" src="@/assets/icons/approve.svg" />

      <h4 v-if="rewardShowing">+{{ mainStore.user.rewardDay }}</h4>
    </div>
  </div>

  <div v-if="calendar" class="calendar">
    <button class="calendar__leave" @click="swapCalendar">
      <img
        alt="Back"
        class="calendar__leave-img"
        src="@/assets/icons/back.svg"
      />
    </button>

    <span class="leftTime">{{ formattedTime }}</span>

    <div v-for="day in week" :key="day" class="calendar__day">
      <span> {{ day }} день</span>

      <button
        :class="{
          received: isItReceived(day),
          cantBeReceived: !isItPossibleToReceive(day),
        }"
        class="receiveButton"
        @click="getHearts(day)"
      >
        {{ getButtonText(day) }}
      </button>
    </div>

    <ad-video v-if="adShowing" :timer="timer" class="earn" @hideAd="hideAd" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onUnmounted, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/main";
import { useTipStore } from "@/stores/tip";
import AdVideo from "@/components/EarnVideo.vue";

const mainStore = useMainStore();
const tipStore = useTipStore();

const week = [1, 2, 3, 4, 5, 6, 7];
const calendar = ref(false);
const time = ref(
  86400 -
    new Date().getHours() * 3600 -
    new Date().getMinutes() * 60 -
    new Date().getSeconds()
);
const adShowing = ref(false);
const timer = ref(5);
let adWatching: number;

const imageShowing = computed(() => {
  return !(
    !mainStore.user.rewardParts?.first || !mainStore.user.rewardParts?.second
  );
});

const rewardShowing = computed(() => {
  return (
    !mainStore.user.rewardParts?.first || !mainStore.user.rewardParts?.second
  );
});

const isItPossibleToReceive = (weekDay: number) => {
  if (
    mainStore.user.rewardDay === weekDay &&
    mainStore.user.resetDay === mainStore.getCurrentDayInYear() + 1
  ) {
    return (
      !mainStore.user.rewardParts.first || !mainStore.user.rewardParts.second
    );
  }
  return false;
};

const isItReceived = (weekDay: number) => {
  return (
    mainStore.user.rewardDay === weekDay + 1 &&
    mainStore.user.resetDay === mainStore.getCurrentDayInYear() + 1 &&
    mainStore.user.rewardParts.first &&
    mainStore.user.rewardParts.second
  );
};

const isItOldReceived = (weekDay: number) => {
  return mainStore.user.rewardDay >= weekDay;
};

const isItClaimable = (weekDay: number) => {
  return (
    mainStore.user.rewardDay === weekDay &&
    mainStore.user.resetDay === mainStore.getCurrentDayInYear() + 1 &&
    !mainStore.user.rewardParts.first &&
    !mainStore.user.rewardParts.second
  );
};

const isItDoubleClaimable = (weekDay: number) => {
  return (
    mainStore.user.rewardDay === weekDay &&
    mainStore.user.resetDay === mainStore.getCurrentDayInYear() + 1 &&
    mainStore.user.rewardParts.first &&
    !mainStore.user.rewardParts.second
  );
};

const getButtonText = (weekDay: number) => {
  return isItClaimable(weekDay)
    ? "Получить"
    : isItDoubleClaimable(weekDay)
    ? "Получить x2"
    : mainStore.user.rewardDay < weekDay ||
      (mainStore.user.rewardDay === weekDay && isItReceived(weekDay))
    ? "Недоступно"
    : isItReceived(weekDay) || isItOldReceived(weekDay)
    ? "Получено"
    : "";
};

const interval = setInterval(() => {
  if (time.value > 0) {
    time.value--;
  }
}, 1000);

onUnmounted(() => {
  clearInterval(interval);
});

const formattedTime = computed(() => {
  const hours = Math.floor(time.value / 3600);
  const minutes = Math.floor(Math.floor(time.value % 3600) / 60);
  const seconds = Math.floor(time.value % 60);

  return `
        ${hours > 9 ? hours : "0" + hours} :
        ${minutes > 9 ? minutes : "0" + minutes} :
        ${seconds > 9 ? seconds : "0" + seconds}
      `;
});

const claimReward = async (first: boolean, second: boolean) => {
  const reward = mainStore.user.rewardDay;

  await updateDoc(doc(db, "users", mainStore.uid), {
    hearts: mainStore.user.hearts + reward,
    resetDay: mainStore.getCurrentDayInYear() + 1,
    rewardParts: {
      first: first,
      second: second,
    },
  }).then(() => {
    tipStore.update(`Получено ${reward} сердец`);
  });
};

const getHearts = async (day = mainStore.user.rewardDay) => {
  if (
    mainStore.user.rewardDay < day ||
    (isItReceived(day) && mainStore.user.rewardDay === day)
  ) {
    tipStore.update("Недоступно");
  } else if (
    mainStore.user.rewardDay > day ||
    (mainStore.user.rewardDay === day &&
      mainStore.user.rewardParts.first &&
      mainStore.user.rewardParts.second)
  ) {
    tipStore.update("Награда уже получена");
  } else if (!mainStore.user.rewardParts.first) {
    await claimReward(true, false);
  } else if (!mainStore.user.rewardParts.second) {
    watchAd();
  }
};

const swapCalendar = () => {
  calendar.value = !calendar.value;
};

const watchAd = () => {
  timer.value = 5;
  adShowing.value = true;
  adWatching = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
    } else {
      clearInterval(adWatching);
    }
  }, 1000);
};

const hideAd = () => {
  claimReward(true, true);
  adShowing.value = false;
};
</script>

<style lang="scss" scoped>
.daily {
  display: grid;
  align-items: center;

  grid-gap: 5px;
  grid-template: 100% / 1fr 50px;

  button {
    padding: 10px;

    font-size: 16px;
    font-weight: 600;
    text-align: left;
    color: #333333;

    background-color: transparent;
    border: 2px solid #333333;
    border-radius: 5px;

    cursor: pointer;
  }
}

.heartsWrap {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 50px;
  height: 50px;
  padding: 10px;

  border: 2px solid #333333;
  border-radius: 5px;

  img {
    width: 19px;
    height: 19px;
  }

  h4 {
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    color: #333333;
  }
}

.calendar {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;

  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
  padding: 44px 10px 10px 10px;

  background-color: #f5eee9;

  gap: 10px;
  justify-items: center;

  &__leave {
    position: absolute;
    top: 10px;
    left: 10px;

    width: 36px;
    height: 36px;
    padding: 7px;

    background-color: transparent;
    border: 2px solid #333333;
    border-radius: 50%;

    cursor: pointer;

    &-img {
      width: 16px;
      height: 16px;
    }
  }

  &__day {
    position: relative;

    display: flex;
    justify-content: center;
    align-items: center;

    padding: 5px 5px 5px 10px;

    font-size: 20px;
    color: #333333;

    border: 2px solid #333333;
    border-radius: 5px;

    gap: 10px;

    span {
      width: 62px;
    }

    .receiveButton {
      display: flex;
      justify-content: center;
      align-items: center;

      width: 120px;
      height: 38px;
      padding: 5px 10px;

      font-size: 16px;
      color: #ffffff;

      background-color: #4ae32f;
      border-radius: 5px;

      cursor: pointer;
    }

    .received,
    .cantBeReceived {
      background-color: #333333;
      border: 2px solid #333333;

      cursor: not-allowed;
    }
  }

  .leftTime {
    padding: 5px 10px;

    border-radius: 5px;
  }
}
</style>
