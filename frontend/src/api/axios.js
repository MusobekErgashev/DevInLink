import axios from 'axios'
import { toast } from 'react-hot-toast'

const isLocal = typeof window !== 'undefined'
  ? ['localhost', '127.0.0.1'].includes(window.location.hostname)
  : (process.env.NODE_ENV !== 'production')

const BASE_URL = isLocal
  ? (typeof window !== 'undefined' ? `http://${window.location.hostname}:8000/api/` : 'http://localhost:8000/api/')
  : process.env.BASE_URL

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
  withCredentials: true,
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// ── Xatolarni markazlashgan boshqarish ─────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        await api.post('auth/refresh')
        isRefreshing = false
        processQueue(null)
        return api(originalRequest)
      } catch (refreshError) {
        isRefreshing = false
        processQueue(refreshError, null)

        if (typeof window !== 'undefined' && window.location.pathname !== '/auth') {
          toast.error("Sessiya tugadi, iltimos qayta kiring")
          window.location.href = '/auth'
        }
        return Promise.reject(refreshError)
      }
    }

    if (status === 401 && originalRequest?.url?.includes('auth/refresh')) {
      if (typeof window !== 'undefined' && window.location.pathname !== '/auth') {
        toast.error("Sessiya tugadi, iltimos qayta kiring")
        window.location.href = '/auth'
      }
    }

    return Promise.reject(error)
  }
)

export default api