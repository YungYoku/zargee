<template>
  <div class="game">
    <game-start-timer
      v-if="startTimer && !loadingStore.loading"
      :start-timer="startTimer"
    />

    <game-task v-if="!startTimer && !loadingStore.loading" class="task" />

    <game-playground
      v-show="!startTimer && !loadingStore.loading"
      class="playground"
      @lvlEnd="setStartTimerInterval"
    />

    <game-lose-menu
      v-if="
        (!startTimer && !loadingStore.loading && gameStore.time === 0) ||
          gameStore.lose
      "
      :free-reborn-amount="freeRebornAmount"
      :heart-reborn-amount="heartRebornAmount"
      :timeKick="timeKick"
      @clearIntervals="clearIntervals"
      @logout="logout"
      @reset="reset"
      @restart="restart"
      @stopAdWatching="stopAdWatching"
      @watchAd="watchAd"
    />

    <game-win-menu
      v-if="gameStore.lvl === 73"
      @clearIntervals="clearIntervals"
    />

    <game-timer v-if="!startTimer && !loadingStore.loading" class="time" />

    <game-score v-if="!startTimer && !loadingStore.loading" class="score" />

    <game-level class="lvl" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useGameStore } from "@/stores/game";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import { useLoadingStore } from "@/stores/loading";
import GameWinMenu from "@/components/game/GameWinMenu.vue";
import GameTask from "@/components/game/GameTask.vue";
import GameLevel from "@/components/game/GameLevel.vue";
import GamePlayground from "@/components/game/GamePlayground.vue";
import GameLoseMenu from "@/components/game/GameLoseMenu.vue";
import GameStartTimer from "@/components/game/GameStartTimer.vue";
import GameTimer from "@/components/game/GameTimer.vue";
import GameScore from "@/components/game/GameScore.vue";
import { useSettingsStore } from "@/stores/settings";

const mainStore = useMainStore();
const settingsStore = useSettingsStore();
const gameStore = useGameStore();
const loadingStore = useLoadingStore();
const router = useRouter();

const timeKick = ref(10);
const adWatching = ref(false);

let blinkInterval: number;
let startTimerInterval: number;
let timeInterval: number;
let kickInterval: number;

const startTimer = ref(3);

const deaths = ref(0);
const freeRebornAmount = ref(0);
const heartRebornAmount = ref(0);

const clearIntervals = () => {
  gameStore.reset();
  clearInterval(startTimerInterval);
  clearInterval(timeInterval);
  clearInterval(kickInterval);
  clearInterval(blinkInterval);
};

const setStartTimerInterval = () => {
  startTimer.value = 3;
  startTimerInterval = setInterval(() => {
    if (startTimer.value > 0) {
      startTimer.value--;

      if (startTimer.value <= 0) {
        clearInterval(startTimerInterval);
      }
    }
  }, 1000);
};

const setIntervals = () => {
  createTargets();

  setStartTimerInterval();

  timeInterval = setInterval(() => {
    if (gameStore.time > 0 && startTimer.value === 0 && !gameStore.lose) {
      gameStore.decreaseTime();
    }
  }, 1000);

  kickInterval = setInterval(() => {
    if (
      !startTimer.value &&
      (gameStore.lose || !gameStore.time) &&
      !adWatching.value
    ) {
      if (timeKick.value > 0) {
        timeKick.value--;
      } else {
        clearIntervals();
        localStorage.removeItem("uid");
        router.push("/login");
      }
    }
  }, 1000);

  blinkInterval = setInterval(() => {
    gameStore.generateBlinking();
  }, 15000);
};

onMounted(() => {
  mainStore.loginDemo();
  settingsStore.setComplexity(2);
  gameStore.setComplexity(2);
  setIntervals();
  loadingStore.hide();
});

onUnmounted(() => {
  clearIntervals();
  reset();
});

const watchAd = () => {
  adWatching.value = true;
};

const stopAdWatching = () => {
  adWatching.value = false;
};

const reset = () => {
  timeKick.value = 10;
  gameStore.setLvl(1);
  gameStore.reset();
};

const createTargets = () => {
  gameStore.createTargets();
};

const restart = (props: { rebornType: string; lvl?: number }) => {
  if (props.lvl) {
    gameStore.setLvl(props.lvl);

    if (props.lvl === 1) {
      deaths.value = 0;
    }
  }

  if (props.rebornType === "ad") {
    freeRebornAmount.value++;
  } else if (props.rebornType === "heart") {
    heartRebornAmount.value++;
  }

  timeKick.value = 10;
  gameStore.reset();

  createTargets();
  setStartTimerInterval();
};

const logout = () => {
  clearIntervals();
};

const unloadHandler = () => {
  localStorage.clear();
};

window.addEventListener("beforeunload", unloadHandler);
</script>

<style lang="scss" scoped>
.game {
  display: grid;
  justify-content: center;
  align-items: center;

  grid-template: 60px calc(100vh - 140px) 80px / 60px 1fr 60px;
  grid-template-areas:
    "score task time"
    "playground playground playground"
    "lvl lvl lvl";

  width: 100%;
  height: 100vh;

  .playground {
    grid-area: playground;
  }

  .task {
    grid-area: task;
  }

  .lvl {
    grid-area: lvl;
  }

  .time {
    grid-area: time;
  }

  .score {
    grid-area: score;
  }
}
</style>
