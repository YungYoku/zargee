<template>
  <button
    id="infoButton"
    :style="{
      width: size,
      minWidth: size,
      height: size,
      minHeight: size,
    }"
    class="infoButton"
    type="button"
  >
    <img id="infoButtonImg" alt="Heart" src="@/assets/img/account.svg" />
  </button>
</template>

<script lang="ts" setup>
defineProps({
  size: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.infoButton {
  overflow: hidden;

  background-color: transparent;
  border: 4px solid #333333;
  border-radius: 50%;

  cursor: pointer;
}

img {
  width: 50%;
  height: 50%;
  margin: 25%;
}
</style>
