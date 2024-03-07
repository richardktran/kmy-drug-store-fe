<script setup lang="ts">
import RevenueCard from '@/components/Report/RevenueCard.vue'
</script>

<template>
  <div class="grid grid-cols-12 gap-6 mt-2 mb-4">
    <div class="lg:col-span-3 col-span-12">
      <RevenueCard title="tổng" value="20000000" percentage="20"  />
    </div>
    <div class="lg:col-span-3 col-span-12">
      <RevenueCard title="năm" value="20000000" percentage="-20"/>
    </div>
    <div class="lg:col-span-3 col-span-12">
      <RevenueCard title="tháng" value="20000000" percentage="20"/>
    </div>
    <div class="lg:col-span-3 col-span-12">
      <RevenueCard title="ngày" value="20000000" percentage="20"/>
    </div>
  </div><!-- end grid -->
</template>
