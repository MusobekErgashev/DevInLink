import { create } from 'zustand'
import api from '@/api/axios'

let fetchPromise = null

const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  fetched: false,
  fetchUser: async (force = false) => {
    const state = get()

    // If already fetched and not forcing, return stored user
    if (state.fetched && !force) {
      return state.user
    }

    // If request is already in-flight, reuse the same promise to prevent duplicate requests
    if (fetchPromise && !force) {
      return fetchPromise
    }

    set({ loading: true })

    fetchPromise = (async () => {
      try {
        const res = await api.get('users/me', { skipAuthRedirect: true })
        const uData = Array.isArray(res.data) ? res.data[0] : res.data
        set({ user: uData || null, fetched: true, loading: false })
        return uData || null
      } catch (err) {
        set({ user: null, fetched: true, loading: false })
        return null
      } finally {
        fetchPromise = null
      }
    })()

    return fetchPromise
  },
  setUser: (userData) => set({ user: userData, fetched: true, loading: false }),
  clearUser: () => {
    fetchPromise = null
    set({ user: null, fetched: false, loading: false })
  }
}))

export default useUserStore
