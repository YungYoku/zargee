<template>
  <button @click="watchAd">Бесплатно</button>
</template>

<script lang="ts" setup>
import { useTipStore } from "@/stores/tip";

const tipStore = useTipStore();

function watchAd() {
  tipStore.update("Недоступно");
}
</script>

<style lang="scss" scoped>
button {
  color: inherit;
}
</style>
