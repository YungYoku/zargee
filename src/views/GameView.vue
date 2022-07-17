<template>
  <div class="game">
    <game-loading v-if="loading" />

    <game-start-timer v-if="gameStore.timer && !loading" />

    <game-task v-if="!gameStore.timer && !loading" class="task" />

    <game-playground v-show="!gameStore.timer && !loading" class="playground" />

    <game-lose-menu
      v-if="
        (!gameStore.timer && !loading && gameStore.time === 0) || gameStore.lose
      "
      :deaths="deaths"
      :free-reborn-amount="freeRebornAmount"
      :heart-reborn-amount="heartRebornAmount"
      :timeKick="timeKick"
      @clearIntervals="clearIntervals"
      @reset="reset"
      @restart="restart"
      @stopAdWatching="stopAdWatching"
      @watchAd="watchAd"
    />

    <game-win-menu
      v-if="gameStore.lvl === 73"
      @clearIntervals="clearIntervals"
    />

    <game-timer v-if="!gameStore.timer && !loading" class="time" />

    <game-score v-if="!gameStore.timer && !loading" class="score" />

    <game-level class="lvl" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useMainStore } from "@/stores/main";
import { useGameStore } from "@/stores/game";
import { useRouter } from "vue-router";
import GameLoading from "@/components/GameLoading.vue";
import { db } from "@/main";
import { doc, updateDoc } from "firebase/firestore";
import "../additional/blink.css";
import GameWinMenu from "@/components/game/GameWinMenu.vue";
import GameTask from "@/components/game/GameTask.vue";
import GameLevel from "@/components/game/GameLevel.vue";
import GamePlayground from "@/components/game/GamePlayground.vue";
import GameLoseMenu from "@/components/game/GameLoseMenu.vue";
import GameStartTimer from "@/components/game/GameStartTimer.vue";
import GameTimer from "@/components/game/GameTimer.vue";
import GameScore from "@/components/game/GameScore.vue";

const mainStore = useMainStore();
const gameStore = useGameStore();
const router = useRouter();

const loading = ref(true);
const timeKick = ref(10);
const adWatching = ref(false);

let blinkInterval: number;
let timerInterval: number;
let timeInterval: number;
let kickInterval: number;

const lose = computed(() => gameStore.lose);
const time = computed(() => gameStore.time);
const deaths = ref(0);
const freeRebornAmount = ref(0);
const heartRebornAmount = ref(0);

watch(lose, async () => {
  if (gameStore.lose) {
    if (gameStore.lvl > mainStore.user.lvl) {
      const userRef = doc(db, "users", mainStore.uid);
      await updateDoc(userRef, {
        lvl: gameStore.lvl,
      });
    }
  }
});

watch(time, async () => {
  if (!gameStore.time) {
    if (gameStore.lvl > mainStore.user.lvl) {
      const userRef = doc(db, "users", mainStore.uid);
      await updateDoc(userRef, {
        lvl: gameStore.lvl,
      });
    }
  }
});

function clearIntervals() {
  gameStore.reset();
  clearInterval(timeInterval);
  clearInterval(kickInterval);
  clearInterval(blinkInterval);
}

const updateKickInterval = () => {
  if (timeKick.value > 0) {
    timeKick.value--;
  } else {
    clearIntervals();
    router.push("/");
  }
};

function setIntervals() {
  createTargets();

  timerInterval = setInterval(() => {
    if (gameStore.timer > 0) {
      gameStore.decreaseTimer();
    } else {
      clearInterval(timerInterval);
    }
  }, 1000);

  if (mainStore.user.complexity !== 1) {
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
        updateKickInterval();
      }
    }, 1000);
  } else {
    kickInterval = setInterval(() => {
      if (gameStore.lose && !adWatching.value) {
        updateKickInterval();
      }
    }, 1000);
  }

  blinkInterval = setInterval(() => {
    gameStore.generateBlinking();
  }, 15000);
}

onMounted(() => {
  if (mainStore.firstPage === "") {
    mainStore.setFirstPage("Game");
    router.push("/");
  } else {
    loading.value = false;
    gameStore.setComplexity(mainStore.user.complexity);
    setIntervals();
  }
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

  deaths.value++;
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
}

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
</style>
