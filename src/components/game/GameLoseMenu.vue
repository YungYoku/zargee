<template>
  <div class="end">
    <div class="end__content">
      <button @click="restart('', 1)">
        Повторить
        <img alt="Restart" src="@/assets/img/restart.svg" />
      </button>

      <button class="reborn" @click="swapHeal">
        Возродиться
        <span class="reborn__time">{{ timeKick }}</span>
      </button>

      <earn-video
        v-if="adShowing"
        :timer="adTimer"
        laptop-block-id="R-A-1981739-10"
        mobile-block-id="R-A-1981739-13"
        pc-block-id="R-A-1981739-4"
        @hideAd="hideAd"
      />

      <the-share v-if="!mainStore.demo" />

      <button v-if="mainStore.demo" @click="logout">Выйти</button>

      <router-link
        v-if="!mainStore.demo"
        draggable="false"
        to="/"
        @click="clearIntervals"
      >
        Меню
        <img alt="Menu" src="@/assets/img/menu.svg" />
      </router-link>

      <router-view
        :free-reborn-amount="freeRebornAmount"
        :heart-reborn-amount="heartRebornAmount"
        :timeKick="timeKick"
        class="heal"
        @restart="restart"
        @swapHeal="swapHeal"
        @watchAd="watchAd"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import TheShare from "@/components/game/GameShare.vue";
import EarnVideo from "@/components/earnVideo/EarnVideoWrap.vue";
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
const adTimer = ref(9);

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

const swapHeal = () => {
  if (mainStore.demo) {
    watchAd();
  } else {
    router.push(`${router.currentRoute.value.path}/heal`);
  }
};

const clearIntervals = () => {
  emit("clearIntervals");
  emit("reset");
};

const watchAd = async () => {
  adTimer.value = 9;
  adShowing.value = true;
  emit("watchAd");

  if (!mainStore.demo) {
    await router.go(-1);
  }
};

const hideAd = () => {
  adShowing.value = false;
  restart("ad");
  emit("stopAdWatching");
};

const logout = async () => {
  emit("logout");
  mainStore.logout();
  await router.push("/login");
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
  padding: 6px 12px 12px 12px;

  background-color: rgba(0, 0, 0, 0.5);

  &__content {
    position: relative;

    display: grid;

    grid-gap: 12px;

    width: 30%;
    min-width: 300px;
    max-width: 384px;
    padding: 12px;
    overflow: hidden;

    background-color: #f5eee9;
    border-radius: 6px;

    a,
    button {
      display: flex;
      justify-content: space-between;
      align-items: center;

      width: 100%;
      height: 96px;
      padding: 24px;

      font-size: 24px;
      line-height: 1;
      font-weight: 400;
      color: #333333;

      background-color: transparent;
      border: 1px solid #333333;
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

      width: 48px;
      height: 48px;
      margin-left: 24px;
      padding: 6px;

      font-size: 24px;
      font-weight: 400;

      border: 1px solid #333333;
      border-radius: 50%;
    }
  }
}
</style>
