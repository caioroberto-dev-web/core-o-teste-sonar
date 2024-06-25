import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
// const api = axios.create({ baseURL: 'https://661c1c06e7b95ad7fa69b6e1.mockapi.io/' })
// const api = axios.create({ baseURL: 'http://3.90.226.76:8080/api/' })

// Crie uma variável para o IP e o caminho da API
const backendIp = '107.23.101.16'
const apiPath = '/api/'

// Construa a URL completa com base nas variáveis acima
export const baseUrl = `http://${backendIp}:8080${apiPath}`

// Crie a instância do axios com a URL completa
const api = axios.create({ baseURL: baseUrl })

// Interceptor
api.interceptors.request.use(function (config) {
  const token = sessionStorage.getItem('token')
  config.headers.Authorization = `Bearer ${token}`
  return config
})

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
