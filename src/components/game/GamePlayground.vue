<template>
  <div class="playground">
    <the-target
      v-for="(target, i) in gameStore.targets"
      :key="target.x + '/' + target.y"
      :idx="i"
      :target="target"
      class="target"
      @click="handleTargetClick(target, i)"
    />
  </div>
</template>

<script lang="ts" setup>
import TheTarget from "@/components/game/GameTarget.vue";
import { useGameStore } from "@/stores/game";
import type { Target } from "@/interfaces/target";
import { useRouter } from "vue-router";

const router = useRouter();

const emit = defineEmits(["lvlEnd"]);

const gameStore = useGameStore();

const handleTargetClick = (target: Target, idx: number) => {
  const payload = {
    target: target,
    id: idx,
  };

  const isTargetClicked = gameStore.isTargetClicked(payload);

  if (isTargetClicked) {
    if (gameStore.score.current + 1 === gameStore.score.ending) {
      emit("lvlEnd");
    }

    gameStore.handleTargetClick(payload);
  } else {
    gameStore.setLose(true);
    router.push(`${router.currentRoute.value.path}/loseMenu`);
  }
};
</script>

<style lang="scss" scoped>
.playground {
  position: relative;

  width: 100%;
  height: 100%;

  .target {
    position: absolute;

    overflow: hidden;

    cursor: pointer;
  }
}
</style>
