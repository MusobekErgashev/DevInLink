import { create } from 'zustand'

const useMenuStore = create((set) => ({
    isOpen: true,
    toggleMenu: () => set((state) => ({ isOpen: !state.isOpen })),
}))

export default useMenuStore