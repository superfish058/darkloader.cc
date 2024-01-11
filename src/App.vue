<script setup>
import home from "./pages/home/index.vue";
</script>

<template>
  <div class="root">
    <div class="router">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
  
  .root{
    width: 100%;
    height: 100%;
    .router{
      width: 100%;
      height: 100%;
    }
  }
</style>
