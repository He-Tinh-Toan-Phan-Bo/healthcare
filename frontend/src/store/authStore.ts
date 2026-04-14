import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User } from '@/shared/types'

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
}

interface AuthActions {
    setUser: (user: User | null) => void
    setToken: (token: string | null) => void
    login: (user: User, token: string) => void
    logout: () => void
    setLoading: (isLoading: boolean) => void
}

type AuthStore = AuthState & AuthActions

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            ...initialState,

            setUser: (user) =>
                set({
                    user,
                    isAuthenticated: !!user,
                }),

            setToken: (token) => set({ token }),

            login: (user, token) =>
                set({
                    user,
                    token,
                    isAuthenticated: true,
                    isLoading: false,
                }),

            logout: () =>
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false,
                }),

            setLoading: (isLoading) => set({ isLoading }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)
