import { create } from 'zustand'

const useQueryStore = create((set) => ({
    total: 0,
    setTotal: (total) => set({ total }),
    
    query: "",
    setQuery: (query) => set({ query }),
    resetQuery: () => set({ query: "" }),
}))

export default useQueryStore