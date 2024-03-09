<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: String,
  },
  previousValue: {
    type: String,
  },
  percentage: {
    type: String,
    required: true
  }
})

</script>

<template>
  <div class="bg-gray-50 rounded-xl">
    <div class="p-6">
      <div class="flex justify-between">
        <div class="grow">
          <h4 class="text-base font-semibold text-gray-800">Doanh thu {{ props.title }}</h4>
        </div>
      </div>
      <h1 class="text-3xl text-gray-800 my-2.5">{{ props.value ? parseFloat(props.value).toLocaleString('en-US'): '0' }} VNĐ</h1>

      <hr class="my-3.5">

      <div class="flex items-center">
        <div class="lg:w-full">
          <div class="flex items-center">
            <div class="me-4 shrink">
              <svg v-if="parseFloat(props.percentage) > 0" class="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>

              <svg v-else class="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                <polyline points="17 18 23 18 23 12"></polyline>
              </svg>
            </div>
            <div class="grow">
              <h5 class="mt-0 mb-0">{{ parseFloat(props.percentage) }}% ({{ props.previousValue ? parseFloat(props.previousValue).toLocaleString('en-US') : '0'}} VNĐ)</h5>
              <p v-if="props.title!=='tổng'" class="text-muted mb-0 fs-13">so với {{ props.title }} trước</p>
              <p v-else class="text-muted mb-0 fs-13">so với tổng chi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
