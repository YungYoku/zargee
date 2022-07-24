<template>
  <div class="task">
    <div v-if="gameStore.task.title[4]">
      <span
        v-for="(text, i) in gameStore.task.title"
        :key="text + i"
        :style="{
          color: getColor(i),
        }"
      >
        {{ text }} <span> </span>
      </span>
    </div>

    <div v-else>
      <span
        v-for="(text, i) in gameStore.task.title"
        :key="text + i"
        :style="{
          color: getColor2(i),
        }"
      >
        <span v-if="i < 3"> {{ text }} <span> </span> </span>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useGameStore } from "@/stores/game";

const gameStore = useGameStore();

const getColor = (i: number) => {
  return Number(i) === 1
    ? gameStore.task.figureFakeColor
    : Number(i) === 4
    ? gameStore.task.borderFakeColor
    : "#000000";
};

const getColor2 = (i: number) => {
  return Number(i) === 1 ? gameStore.task.figureFakeColor : "#000000";
};
</script>

<style lang="scss" scoped>
.task {
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 20px;
  text-align: center;

  span {
    text-align: center;

    &::after {
      content: " ";
    }
  }
}
</style>
