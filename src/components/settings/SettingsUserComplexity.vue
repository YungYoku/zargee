<template>
  <div class="complexity">
    <div class="title">Сложность:</div>

    <input
      v-model.number="settingsStore.complexity"
      max="4"
      min="1"
      step="1"
      type="range"
    />

    <div class="complexity__fire">
      <button
        v-for="complexity in 4"
        :key="complexity"
        class="complexity__fire-button"
        type="button"
        @click="changeComplexity(complexity)"
      >
        <img
          :src="settingsStore.complexity >= complexity ? fireOn : fireOff"
          alt="Fire"
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import fireOn from "@/assets/img/fireOn.svg";
import fireOff from "@/assets/img/fireOff.svg";
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

  height: 100%;
  padding: 10px;

  border: 1px solid #333333;
  border-radius: 5px;
  gap: 10px;

  input {
    width: calc(100% - 126px);
    height: 5px;

    background-color: #333333;
    border: 1px solid #333333;
    border-radius: 5px;

    user-select: auto;

    &::-webkit-slider-thumb {
      width: 14px;
      height: 14px;

      background: #ffffff;
      border: 1px solid #333333;
      border-radius: 50%;

      cursor: pointer;

      -webkit-appearance: none !important;
    }

    &::-moz-range-thumb {
      width: 14px;
      height: 14px;

      background: #ffffff;
      border: 1px solid #333333;
      border-radius: 50%;

      cursor: pointer;
    }
  }

  &__fire {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    width: 96px;

    &-button {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      user-select: auto;

      img {
        width: 24px;
        height: 24px;
        overflow: hidden;

        cursor: pointer;
        transition: all 0.2s;
      }
    }
  }
}
</style>
