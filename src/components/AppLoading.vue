<template>
  <div class="loading">
    <div></div>
  </div>
</template>

<style lang="scss" scoped>
.loading {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;

  background-color: #f5eee9;

  div {
    position: relative;

    width: 60px;
    height: 60px;

    background-color: transparent;
    border: 1px solid #333333;
    border-radius: 50%;

    animation: loading 1s infinite linear;

    @keyframes loading {
      from {
        transform: rotate(0);
      }
      to {
        transform: rotate(360deg);
      }
    }

    &::before {
      content: "";
      position: absolute;
      top: -10px;
      left: -10px;

      width: 30px;
      height: 30px;

      background-color: #f5eee9;
      border-radius: 50%;
    }
  }
}
</style>
