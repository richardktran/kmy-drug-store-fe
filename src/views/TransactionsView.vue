<script setup lang="ts">
import { ref } from 'vue'
import { type OrderData } from '@/types'
import endpoint from '@/api/resources/endpoint';
import { useToast } from 'vue-toast-notification'
import moment from 'moment'

const $toast = useToast({
  position: 'top'
})

const orders = ref<OrderData[]>([]);
const totalAmount = ref(0);
const isLoading = ref(false);

const fetchOrders = async () => {
  isLoading.value = true;

  const response = await endpoint.fetchOrders();

  if (response.ok) {
    let dataResponse = await response.json();
    let data = dataResponse.data;

    const ordersData: OrderData[] = data.map((order: any) => {
      return {
        ...order,
        full_name: order.user.full_name,
        phone_number: order.user.phone_number,
        product_name: order.product.name,
        product_unit: order.product.unit,
        amount: order.amount.toLocaleString('en-US'),
        created_at: moment(order.created_at).format('DD/MM/YYYY HH:mm '),
      }
    });

    orders.value = ordersData;
    totalAmount.value = dataResponse.meta.data.total

  } else {
    $toast.error('Có lỗi xảy ra, vui lòng thử lại!')
  }

  isLoading.value = false;
};

fetchOrders();

</script>

<template>
  <div>
    <div v-if="!isLoading" class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table  class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <caption
          class="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
          Lịch sử mua hàng (Tổng doanh số: {{ totalAmount.toLocaleString('en-US') }} VNĐ)
        </caption>
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">
              Khách hàng
            </th>
            <th scope="col" class="px-6 py-3">
              Điện thoại
            </th>
            <th scope="col" class="px-6 py-3">
              Thuốc
            </th>
            <th scope="col" class="px-6 py-3">
              Giá
            </th>
            <th scope="col" class="px-6 py-3">
              Ngày mua
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, key) in orders" :key="key" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {{ order.full_name }}
            </th>
            <td class="px-6 py-4">
              {{ order.phone_number }}
            </td>
            <td v-if="order.product_name !== '<empty>'" class="px-6 py-4">
              {{ order.product_name }} ({{ order.quantity }} {{ order.product_unit }})
            </td>
            <td v-else class="px-6 py-4">
              Không có thông tin
            </td>
            <td class="px-6 py-4">
              {{ order.amount }} VNĐ
            </td>
            <td class="px-6 py-4">
              {{ order.created_at }}
            </td>
          </tr>

        </tbody>
      </table>

      <!-- Table skeleton -->



    </div>


    <div role="status" v-else
      class="max-w p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div class="w-8 md:w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        <div class="w-8 md:w-20 h-2.5 bg-gray-300 rounded-full dark:bg-gray-700"></div>
        <div class="w-8 md:w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        <div class="w-8 md:w-20 h-2.5 bg-gray-300 rounded-full dark:bg-gray-700"></div>
        <div class="w-8 md:w-20 h-2.5 bg-gray-300 rounded-full dark:bg-gray-700"></div>
      </div>
      <div class="flex items-center justify-between pt-4">
        <div class="w-8 md:w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        <div class="w-8 md:w-20 h-2.5 bg-gray-300 rounded-full dark:bg-gray-700"></div>
        <div class="w-8 md:w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        <div class="w-8 md:w-20 h-2.5 bg-gray-300 rounded-full dark:bg-gray-700"></div>
        <div class="w-8 md:w-20 h-2.5 bg-gray-300 rounded-full dark:bg-gray-700"></div>
      </div>
      <div class="flex items-center justify-between pt-4">
        <div class="w-8 md:w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        <div class="w-8 md:w-20 h-2.5 bg-gray-300 rounded-full dark:bg-gray-700"></div>
        <div class="w-8 md:w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        <div class="w-8 md:w-20 h-2.5 bg-gray-300 rounded-full dark:bg-gray-700"></div>
        <div class="w-8 md:w-20 h-2.5 bg-gray-300 rounded-full dark:bg-gray-700"></div>
      </div>
      <div class="flex items-center justify-between pt-4">
        <div class="w-8 md:w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        <div class="w-8 md:w-20 h-2.5 bg-gray-300 rounded-full dark:bg-gray-700"></div>
        <div class="w-8 md:w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        <div class="w-8 md:w-20 h-2.5 bg-gray-300 rounded-full dark:bg-gray-700"></div>
        <div class="w-8 md:w-20 h-2.5 bg-gray-300 rounded-full dark:bg-gray-700"></div>
      </div>
      <div class="flex items-center justify-between pt-4">
        <div class="w-8 md:w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        <div class="w-8 md:w-20 h-2.5 bg-gray-300 rounded-full dark:bg-gray-700"></div>
        <div class="w-8 md:w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        <div class="w-8 md:w-20 h-2.5 bg-gray-300 rounded-full dark:bg-gray-700"></div>
        <div class="w-8 md:w-20 h-2.5 bg-gray-300 rounded-full dark:bg-gray-700"></div>
      </div>
      <div class="flex items-center justify-between pt-4">
        <div class="w-8 md:w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        <div class="w-8 md:w-20 h-2.5 bg-gray-300 rounded-full dark:bg-gray-700"></div>
        <div class="w-8 md:w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        <div class="w-8 md:w-20 h-2.5 bg-gray-300 rounded-full dark:bg-gray-700"></div>
        <div class="w-8 md:w-20 h-2.5 bg-gray-300 rounded-full dark:bg-gray-700"></div>
      </div>
      <div class="flex items-center justify-between pt-4">
        <div class="w-8 md:w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        <div class="w-8 md:w-20 h-2.5 bg-gray-300 rounded-full dark:bg-gray-700"></div>
        <div class="w-8 md:w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        <div class="w-8 md:w-20 h-2.5 bg-gray-300 rounded-full dark:bg-gray-700"></div>
        <div class="w-8 md:w-20 h-2.5 bg-gray-300 rounded-full dark:bg-gray-700"></div>
      </div>
      <span class="sr-only">Loading...</span>
    </div>


  </div>

</template>
