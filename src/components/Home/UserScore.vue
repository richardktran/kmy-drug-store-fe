<script setup lang="ts">
const props = defineProps({
  total_score: {
    type: Number,
    default: 0
  },
  remain_score: {
    type: Number,
    default: 0
  },
  score_used: {
    type: Number,
    default: 0
  },
  max_score: {
    type: Number,
    default: 0
  },
})
</script>

<template>
  <dl class="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
    <div>
      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Đã mua tổng cộng</dt>
      <dd class="text-sm font-semibold text-gray-900 dark:text-white">{{ (props.total_score*1000).toLocaleString('en-US') }} VNĐ</dd>
    </div>
    <!-- <div>
      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Điểm còn lại</dt>
      <dd class="text-sm font-semibold text-gray-900 dark:text-white">{{ props.remain_score }} điểm</dd>
    </div> -->
    <div>
      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Điểm đã trả (Điểm cũ)</dt>
      <dd class="text-sm font-semibold text-gray-900 dark:text-white">{{ props.score_used }} điểm ({{ (props.score_used*1000).toLocaleString('en-US') }} VNĐ)</dd>
    </div>
    <div>
      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Số tiền có thể giảm</dt>
      <dd class="text-sm font-semibold text-gray-900 dark:text-white">{{ (props.max_score*1000).toLocaleString('en-US') }} VNĐ</dd>
    </div>
  </dl>
</template>
