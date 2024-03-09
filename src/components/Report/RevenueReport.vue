<script setup lang="ts">
import endpoint from '@/api/resources/endpoint';
import RevenueCard from '@/components/Report/RevenueCard.vue'
import { ref } from 'vue';
import {type RevenueReportSummary} from '@/types';
import { useToast } from 'vue-toast-notification';

const isLoading = ref(false);
const $toast = useToast({
  position: 'top'
})

const reports = ref<RevenueReportSummary>({
  day_revenue: {
    current: null,
    previous: null,
    percentage_change: 0
  },
  month_revenue: {
    current: null,
    previous: null,
    percentage_change: 0
  },
  year_revenue: {
    current: null,
    previous: null,
    percentage_change: 0
  },
  total_revenue: {
    current: null,
    previous: null,
    percentage_change: 0
  }
});

const fetchReports = async () => {
  isLoading.value = true;

  const response = await endpoint.getRevenueReports();

  if (response.ok) {
    let dataResponse = await response.json();
    let data = dataResponse.data;

    let revenueReportSummary: RevenueReportSummary = JSON.parse(JSON.stringify(data));

    reports.value = revenueReportSummary;

  } else if (response.status === 500) {
    $toast.error('Có lỗi xảy ra, vui lòng thử lại!')
  }
  else {
    const data = await response.json()
    $toast.error(data.message.message)
  }

  isLoading.value = false;
};

fetchReports();

</script>

<template>
  <div>
    <div v-if="!isLoading" class="grid grid-cols-12 gap-6 mt-2 mb-4">
      <div class="lg:col-span-3 col-span-12">
        <RevenueCard title="tổng" 
          :value="reports.total_revenue.current?.total.toString()" 
          :previousValue="reports.total_revenue.previous?.total.toString()"
          :percentage="reports.total_revenue.percentage_change.toString()"
        />
      </div>
      <div class="lg:col-span-3 col-span-12">
        <RevenueCard 
          title="năm" 
          :previousValue="reports.year_revenue.previous?.total.toString()"
          :value="reports.year_revenue.current?.total.toString()" 
          :percentage="reports.year_revenue.percentage_change.toString()"/>
      </div>
      <div class="lg:col-span-3 col-span-12">
        <RevenueCard title="tháng" 
          :previousValue="reports.month_revenue.previous?.total.toString()"
          :value="reports.month_revenue.current?.total.toString()" 
          :percentage="reports.month_revenue.percentage_change.toString()"
        />
      </div>
      <div class="lg:col-span-3 col-span-12">
        <RevenueCard title="ngày" 
          :previousValue="reports.day_revenue.previous?.total.toString()"
          :value="reports.day_revenue.current?.total.toString()" 
          :percentage="reports.day_revenue.percentage_change.toString()"
        />
      </div>
    </div>


    <!-- skeleton -->
    <div v-else class="grid grid-cols-12 gap-6 mt-2 mb-4">
      <div class="lg:col-span-3 col-span-12">
        <RevenueCard title="tổng" value="N/A" percentage="N/A"  />
      </div>
      <div class="lg:col-span-3 col-span-12">
        <RevenueCard title="năm" value="N/A" percentage="-20"/>
      </div>
      <div class="lg:col-span-3 col-span-12">
        <RevenueCard title="tháng" value="N/A" percentage="20"/>
      </div>
      <div class="lg:col-span-3 col-span-12">
        <RevenueCard title="ngày" value="N/A" percentage="20"/>
      </div>
    </div>
  </div>
  
</template>
