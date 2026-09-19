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

// Check if a path is public (does not require auth redirect)
const isPublicPath = (pathname) => {
  if (!pathname) return false;
  if (pathname === '/auth' || pathname.startsWith('/auth/')) return true;
  if (pathname === '/explore' || pathname.startsWith('/explore/')) return true;

  const protectedPaths = ['/', '/profile', '/community', '/quotes', '/settings'];
  const isProtected = protectedPaths.some(path =>
    path === '/' ? pathname === '/' : (pathname === path || pathname.startsWith(path + '/'))
  );

  const segments = pathname.split('/').filter(Boolean);
  return segments.length === 1 && !isProtected;
};

const shouldRedirectToAuth = (originalRequest) => {
  if (originalRequest?.skipAuthRedirect) return false;
  if (typeof window === 'undefined') return false;
  const pathname = window.location.pathname;
  return !isPublicPath(pathname);
};

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

        if (shouldRedirectToAuth(originalRequest)) {
          toast.error("Sessiya tugadi, iltimos qayta kiring")
          window.location.href = '/auth'
        }
        return Promise.reject(refreshError)
      }
    }

    if (status === 401 && originalRequest?.url?.includes('auth/refresh')) {
      if (shouldRedirectToAuth(originalRequest)) {
        toast.error("Sessiya tugadi, iltimos qayta kiring")
        window.location.href = '/auth'
      }
    }

    return Promise.reject(error)
  }
)

export default api