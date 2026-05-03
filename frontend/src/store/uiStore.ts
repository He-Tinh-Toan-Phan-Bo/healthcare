import { create } from 'zustand'

interface UIState {
    isSidebarOpen: boolean
    isMobileMenuOpen: boolean
    isLoading: boolean
    theme: 'light' | 'dark' | 'system'
}

interface UIActions {
    toggleSidebar: () => void
    setSidebarOpen: (isOpen: boolean) => void
    toggleMobileMenu: () => void
    setMobileMenuOpen: (isOpen: boolean) => void
    setLoading: (isLoading: boolean) => void
    setTheme: (theme: 'light' | 'dark' | 'system') => void
}

type UIStore = UIState & UIActions

const initialState: UIState = {
    isSidebarOpen: true,
    isMobileMenuOpen: false,
    isLoading: false,
    theme: 'system',
}

export const useUIStore = create<UIStore>()((set) => ({
    ...initialState,

    toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

    setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

    toggleMobileMenu: () =>
        set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

    setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),

    setLoading: (isLoading) => set({ isLoading }),

    setTheme: (theme) => set({ theme }),
}))
