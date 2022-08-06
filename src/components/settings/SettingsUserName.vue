<template>
  <div class="wrap">
    <h2 class="name">{{ mainStore.user.name }}</h2>

    <div class="lvl">{{ mainStore.user.lvl }}</div>
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from "@/stores/main";

const mainStore = useMainStore();
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  grid-gap: 10px;

  .name {
    font-size: 40px;
    font-weight: 700;
    text-align: left;
  }

  .lvl {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 40px;
    height: 40px;

    color: #333333;

    border: 1px solid #333333;
    border-radius: 50%;
  }
}
</style>
