<template>
  <div class="time">
    <h3>{{ time }}</h3>
  </div>
</template>

<script lang="ts" setup>
import { useMainStore } from "@/stores/main";
import { useGameStore } from "@/stores/game";
import { computed } from "vue";

const mainStore = useMainStore();
const gameStore = useGameStore();

const time = computed(() =>
  mainStore.user.complexity !== 1 ? gameStore.time : "∞"
);
</script>

<style lang="scss" scoped>
.time {
  z-index: 2;

  display: flex;
  justify-content: flex-end;
  align-items: center;

  width: 100%;
  height: 100%;
  padding: 10px;

  text-align: right;

  h3 {
    z-index: 2;

    font-size: 20px;
  }
}
</style>
