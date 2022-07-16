<template>
  <div class="playground">
    <the-target
      v-for="(target, i) in gameStore.targets"
      :key="target.x + '/' + target.y"
      :idx="i"
      :target="target"
      class="targets"
    />
  </div>
</template>

<script lang="ts" setup>
import TheTarget from "@/components/game/GameTarget.vue";
import { useGameStore } from "@/stores/game";

const gameStore = useGameStore();
</script>

<style lang="scss" scoped>
.playground {
  position: relative;

  width: 100%;
  height: 100%;
}

.targets {
  position: absolute;

  overflow: hidden;

  cursor: pointer;
}
</style>
