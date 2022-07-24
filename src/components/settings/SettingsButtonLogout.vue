<template>
  <button
    :style="{
      minWidth: size,
      width: size,
      minHeight: size,
      height: size,
    }"
    class="logoutButton"
    type="button"
    @click.prevent="logout"
  >
    <img alt="Logout" class="logoutButtonImg" src="@/assets/icons/logout.svg" />
  </button>
</template>

<script lang="ts" setup>
import { getAuth, signOut } from "firebase/auth";
import { useMainStore } from "@/stores/main";
import { useRouter } from "vue-router";
import { useLoadingStore } from "@/stores/loading";

const mainStore = useMainStore();
const loadingStore = useLoadingStore();
const router = useRouter();

defineProps({
  size: {
    type: String,
    required: true,
  },
});

const logout = async () => {
  loadingStore.show();

  await signOut(getAuth()).catch((error) => {
    console.log(error);
  });

  await mainStore.logout();

  await router.push("/login");

  loadingStore.hide();
};
</script>

<style lang="scss" scoped>
.logoutButton {
  overflow: hidden;

  background-color: transparent;
  border: 6px solid #333333;
  border-radius: 50%;

  cursor: pointer;

  img {
    width: 50%;
    height: 50%;
    margin: 25%;
  }
}
</style>
