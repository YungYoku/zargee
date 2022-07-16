<template>
  <div class="endWrap">
    <div class="end">
      <button @click="restart('', 1)">
        Повторить
        <img alt="Restart" src="@/assets/icons/restart.svg" />
      </button>

      <button class="reborn" @click="swapHeal">
        Возродиться
        <span>{{ timeKick }}</span>
      </button>

      <earn-video v-if="adShowing" :timer="adTimer" @hideAd="hideAd" />

      <the-share v-if="!mainStore.demo" />

      <button v-if="mainStore.demo" @click="logout">Выйти</button>

      <router-link v-if="!mainStore.demo" to="/" @click="clearIntervals">
        Меню
        <img alt="Menu" src="@/assets/icons/menu.svg" />
      </router-link>

      <game-heal
        v-if="healShow"
        :free-reborn-amount="freeRebornAmount"
        :heart-reborn-amount="heartRebornAmount"
        :timeKick="timeKick"
        class="heal"
        @close="closeHealMenu"
        @restart="restart"
        @swapHeal="swapHeal"
        @watchAd="watchAd"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import TheShare from "@/components/game/GameShare.vue";
import GameHeal from "@/components/game/heal/GameHeal.vue";
import EarnVideo from "@/components/EarnVideo.vue";
import { ref } from "vue";
import { useMainStore } from "@/stores/main";
import { useRouter } from "vue-router";

const router = useRouter();

const mainStore = useMainStore();

defineProps({
  timeKick: {
    type: Number,
    required: true,
    default: 10,
  },

  freeRebornAmount: {
    type: Number,
    required: true,
    default: 0,
  },

  heartRebornAmount: {
    type: Number,
    required: true,
    default: 0,
  },
});

const emit = defineEmits([
  "restart",
  "reset",
  "clearIntervals",
  "watchAd",
  "stopAdWatching",
  "logout",
]);

const adShowing = ref(false);
const adTimer = ref(5);
const healShow = ref(false);

setInterval(() => {
  if (adTimer.value > 0) {
    adTimer.value--;
  }
}, 1000);

function restart(rebornType: string, lvl?: number) {
  if (lvl) {
    emit("restart", {
      rebornType,
      lvl,
    });
  } else {
    emit("restart", {
      rebornType,
    });
  }
}

function closeHealMenu() {
  healShow.value = false;
}

function swapHeal() {
  if (mainStore.demo) {
    watchAd();
  } else {
    healShow.value = true;
  }
}

function clearIntervals() {
  emit("clearIntervals");
  emit("reset");
}

function watchAd() {
  healShow.value = false;
  adTimer.value = 5;
  adShowing.value = true;
  emit("watchAd");
}

function hideAd() {
  adShowing.value = false;
  restart("ad");
  emit("stopAdWatching");
}

function logout() {
  emit("logout");
  mainStore.logout();
  router.push("/login");
}
</script>

<style lang="scss" scoped>
.endWrap {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100vh;

  background-color: rgba(0, 0, 0, 0.5);
}

.end {
  position: relative;

  display: grid;

  grid-gap: 10px;

  width: 30%;
  min-width: 300px;
  padding: 10px;
  overflow: hidden;

  background-color: #f5eee9;
  border-radius: 5px;
}

.end > a,
.end > button:not(.leaveHeal) {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
  padding: 20px;

  font-size: 28px;
  font-weight: 500;
  text-align: center;
  color: #333333;

  background-color: transparent;
  border: 3px solid #333333;
  border-radius: 5px;

  cursor: pointer;
}

.end > a > img,
.end > button > img {
  width: 32px;
  height: 32px;
  margin-left: 20px;
}

.reborn {
  position: relative;
}

.reborn span {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 38px;
  height: 38px;
  margin-left: 20px;
  padding: 5px;

  font-size: 18px;
  font-weight: 500;

  border: 2px solid #333333;
  border-radius: 50%;
}
</style>
