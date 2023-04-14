<template>
  <div class="heal">
    <game-loading v-if="loadingStore.loading" />

    <button-close class="leaveHeal" />

    <span>{{ timeKick }}</span>

    <button
      v-if="isHeartRebornAvailable"
      class="heal__option"
      type="button"
      @click="watchAd"
    >
      Бесплатно
    </button>

    <div v-else class="heal__option used">Использовано</div>

    <div class="heal__option" @click="reborn.heart">
      <button type="button">
        {{ heartPrice }}
        <img alt="Heart" src="@/assets/img/heart.svg" />
      </button>

      <span>Доступно: {{ mainStore.user.hearts }}</span>
    </div>

    <div class="heal__option" @click="reborn.gold">
      <button type="button">Золотая жизнь</button>

      <span>Доступно: {{ mainStore.user.gold }}</span>
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
import GameLoading from "@/components/AppLoading.vue";
import ButtonClose from "@/components/ButtonClose.vue";

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

const emit = defineEmits(["restart", "watchAd"]);

const mainStore = useMainStore();
const loadingStore = useLoadingStore();
const tipStore = useTipStore();

const heartPrice = computed(() =>
  props.heartRebornAmount === 0 ? 1 : 2 ** props.heartRebornAmount
);

const watchAd = () => {
  emit("watchAd");
};

const restart = (rebornType: string) => {
  emit("restart", rebornType);
};

const isHeartRebornAvailable = computed(() => props.freeRebornAmount < 5);

const reborn = {
  async heart() {
    if (mainStore.user.hearts - heartPrice.value < 0) {
      tipStore.update("Недостаточно жизней");
    } else {
      const userRef = doc(db, "users", mainStore.uid);
      await updateDoc(userRef, {
        hearts: mainStore.user.hearts - heartPrice.value,
      }).then(() => {
        restart("heart");
      });
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

  grid-gap: 12px;
  grid-template: repeat(3, auto) / 1fr;

  width: 100%;
  height: 100%;
  padding: 72px 12px 12px 12px;

  background-color: #f5eee9;

  > span {
    position: absolute;
    top: 12px;
    right: 12px;

    display: flex;
    justify-content: center;
    align-items: center;

    width: 48px;
    height: 48px;

    font-size: 18px;
    font-weight: 400;
    text-align: center;

    border: 1px solid #333333;
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

    font-weight: 400;
    text-align: center;
    color: #333333;

    border: 1px solid #333333;
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

  > button:not([class="button-close leaveHeal"]) {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 100%;
    padding: 20px;

    font-size: 32px;
    font-weight: 400;
    text-align: center;
    color: #333333;

    background-color: transparent;
    border: 1px solid #333333;
    border-radius: 5px;

    cursor: pointer;
  }

  .leaveHeal {
    position: absolute;
    top: 10px;
    left: 10px;

    img {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
