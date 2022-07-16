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

  width: 100%;
  height: 100%;

  text-align: right;
}

.time h3 {
  z-index: 2;

  padding: 10px;

  font-size: 20px;
}
</style>
