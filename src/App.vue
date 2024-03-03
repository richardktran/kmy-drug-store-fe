<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div
    class="absolute inset-0 px-5 py-10 sm:py-0 sm:px-12 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"
  >
    <div class="max-w-screen-xl md:my-2 lg:my-16 mx-auto shadow-2xl rounded-xl">
      <!-- Card -->
      <div class="bg-white rounded-xl shadow dark:bg-slate-900">
        <div
          class="relative mb-5 h-40 rounded-t-xl bg-[url('https://preline.co/assets/svg/examples/abstract-bg-1.svg')] bg-no-repeat bg-cover bg-center"
        ></div>

        <!-- Card Section -->
        <div class="pt-0 p-4 sm:pt-0 sm:p-7 rounded-xl">
          <!-- Grid -->
          <div class="space-y-4 sm:space-y-6">
            <div>
              <label class="sr-only"> Product photo </label>

              <div class="grid sm:flex sm:items-center justify-center sm:gap-x-5">
                <div
                  alt="Logo"
                  class="-mt-16 relative bg-white shadow-lg flex justify-center items-center z-10 size-28 mx-auto sm:mx-0 rounded-full ring-0 dark:ring-gray-800"
                >
                  <img src="@/assets/logo.png" alt="Logo" class="size-16" />
                </div>
              </div>
              <RouterView />
            </div>
          </div>
          <!-- End Grid -->
        </div>
      </div>
      <!-- End Card -->
    </div>
  </div>
</template>

<style scoped></style>
