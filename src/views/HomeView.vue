<script setup lang="ts">
import AddProductModel from '@/components/Home/AddProductModal.vue'
import { reactive, ref, watch} from 'vue'
import vueDebounce from 'vue-debounce';
import endpoint from '@/api/resources/endpoint'

const vDebounce = vueDebounce({ lock: true })

interface OrderInfo {
  phone_number: string;
  full_name: {
    isLoading: boolean; // null: not yet fetch, true: fetching, false: fetched
    data: string;
  };
  amount: number;
}

const orderInfo: OrderInfo = reactive({
      phone_number: '',
      full_name: {
        isLoading: false,
        data: '',
      },
      amount: 0,
})

let fullNameFetched = ref('');

const fetchFullName = async () => {
  if (orderInfo.phone_number.length >= 10) {
    orderInfo.full_name.data = '';
    orderInfo.full_name.isLoading = true;
    const response = await endpoint.fetchUserByPhone(orderInfo.phone_number);

    if (response.status === 200) {
      const data = await response.json();

      fullNameFetched.value = data.data.full_name;
      orderInfo.full_name.isLoading = false;
    } else {
      fullNameFetched.value = '';
    }

    orderInfo.full_name.isLoading = false;
  }
}

watch(fullNameFetched, (value) => {
  if (value.length > 0) {
    orderInfo.full_name.data = value;
    orderInfo.full_name.isLoading = false;
  } else {
    orderInfo.full_name.data = '';
  }
})

</script>

<template>
  <div>
    <div class="space-y-2">
      <label for="phone_number" class="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-gray-200">
        Số điện thoại
      </label>

      <input id="phone_number" type="text" v-model="orderInfo.phone_number" v-debounce:500ms="fetchFullName"
        class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
        placeholder="Nhập số điện thoại">
    </div>

    <div class="space-y-2 mb-4">
      <label for="full_name" class="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-gray-200">
        Tên khách hàng
      </label>

      <input id="full_name" type="text" v-model="orderInfo.full_name.data"
        class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
        :placeholder="orderInfo.full_name.isLoading ? 'Loading...' : 'Nhập tên khách hàng'" 
        :disabled="fullNameFetched.length > 0">
    </div>

    <div class="sm:col-span-9 flex justify-center items-center">
      <p class="mt-3">
        <button data-modal-target="add-product-modal" data-modal-toggle="add-product-modal" type="button"
          class="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
          <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8" />
            <path d="M12 8v8" />
          </svg>
          Thêm thuốc
        </button>
      </p>
    </div>

    <AddProductModel />

    <div class="space-y-2 mb-4">
      <label for="amount" class="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-gray-200">
        Tổng tiền
      </label>

      <input id="amount" type="text" v-model="orderInfo.amount"
        class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
        placeholder="Nhập tổng tiền">
    </div>

    <div class="mt-5 flex justify-center gap-x-2">
      <button type="button"
        class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
        Tích điểm
      </button>
    </div>

    <div class="mt-5 flex justify-center gap-x-2">
      <router-link :to="{ name: 'orders' }"
        class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
        Xem lịch sử tích điểm
      </router-link>
    </div>
  </div>


  <!-- End Card Section -->
</template>
