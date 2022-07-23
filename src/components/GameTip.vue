<template>
  <div
    :style="{
      opacity: tipStore.tip !== '' ? 1 : 0,
    }"
  >
    <h3 v-show="tipStore.tip !== ''">{{ tipStore.tip }}</h3>
  </div>
</template>

<script lang="ts" setup>
import { useTipStore } from "@/stores/tip";

const tipStore = useTipStore();
</script>

<style lang="scss" scoped>
div {
  position: absolute;
  bottom: 30px;
  z-index: 6;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;

  transition: all 0.3s;

  h3 {
    padding: 10px;

    font-size: 20px;
    font-weight: 500;
    color: #333333;

    background-color: #f5eee9;
    border-radius: 5px;
  }
}
</style>
