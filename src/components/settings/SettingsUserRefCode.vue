<template>
  <div class="refCode" @click="copyToClipboard">
    <h4>Реф. код: {{ mainStore.user.ref }}</h4>

    <button>
      <img alt="Copy" src="@/assets/img/copy.svg" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useMainStore } from "@/stores/main";
import { useTipStore } from "@/stores/tip";

const mainStore = useMainStore();
const tipStore = useTipStore();

const copyToClipboard = () => {
  navigator.clipboard.writeText(mainStore.user.ref.toString());

  tipStore.update("Скопировано");
};
</script>

<style lang="scss" scoped>
.refCode {
  display: flex;
  justify-content: space-between;
  align-items: center;

  height: 100%;
  padding: 10px;

  font-size: 16px;
  font-weight: 400;
  color: #333333;

  border: 1px solid #333333;
  border-radius: 5px;
}

button {
  background-color: transparent;

  cursor: pointer;
}

img {
  width: 18px;
  height: 18px;
}
</style>
