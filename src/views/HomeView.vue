<script setup lang="ts">
import AddProductModel from '@/components/Home/AddProductModal.vue'
import { computed, reactive, ref, watchEffect } from 'vue'
import endpoint from '@/api/resources/endpoint'
import { type OrderInfo, type ProductInfo, type Order, type BasicOrder } from '@/types'
import { useToast } from 'vue-toast-notification'
import AutoComplete from 'primevue/autocomplete'
import UserScore from '@/components/Home/UserScore.vue'


const $toast = useToast({
  position: 'top'
})

const orderInit = {
  phone_number: '',
  full_name: '',
  amount: 0,
  score: 0,
}

const scoreInit = {
  total_score: 0,
  remain_score: 0,
  score_used: 0,
  max_score: 0,
  isShow: false
}

const scores = ref({ ...scoreInit })

let orderInfo: OrderInfo = reactive({ ...orderInit })

let products = ref<ProductInfo[]>([])

const filteredUsers = ref();

const validateErrors = ref({
  phone_number: '',
  full_name: '',
  amount: ''
})

const validate = () => {
  let pass = true
  if (orderInfo.phone_number.length < 10) {
    validateErrors.value.phone_number = 'Số điện thoại không hợp lệ'
    pass = false
  }

  if (orderInfo.full_name.length < 1) {
    validateErrors.value.full_name = 'Tên khách hàng không được để trống'
    pass = false
  }

  if (orderInfo.amount == 0) {
    validateErrors.value.amount = 'Tổng tiền phải lớn hơn 0'
    pass = false
  }

  return pass
}

const resetValidateErrors = () => {
  validateErrors.value = {
    phone_number: '',
    full_name: '',
    amount: ''
  }
}

const resetAll = () => {
  resetValidateErrors()
  orderInfo.phone_number = ''
  orderInfo.full_name = ''
  orderInfo.amount = 0
  orderInfo.score = 0
  products.value = []

  scores.value = { ...scoreInit }

  // reset the form
  const form = document.querySelector('form')
  if (form) {
    form.reset()
  }
}

const resetUserInfo = () => {
  orderInfo.full_name = ''
  orderInfo.phone_number = ''
  orderInfo.score = 0
  scores.value = { ...scoreInit }
}

const fetchUserList = async (phoneNumber: string, fullName: string) => {
  const response = await endpoint.fetchUserList(phoneNumber, fullName)

  if (response.status === 200) {
    const data = await response.json()

    filteredUsers.value = [...data.data];

    return;
  }
}

const searchPhoneNumber = (event: any) => {
  setTimeout(async () => {
    await fetchUserList(event.query, '')
  }, 500);
}

const selectUser = (event: any) => {
  orderInfo.full_name = event.value.full_name
  orderInfo.phone_number = event.value.phone_number
  scores.value = {
    remain_score: event.value.remain_score,
    score_used: event.value.score_used,
    max_score: event.value.max_score,
    total_score: event.value.total_score,
    isShow: true
  }
}

const searchFullName = (event: any) => {
  setTimeout(async () => {
    await fetchUserList('', event.query)
  }, 500);
}

const increaseScore = () => {
  console.log(orderInfo.score, scores.value.max_score)
  if (orderInfo.score < scores.value.max_score) {
    orderInfo.score += 1
  }
}

const decreaseScore = () => {
  if (orderInfo.score > 0) {
    orderInfo.score -= 1
  }
}


// Product handlers

const addProduct = (product: ProductInfo) => {
  products.value.push(product)
}

const removeProduct = (product: ProductInfo) => {
  products.value = products.value.filter((p) => p.name !== product.name)
}

watchEffect(() => {
  if (products.value.length > 0) {
    // loop through products and calculate the total amount
    let total = 0
    products.value.map((product) => {
      total += parseInt(product.price.toString())
    })
    orderInfo.amount = total
  } else {
    orderInfo.amount = 0
  }
})

// Format handlers

