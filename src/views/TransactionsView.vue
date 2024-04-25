<script setup lang="ts">
import RevenueReport from "@/components/Report/RevenueReport.vue"
import { ref, watch } from 'vue'
import { type OrderData } from '@/types'
import endpoint from '@/api/resources/endpoint';
import { useToast } from 'vue-toast-notification'
import moment from 'moment'
import vueDebounce from 'vue-debounce';
import router from "@/router";
import Dialog from 'primevue/dialog';
import InputText from "primevue/inputtext";
import Button from 'primevue/button';

const vDebounce = vueDebounce({ lock: true })

const $toast = useToast({
  position: 'top'
})

const orders = ref<OrderData[]>([]);
const totalAmount = ref(0);
const isLoading = ref(false);
const orderOptionsVisible = ref(false);

// Get phone number query string from URL
const urlParams = new URLSearchParams(window.location.search);
const queryPhoneNumber = ref(urlParams.get('phone_number') || '');

const navigateToHome = (order: OrderData) => {
  router.push({ name: 'home', query: { phone_number: order.phone_number } })
}


const fetchOrders = async () => {
  isLoading.value = true;

  const params = {
    phone_number: queryPhoneNumber.value
  }

  const response = await endpoint.fetchOrders(params);

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

  } else if (response.status === 500) {
    $toast.error('Có lỗi xảy ra, vui lòng thử lại!')
  }
  else {
    const data = await response.json()
    $toast.error(data.message.message)
  }

  isLoading.value = false;
};

// Watch and compute phone number input and bind it to query string phone_number parameter
watch(queryPhoneNumber, () => {
  // Remove query string from URL
  window.history.replaceState({}, document.title, window.location.pathname);
});


const fetchOrdersByPhone = async () => {
  if (queryPhoneNumber.value.length >= 10 || queryPhoneNumber.value.length === 0) {
    fetchOrders();
  }
}

fetchOrders();

</script>

<template>
  <div class="pt-0 p-4 sm:pt-0 sm:p-7 rounded-xl">
    <div class="flex items-center justify-between mb-4">
      <router-link :to="{ name: 'home' }">
        <svg class="w-[36px] h-[36px] cursor-pointer text-gray-800 dark:text-white" aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M5 12h14M5 12l4-4m-4 4 4 4" />
        </svg>
      </router-link>

      <div class="grid sm:flex sm:items-center justify-center sm:gap-x-5">
        <div alt="Logo"
          class="-mt-8 relative bg-white shadow-lg flex justify-center items-center z-10 size-24 mx-auto sm:mx-0 rounded-full ring-0 dark:ring-gray-800">
          <img src="@/assets/logo.png" alt="Logo" class="size-14" />
        </div>
      </div>

      <div class="w-lg">

      </div>
    </div>

    <RevenueReport />
    <Dialog v-model:visible="orderOptionsVisible" modal header="Edit Profile" :style="{ width: '25rem' }">
      <span class="p-text-secondary block mb-5">Update your information.</span>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="username" class="font-semibold w-6rem">Username</label>
        <InputText id="username" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex align-items-center gap-3 mb-5">
        <label for="email" class="font-semibold w-6rem">Email</label>
        <InputText id="email" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex justify-content-end gap-2">
        <Button type="button" label="Cancel" severity="secondary" @click="orderOptionsVisible = false"></Button>
        <Button type="button" label="Save" @click="orderOptionsVisible = false"></Button>
      </div>
    </Dialog>

    <div>
      <div v-if="!isLoading" class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div
          class="px-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
          Lịch sử mua hàng (Tổng điểm: {{ (totalAmount / 1000).toLocaleString('en-US') }} điểm)
        </div>
        <div class="px-5 py-3">
          <div class="relative max-w-sm">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input type="text" id="phone-search" v-model="queryPhoneNumber" v-debounce:500ms="fetchOrdersByPhone"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Nhập số điện thoại" />
          </div>
        </div>

        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
            <tr v-for="(order, key) in orders" :key="key" @click="orderOptionsVisible = true"
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 cursor-pointer">
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
  </div>


</template>
