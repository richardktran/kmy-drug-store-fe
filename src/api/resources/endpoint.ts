import { APISettings } from '../config'

export default {
  fetchUserByPhone: async (phone: string) => {
    return await fetch(`${APISettings.API_URL}/users?phone_number=${phone}`, {
      method: 'GET',
      headers: APISettings.HEADER
    })
  }
}