const amountFormatted = computed({
  get: () => {
    if (orderInfo.amount === 0) {
      return ''
    }
    return orderInfo.amount.toLocaleString('en-US')
  },
  set: (value: string) => {
    if (value !== '') {
      orderInfo.amount = parseInt(value.replace(/,/g, ''))
    } else {
      orderInfo.amount = 0
    }
  }
})

// format price of products to currency by filtering through the products, but keep the number type
const productsFormatted = computed(() => {
  return products.value.map((product) => {
    return {
      ...product,
      price: parseInt(product.price.toString()).toLocaleString('en-US')
    }
  })
})


// Submit handlers

const submitOrder = async (order: Order | BasicOrder) => {
  const response = await endpoint.storeOrder(order)
  if (response.status === 200) {
    $toast.success('Tích điểm thành công 🎉')
    resetAll()
  } else if (response.status === 500) {
    $toast.error('Có lỗi xảy ra, vui lòng thử lại!')
  } else {
    const data = await response.json()
    $toast.error(data.message.message)
  }
}

const storeOrder = async () => {
  resetValidateErrors()

  if (!validate()) {
    return
  }

  if (products.value.length > 0) {
    products.value.map(async (product) => {
      const order: Order = {
        phone_number: orderInfo.phone_number,
        full_name: orderInfo.full_name,
        product_name: product.name,
        quantity: parseInt(product.quantity.toString()),
        unit: product.unit,
        amount: parseInt(product.price.toString()),
        score: orderInfo.score
      }

      await submitOrder(order)
    })
  } else {
    const order: BasicOrder = {
      phone_number: orderInfo.phone_number,
      full_name: orderInfo.full_name,
      amount: orderInfo.amount,
      score: orderInfo.score
    }

    await submitOrder(order)
  }
}
</script>

