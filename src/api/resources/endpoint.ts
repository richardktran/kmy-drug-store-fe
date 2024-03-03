import { APISettings } from '../config'
import { type Order, type BasicOrder } from '@/types'

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

  fetchOrders: async () => {
    return await fetch(`${APISettings.API_URL}/admin/orders`, {
      method: 'GET',
      headers: APISettings.HEADER
    })
  }
}
