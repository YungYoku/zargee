<template>
  <Transition>
    <div v-if="tipStore.tip" class="tip">
      <h3 class="tip__text">{{ tipStore.tip }}</h3>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { useTipStore } from "@/stores/tip";

const tipStore = useTipStore();
</script>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.tip {
  position: absolute;
  bottom: 30px;
  z-index: 6;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;

  transition: all 0.3s;

  &__text {
    padding: 10px;

    font-size: 20px;
    font-weight: 500;
    color: #333333;

    background-color: #f5eee9;
    border-radius: 5px;
  }
}
</style>
