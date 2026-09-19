import { create } from 'zustand'

const useMenuStore = create((set) => ({
    isOpen: true,
    setIsOpen: (val) => set({ isOpen: val }),
    toggleMenu: () => set((state) => ({ isOpen: !state.isOpen })),
}))

export default useMenuStore