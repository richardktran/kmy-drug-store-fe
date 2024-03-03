export interface Order extends Partial<BasicOrder> {
  product_name: string | null,
  unit: string | null,
  quantity: number | null,
  // note: string | null,
}

export interface BasicOrder  {
  phone_number: string,
  full_name: string | null,
  amount: number | string,
}

export interface OrderInfo {
  phone_number: string
  full_name: {
    isLoading: boolean
    data: string
  }
  amount: number
}

export interface ProductInfo {
  name: string
  price: number|string
  quantity: number
  unit: string
}
