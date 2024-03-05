import { APISettings } from '../config'
import { type Order, type BasicOrder, type GetOrderParam } from '@/types'

export default {
  fetchUserByPhone: async (phone: string) => {
    return await fetch(`${APISettings.API_URL}/users?phone_number=${phone}`, {
      method: 'GET',
      headers: APISettings.HEADER
    })
  },

  storeOrder: async (order: Order | BasicOrder) => {
    return await fetch(`${APISettings.API_URL}/orders`, {
      method: 'POST',
      headers: APISettings.HEADER,
      body: JSON.stringify(order)
    })
  },

  fetchOrders: async (params: GetOrderParam) => {
    let query = ''

    if (params.phone_number) {
      query = `User.phone_number=${params.phone_number}`
    }
    
    return await fetch(`${APISettings.API_URL}/admin/orders?${query}`, {
      method: 'GET',
      headers: APISettings.HEADER
    })
  }
}
