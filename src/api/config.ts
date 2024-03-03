export const APISettings = {
  API_URL: import.meta.env.VITE_APP_API_BASE + '/api/v1',
  HEADER: new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json'
  })
}
