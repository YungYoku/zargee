<template>
  <div class="game">
    <the-load v-if="load" />

    <game-start-timer v-if="gameStore.timer && !load" />

    <game-task v-if="!gameStore.timer && !load" class="task" />

    <game-playground v-show="!gameStore.timer && !load" class="playground" />

    <game-lose-menu
      v-if="
        (!gameStore.timer && !load && gameStore.time === 0) || gameStore.lose
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

    <game-timer v-if="!gameStore.timer && !load" class="time" />

    <game-score v-if="!gameStore.timer && !load" class="score" />

    <game-level class="lvl" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useGameStore } from "@/stores/game";
import { useRouter } from "vue-router";
import TheLoad from "@/components/GameLoading.vue";
import "../additional/blink.css";
import GameWinMenu from "@/components/game/GameWinMenu.vue";
import GameTask from "@/components/game/GameTask.vue";
import GameLevel from "@/components/game/GameLevel.vue";
import GamePlayground from "@/components/game/GamePlayground.vue";
import GameLoseMenu from "@/components/game/GameLoseMenu.vue";
import GameStartTimer from "@/components/game/GameStartTimer.vue";
import GameTimer from "@/components/game/GameTimer.vue";
import GameScore from "@/components/game/GameScore.vue";
import { useMainStore } from "@/stores/main";

const mainStore = useMainStore();
const gameStore = useGameStore();
const router = useRouter();

const load = ref(true);
const timeKick = ref(10);
const adWatching = ref(false);

let blinkInterval: number;
let timerInterval: number;
let timeInterval: number;
let kickInterval: number;

const deaths = ref(0);
const freeRebornAmount = ref(0);
const heartRebornAmount = ref(0);

function clearIntervals() {
  gameStore.reset();
  clearInterval(timeInterval);
  clearInterval(kickInterval);
  clearInterval(blinkInterval);
}

function setIntervals() {
  createTargets();

  timerInterval = setInterval(() => {
    if (gameStore.timer > 0) {
      gameStore.decreaseTimer();
    } else {
      clearInterval(timerInterval);
    }
  }, 1000);

  timeInterval = setInterval(() => {
    if (gameStore.time > 0 && gameStore.timer === 0 && !gameStore.lose) {
      gameStore.decreaseTime();
    }
  }, 1000);

  kickInterval = setInterval(() => {
    if (
      !gameStore.timer &&
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
}

onMounted(() => {
  load.value = false;
  mainStore.loginDemo();
  gameStore.setComplexity(2);
  setIntervals();
});

onUnmounted(() => {
  clearIntervals();
  reset();
});

function watchAd() {
  adWatching.value = true;
}

function stopAdWatching() {
  adWatching.value = false;
}

function reset() {
  timeKick.value = 10;
  gameStore.setLvl(1);
  gameStore.reset();
}

function createTargets() {
  gameStore.createTargets();
}

function restart(props: { rebornType: string; lvl?: number }) {
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

  timerInterval = setInterval(() => {
    if (gameStore.timer > 0) {
      gameStore.decreaseTimer();
    } else {
      clearInterval(timerInterval);
    }
  }, 1000);
}

function logout() {
  clearIntervals();
}

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

  grid-template: 60px calc(100vh - 140px) 80px / 1fr 3fr 1fr;
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