<template>
  <div class="pt-0 p-4 sm:pt-0 sm:p-7 rounded-xl">
    <!-- Grid -->
    <div class="space-y-4 sm:space-y-6">
      <div>
        <label class="sr-only"> Product photo </label>

        <div class="grid sm:flex sm:items-center justify-center sm:gap-x-5">
          <div alt="Logo"
            class="-mt-8 relative bg-white shadow-lg flex justify-center items-center z-10 size-24 mx-auto sm:mx-0 rounded-full ring-0 dark:ring-gray-800">
            <img src="@/assets/logo.png" alt="Logo" class="size-14" />
          </div>
        </div>
      </div>
    </div>

    <form @submit.prevent="storeOrder">
      <div class="space-y-2">
        <label for="phone_number" class="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-gray-200">
          Số điện thoại
        </label>

        <AutoComplete
          inputClass="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
          inputId="phone_number" v-model="orderInfo.phone_number" placeholder="Nhập số điện thoại" :minLength="3"
          @item-select="selectUser" optionLabel="phone_number" :suggestions="filteredUsers"
          @complete="searchPhoneNumber" emptySearchMessage="Không tìm thấy số điện thoại">
          <template #option="slotProps">
            <div class="flex align-options-center">
              <div>{{ slotProps.option.full_name }} | </div>
              <div class="me-2">&nbsp;{{ slotProps.option.phone_number }}</div>
            </div>
          </template>
        </AutoComplete>
      </div>
      <div v-if="validateErrors.phone_number.length > 0"
        class="p-4 my-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
        {{ validateErrors.phone_number }}
      </div>

      <div class="space-y-2 mb-4">
        <label for="full_name" class="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-gray-200">
          Tên khách hàng
        </label>

        <AutoComplete
          inputClass="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
          inputId="phone_number" v-model="orderInfo.full_name" placeholder="Nhập tên khách hàng"
          @item-select="selectUser" optionLabel="full_name" :suggestions="filteredUsers" @complete="searchFullName">

          <template #option="slotProps">
            <div class="flex align-options-center">
              <div>{{ slotProps.option.full_name }} | </div>
              <div class="me-2">&nbsp;{{ slotProps.option.phone_number }}</div>
            </div>
          </template>
        </AutoComplete>
      </div>

      <div v-if="validateErrors.full_name.length > 0"
        class="p-4 my-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
        {{ validateErrors.full_name }}
      </div>

      <div v-if="scores.isShow" class="mb-4">
        <UserScore :total_score="scores.total_score" :remain_score="scores.remain_score" :score_used="scores.score_used"
          :max_score="scores.max_score" />
      </div>

      <div class="mt-5 flex justify-center gap-x-2">
        <button type="button" @click="resetUserInfo"
          class="py-2 px-3 inline-flex items-center gap-x-2 text-sm focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
          Nhập lại
        </button>
      </div>

      <div v-if="products.length > 0" class="relative overflow-x-auto">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">Tên thuốc</th>
              <th scope="col" class="px-6 py-3">Số lượng</th>
              <th scope="col" class="px-6 py-3">Giá</th>
              <th scope="col" class="px-6 py-3 flex justify-center items-center">
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                  fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 13v-2a1 1 0 0 0-1-1h-.8l-.7-1.7.6-.5a1 1 0 0 0 0-1.5L17.7 5a1 1 0 0 0-1.5 0l-.5.6-1.7-.7V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.8l-1.7.7-.5-.6a1 1 0 0 0-1.5 0L5 6.3a1 1 0 0 0 0 1.5l.6.5-.7 1.7H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.8l.7 1.7-.6.5a1 1 0 0 0 0 1.5L6.3 19a1 1 0 0 0 1.5 0l.5-.6 1.7.7v.8a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.8l1.7-.7.5.6a1 1 0 0 0 1.5 0l1.4-1.4a1 1 0 0 0 0-1.5l-.6-.5.7-1.7h.8a1 1 0 0 0 1-1Z" />
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                </svg>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, key) in productsFormatted" :key="key"
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {{ product.name }}
              </th>
              <td class="px-6 py-4">{{ product.quantity }} {{ product.unit }}</td>
              <td class="px-6 py-4">
                {{ product.price }}
              </td>
              <td class="px-6 py-4 flex justify-center items-center">
                <button @click="removeProduct(product)"
                  class="font-medium text-red-600 dark:text-red-500 hover:underline">
                  <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                    viewBox="0 0 24 24">
                    <path fill-rule="evenodd"
                      d="M8.6 2.6A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4c0-.5.2-1 .6-1.4ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                      clip-rule="evenodd" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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

      <AddProductModel @add-product="addProduct" />


      <div v-if="scores.max_score>0" class="max-w-xs">
        <label for="useScore" class="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
          Tích điểm (Tối đa {{ scores.max_score }} điểm):</label>
        <div class="relative flex items-center">
          <button type="button" @click="decreaseScore"
            class="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
            <svg class="w-2.5 h-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 18 2">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16" />
            </svg>
          </button>
          <input type="text" v-model="orderInfo.score"
            id="useScore" data-input-counter
            class="mx-1 flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
            placeholder="" required />
          <button type="button" @click="increaseScore"
            class="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
            <svg class="w-2.5 h-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 18 18">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 1v16M1 9h16" />
            </svg>
          </button>
        </div>
      </div>


      <div class="space-y-2 mb-4">
        <label for="amount" class="inline-block text-sm font-medium text-gray-800 mt-2.5 dark:text-gray-200">
          Tổng tiền
        </label>

        <input id="amount" type="text" v-model="amountFormatted"
          class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
          placeholder="Nhập tổng tiền" :disabled="products.length > 0" />
      </div>

      <div v-if="validateErrors.amount.length > 0"
        class="p-4 my-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
        {{ validateErrors.amount }}
      </div>

      <div class="mt-5 flex justify-center gap-x-2">
        <button type="submit"
          class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
          Tích điểm
        </button>
      </div>

      <div class="mt-5 flex justify-center gap-x-2">
        <router-link :to="{ name: 'orders', query: { phone_number: orderInfo.phone_number } }"
          class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
          Xem lịch sử tích điểm
        </router-link>
      </div>
    </form>
  </div>


  <!-- End Card Section -->
</template>
