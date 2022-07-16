<template>
  <div class="invite">
    <button @click="watchAd">Пригласить друга</button>
    <h4>+10</h4>
  </div>
</template>

<script lang="ts" setup>
import { useTipStore } from "@/stores/tip";

const tipStore = useTipStore();

function watchAd() {
  tipStore.update("Недоступно");
}
</script>

<style lang="scss" scoped>
.invite {
  display: grid;
  align-items: center;

  grid-gap: 10px;
  grid-template: 100% / 1fr 50px;
}

button {
  padding: 10px;

  font-size: 16px;
  font-weight: 600;
  color: #333333;

  background-color: transparent;
  border: 2px solid #333333;
  border-radius: 5px;

  cursor: pointer;
}

h4 {
  width: 50px;
  height: 50px;
  padding: 10px;

  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: #333333;
  white-space: nowrap;

  border: 2px solid #333333;
  border-radius: 5px;
}
</style>
