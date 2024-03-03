<script setup lang="ts">
import { ref } from 'vue'

interface ProductInfo {
  name: string
  price: number
  quantity: number
  unit: string
}

const emit = defineEmits<{
  (e: 'addProduct', product: ProductInfo): void
}>()

const initProductInfo = {
  name: '',
  price: 0,
  quantity: 0,
  unit: ''
}

const productInfo = ref<ProductInfo>({...initProductInfo})

const addProduct = () => {
  const newProduct = { ...productInfo.value }
  emit('addProduct', newProduct)
  
  productInfo.value = { ...initProductInfo }

  const closeModalButton = document.getElementById('close-add-product-modal')

  if (closeModalButton) {
    closeModalButton.click()
  }
}

</script>

<template>
  <div id="add-product-modal" tabindex="-1" aria-hidden="true"
    class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <!-- Modal header -->
        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Thêm thuốc</h3>
          <button type="button"
            id="close-add-product-modal"
            class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="add-product-modal">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-4 md:p-5">
          <form class="space-y-4" @submit.prevent="addProduct">
            <div>
              <label for="product-name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Tên thuốc
              </label>
              <input v-model="productInfo.name"
                type="product-name" name="product-name" id="product-name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="Paracetamol 650mg" required />
            </div>
            <div>
              <label for="product-price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Nhập giá
              </label>
              <input v-model="productInfo.price" type="product-price" name="product-price" id="product-price"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="Nhập giá" required />
            </div>
            <div>
              <label for="product-quantity" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Số lượng
              </label>
              <input v-model="productInfo.quantity" type="product-quantity" name="product-quantity"
                id="product-quantity"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="Nhập số lượng" />
            </div>
            <div>
              <label for="product-unit" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Nhập đơn vị
              </label>
              <input v-model="productInfo.unit" type="product-unit" name="product-unit" id="product-unit"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="Nhập số lượng" />
            </div>

            <button type="submit"
              class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Thêm thuốc
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
