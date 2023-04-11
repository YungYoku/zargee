<template>
  <div class="score">
    <h3>{{ score }}</h3>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useGameStore } from "@/stores/game";

const gameStore = useGameStore();

const score = computed(
  () => `${gameStore.score.current}/${gameStore.score.ending}`
);
</script>

<style lang="scss" scoped>
.score {
  z-index: 2;

  display: flex;
  justify-content: flex-start;
  align-items: center;

  width: 100%;
  height: 100%;
  padding: 12px;

  font-size: 20px;
  text-align: left;

  h3 {
    z-index: 2;

    font-size: 20px;
  }
}
</style>
