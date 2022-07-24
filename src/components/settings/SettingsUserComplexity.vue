<template>
  <div class="complexity">
    <input
      v-model.number="settingsStore.complexity"
      max="4"
      min="1"
      step="1"
      type="range"
    />

    <div class="complexity__fire">
      <img
        v-for="complexity in 4"
        :key="complexity"
        :src="settingsStore.complexity >= complexity ? fireOn : fireOff"
        alt="Fire"
        @click="changeComplexity(complexity)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import fireOn from "@/assets/icons/fireOn.svg";
import fireOff from "@/assets/icons/fireOff.svg";
import { useSettingsStore } from "@/stores/settings";

const settingsStore = useSettingsStore();

const changeComplexity = (complexity: number) => {
  settingsStore.setComplexity(complexity);
};
</script>

<style lang="scss" scoped>
.complexity {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 10px;

  border: 2px solid #333333;
  border-radius: 5px;

  input {
    width: calc(100% - 126px);
    height: 5px;

    background-color: #333333;
    border: 2px solid #333333;
    border-radius: 5px;

    &::-webkit-slider-thumb {
      width: 14px;
      height: 14px;

      background: #ffffff;
      border: 2px solid #333333;
      border-radius: 50%;

      cursor: pointer;

      -webkit-appearance: none !important;
    }

    &::-moz-range-thumb {
      width: 14px;
      height: 14px;

      background: #ffffff;
      border: 2px solid #333333;
      border-radius: 50%;

      cursor: pointer;
    }
  }

  &__fire {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    width: 96px;

    img {
      width: 24px;
      height: 24px;
      overflow: hidden;

      cursor: pointer;
      transition: all 0.2s;
    }
  }
}
</style>
