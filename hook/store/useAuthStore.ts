import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    hydrated: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    setHydrated: () => void;

    setUser: (user: User |null, token?: string | null) => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            hydrated: false,

            setUser: (user, token = null) => 
                set({
                    user, token, isAuthenticated: !!user
                }),

            setHydrated: () => set({ hydrated: true }),

            login: (user, token) => {
                set({ user, token, isAuthenticated: true });
            },

            logout: () => {
                set({ user: null, token: null, isAuthenticated: false });
            },
        }),
        {
            name: "auth-storage",
            onRehydrateStorage: () => (state) => {
                state?.setHydrated();
            },
        }
    )
);
