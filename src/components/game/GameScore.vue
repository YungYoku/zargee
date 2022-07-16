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

  width: 100%;
  height: 100%;

  text-align: left;
}

.score h3 {
  z-index: 2;

  padding: 10px;

  font-size: 20px;
}
</style>
