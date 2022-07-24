<template>
  <div class="heal">
    <game-loading v-if="loadingStore.loading" />

    <button class="leaveHeal" @click="close">
      <img alt="Back" src="@/assets/icons/back.svg" />
    </button>

    <span>{{ timeKick }}</span>

    <button v-if="isHeartRebornAvailable" class="heal__option" @click="watchAd">
      Бесплатно
    </button>

    <div v-else class="heal__option used">Использовано</div>

    <div class="heal__option" @click="reborn.heart">
      <button>
        {{ heartPrice }}
        <img alt="Heart" src="@/assets/icons/heart.svg" />
      </button>

      <span>Доступно: {{ mainStore.user.hearts }}</span>
    </div>

    <div class="heal__option" @click="reborn.gold">
      <button>Золотая жизнь</button>

      <span> Доступно: {{ mainStore.user.gold }} </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/main";
import { useMainStore } from "@/stores/main";
import { computed } from "vue";
import { useTipStore } from "@/stores/tip";
import { useLoadingStore } from "@/stores/loading";
import GameLoading from "@/components/GameLoading.vue";

const props = defineProps({
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

const emit = defineEmits(["restart", "swapHeal", "watchAd", "close"]);

const mainStore = useMainStore();
const loadingStore = useLoadingStore();
const tipStore = useTipStore();

const heartPrice = computed(() =>
  props.heartRebornAmount === 0 ? 1 : 2 ** props.heartRebornAmount
);

const close = () => {
  emit("close");
};

const watchAd = () => {
  emit("watchAd");
};

const restart = (rebornType: string) => {
  emit("restart", rebornType);
};

const swapHeal = () => {
  emit("swapHeal");
};

const isHeartRebornAvailable = computed(() => props.freeRebornAmount < 5);

const reborn = {
  async heart() {
    if (mainStore.user.hearts - heartPrice.value < 0) {
      tipStore.update("Недостаточно жизней");
    } else {
      loadingStore.show();

      const userRef = doc(db, "users", mainStore.uid);
      await updateDoc(userRef, {
        hearts: mainStore.user.hearts - heartPrice.value,
      }).then(() => {
        restart("heart");
        swapHeal();
      });

      loadingStore.hide();
    }
  },

  async gold() {
    if (mainStore.user.gold === 0) {
      tipStore.update("Недостаточно зотолых жизней");
    } else {
      loadingStore.show();

      const userRef = doc(db, "users", mainStore.uid);
      await updateDoc(userRef, {
        gold: mainStore.user.gold - 1,
      }).then(() => {
        restart("gold");
        swapHeal();
      });

      loadingStore.hide();
    }
  },
};
</script>

<style lang="scss" scoped>
.heal {
  position: absolute;
  top: 0;
  left: 0;

  display: grid;

  grid-gap: 10px;
  grid-template: 1fr 1fr 1fr / 1fr;

  width: 100%;
  height: 100%;
  padding: 54px 10px 10px 10px;

  background-color: #f5eee9;

  > span {
    position: absolute;
    top: 10px;
    right: 10px;

    display: flex;
    justify-content: center;
    align-items: center;

    width: 38px;
    height: 38px;
    padding: 5px;

    font-size: 18px;
    font-weight: 500;
    text-align: center;

    border: 2px solid #333333;
    border-radius: 50%;
  }

  &__option {
    position: relative;

    display: flex;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 100%;
    padding: 20px;

    font-weight: 500;
    text-align: center;
    color: #333333;

    border: 3px solid #333333;
    border-radius: 5px;

    cursor: pointer;

    button {
      display: flex;
      justify-content: center;
      align-items: center;

      font-size: 32px;
      color: #333333;

      background-color: transparent;

      cursor: pointer;
      gap: 5px;
    }

    span {
      position: absolute;
      bottom: 10px;

      margin-top: auto;

      font-size: 14px;
      text-align: center;

      cursor: pointer;
    }

    img {
      width: 24px;
      height: 24px;
    }
  }

  .used {
    font-size: 32px;

    cursor: not-allowed;
  }

  > button:not([class="leaveHeal"]) {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 100%;
    padding: 20px;

    font-size: 32px;
    font-weight: 500;
    text-align: center;
    color: #333333;

    background-color: transparent;
    border: 3px solid #333333;
    border-radius: 5px;

    cursor: pointer;
  }

  .leaveHeal {
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

    img {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
