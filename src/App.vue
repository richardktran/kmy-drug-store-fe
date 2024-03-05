<script setup lang="ts">
import { RouterView } from 'vue-router'
import '@/assets/banner.jpeg'
</script>

<template>
  <div
    class="absolute inset-0 px-5 py-10 sm:py-0 sm:px-12 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
    <div class="max-w-screen-xl md:my-2 lg:my-16 mx-auto shadow-2xl rounded-xl">
      <!-- Card -->
      <div class="bg-white rounded-xl shadow dark:bg-slate-900">
        <div class="relative mb-5 h-40 w-full rounded-t-xl bg-banner bg-no-repeat bg-contain bg-center"></div>
        <RouterView />
      </div>
      <!-- End Card -->
    </div>
  </div>
</template>

<style scoped></style>
