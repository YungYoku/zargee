<template>
  <div class="timer">
    <div class="time">{{ startTimer }}</div>

    <button type="button" @click="addTime">Добавить 10 секунд</button>
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

const emit = defineEmits(["addTime"]);

const addTime = () => {
  emit("addTime");
};
</script>

<style lang="scss" scoped>
.timer {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100vh;

  .time {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 140px;

    font-size: 100px;
    text-align: center;

    animation: timer 1s infinite;

    @keyframes timer {
      from {
        font-size: 60px;
      }
      to {
        font-size: 100px;
      }
    }
  }

  button {
    padding: 10px;

    font-size: 18px;

    border: 1px solid #333333;
    border-radius: 5px;
  }
}
</style>
