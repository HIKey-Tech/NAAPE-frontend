"use client";

import {
    createContext,
    useState,
    useContext,
    useEffect,
    useCallback,
    useMemo,
    type ReactNode,
} from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hook/store/useAuthStore";

// ============ TYPES ============
export type User = {
    _id: string;
    name: string;
    email: string;
    role: string;
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    setAuthenticatedUser: (user: User | null, token: string | null) => void;
};

// ============ CONTEXT ============
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============ PROVIDER ============
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const zustandStore = useAuthStore();

    // Load auth state on initial page load
    useEffect(() => {
        if (typeof window === "undefined") return;

        const tokenVal = Cookies.get("token") || localStorage.getItem("token") || null;
        const userVal = localStorage.getItem("user");

        if (tokenVal && userVal) {
            setToken(tokenVal);
            try {
                const parsedUser = JSON.parse(userVal);
                
                // Migration: Handle old user objects that might have 'id' instead of '_id'
                if (parsedUser && !parsedUser._id && parsedUser.id) {
                    parsedUser._id = parsedUser.id;
                    // Save the migrated user back to localStorage
                    localStorage.setItem("user", JSON.stringify(parsedUser));
                }
                
                setUser(parsedUser);
                // Sync with Zustand store
                zustandStore.login(parsedUser, tokenVal);
            } catch (error) {
                console.error("Failed to parse user from localStorage:", error);
                // Clear invalid data
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                Cookies.remove("token");
                setUser(null);
                setToken(null);
                zustandStore.logout();
            }
        } else {
            setToken(null);
            setUser(null);
            zustandStore.logout();
        }

        setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Removed redundant useEffect - storage is now handled directly in login/logout functions

    // ============ LOGIN ============
    const login = useCallback((loginUser: User, loginToken: string) => {
        // Write to storage FIRST (synchronously) before updating state
        if (typeof window !== "undefined") {
            Cookies.set("token", loginToken, {
                expires: 7,
                secure: true,
                sameSite: "Lax",
            });
            localStorage.setItem("token", loginToken);
            localStorage.setItem("user", JSON.stringify(loginUser));
        }
        
        // Then update React state
        setUser(loginUser);
        setToken(loginToken);
        
        // Sync with Zustand store
        zustandStore.login(loginUser, loginToken);
    }, [zustandStore]);

    // ============ LOGOUT ============
    const logout = useCallback(() => {
        // Clear storage first
        if (typeof window !== "undefined") {
            Cookies.remove("token");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }

        // Clear state
        setUser(null);
        setToken(null);
        
        // Sync with Zustand store
        zustandStore.logout();

        // Use setTimeout to defer navigation until after React finishes current render cycle
        setTimeout(() => {
            router.push("/login");
        }, 0);
    }, [router, zustandStore]);

    // ============ MANUAL AUTH SET ============
    const setAuthenticatedUser = useCallback((newUser: User | null, newToken: string | null) => {
        setUser(newUser);
        setToken(newToken);

        if (typeof window !== "undefined") {
            if (newToken) {
                Cookies.set("token", newToken, {
                    expires: 7,
                    secure: true,
                    sameSite: "Lax",
                });
                localStorage.setItem("token", newToken);
                if (newUser) localStorage.setItem("user", JSON.stringify(newUser));
            } else {
                Cookies.remove("token");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        }
        
        // Sync with Zustand store
        if (newUser && newToken) {
            zustandStore.login(newUser, newToken);
        } else {
            zustandStore.logout();
        }
    }, [zustandStore]);

    // ============ MEMOIZED VALUE ============
    const value = useMemo(
        () => ({
            user,
            token,
            isAuthenticated: Boolean(user && token),
            loading,
            login,
            logout,
            setAuthenticatedUser,
        }),
        [user, token, loading, login, logout, setAuthenticatedUser]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============ HOOK ============
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
