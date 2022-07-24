<template>
  <div class="end">
    <div class="end__content">
      <button @click="restart('', 1)">
        Повторить
        <img alt="Restart" src="@/assets/icons/restart.svg" />
      </button>

      <button class="reborn" @click="swapHeal">
        Возродиться
        <span class="reborn__time">{{ timeKick }}</span>
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
import GameHeal from "@/components/game/GameHeal.vue";
import EarnVideo from "@/components/EarnVideo.vue";
import { onUnmounted, ref } from "vue";
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

const interval = setInterval(() => {
  if (adShowing.value) {
    if (adTimer.value > 0) {
      adTimer.value--;
    } else {
      clearInterval(interval);
    }
  }
}, 1000);

onUnmounted(() => {
  clearInterval(interval);
});

const restart = (rebornType: string, lvl?: number) => {
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
};

const closeHealMenu = () => {
  healShow.value = false;
};

const swapHeal = () => {
  if (mainStore.demo) {
    watchAd();
  } else {
    healShow.value = true;
  }
};

const clearIntervals = () => {
  emit("clearIntervals");
  emit("reset");
};

const watchAd = () => {
  healShow.value = false;
  adTimer.value = 5;
  adShowing.value = true;
  emit("watchAd");
};

const hideAd = () => {
  adShowing.value = false;
  restart("ad");
  emit("stopAdWatching");
};

const logout = () => {
  emit("logout");
  mainStore.logout();
  router.push("/login");
};
</script>

<style lang="scss" scoped>
.end {
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

  &__content {
    position: relative;

    display: grid;

    grid-gap: 10px;

    width: 30%;
    min-width: 300px;
    max-width: 360px;
    padding: 10px;
    overflow: hidden;

    background-color: #f5eee9;
    border-radius: 5px;

    a,
    button {
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
  }

  a,
  button {
    img {
      width: 32px;
      height: 32px;
      margin-left: 20px;
    }
  }

  .reborn {
    position: relative;

    &__time {
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
  }
}
</style>
