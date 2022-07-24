<template>
  <div class="timer">
    {{ startTimer }}
  </div>
</template>

<script lang="ts" setup>
defineProps({
  startTimer: {
    type: Number,
    required: true,
    default: 3,
  },
});
</script>

<style lang="scss" scoped>
.timer {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100vh;

  font-size: 100px;

  animation: timer 1s infinite;
}

@keyframes timer {
  from {
    font-size: 60px;
  }
  to {
    font-size: 100px;
  }
}
</style>
