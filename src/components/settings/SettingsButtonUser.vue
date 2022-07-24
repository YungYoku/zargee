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
    @click.prevent="open($event)"
  >
    <img id="infoButtonImg" alt="Heart" src="@/assets/icons/account.svg" />
  </button>
</template>

<script lang="ts" setup>
const emit = defineEmits(["open"]);

defineProps({
  size: {
    type: String,
    required: true,
  },
});

const open = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit("open", target.id);
};
</script>

<style lang="scss" scoped>
.infoButton {
  overflow: hidden;

  background-color: transparent;
  border: 6px solid #333333;
  border-radius: 50%;

  cursor: pointer;
}

img {
  width: 50%;
  height: 50%;
  margin: 25%;
}
</style>
