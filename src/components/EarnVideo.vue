<template>
  <div class="earn">
    <h3>Реклама</h3>

    <div v-if="timer" class="earnTimer">{{ timer }}</div>

    <button v-else class="earnClose" @click="hideAd">
      <img alt="Закрыть" src="@/assets/icons/close.svg" />
    </button>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  timer: {
    type: Number,
    required: true,
    default: 5,
  },
});

const emit = defineEmits(["hideAd"]);

function hideAd() {
  emit("hideAd");
}
</script>

<style lang="scss" scoped>
.earn {
  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;

  background-color: #f5eee9;

  h3 {
    font-size: 20px;
  }

  .earnTimer,
  .earnClose {
    position: fixed;
    top: 30px;
    right: 40px;

    display: flex;
    justify-content: center;
    align-items: center;

    width: 50px;
    height: 50px;
    padding: 10px;

    font-size: 24px;
    color: #333333;

    border: 2px solid #333333;
    border-radius: 50%;
  }
}
</style>
