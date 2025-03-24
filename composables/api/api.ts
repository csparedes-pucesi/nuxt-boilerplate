import axios from 'axios'

// const runtimeConfig = useRuntimeConfig()

const useApi = axios.create({
  baseURL: 'http://192.168.0.47:4000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

useApi.interceptors.request.use(
  (config) => {
    console.log()
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default useApi
