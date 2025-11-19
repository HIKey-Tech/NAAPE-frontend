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

    // Load auth state on initial page load
    useEffect(() => {
        if (typeof window === "undefined") return;

        const tokenVal = Cookies.get("token") || localStorage.getItem("token") || null;
        const userVal = localStorage.getItem("user");

        if (tokenVal && userVal) {
            setToken(tokenVal);
            setUser(JSON.parse(userVal));
        } else {
            setToken(null);
            setUser(null);
        }

        setLoading(false);
    }, []);

    // Keep token in sync when it changes
    useEffect(() => {
        if (typeof window === "undefined") return;

        if (token) {
            Cookies.set("token", token, {
                expires: 7,
                secure: true,
                sameSite: "Lax",
            });
            localStorage.setItem("token", token);
        } else {
            Cookies.remove("token");
            localStorage.removeItem("token");
        }
    }, [token]);

    // ============ LOGIN ============
    const login = useCallback((loginUser: User, loginToken: string) => {
        setUser(loginUser);
        setToken(loginToken);

        if (typeof window !== "undefined") {
            Cookies.set("token", loginToken, {
                expires: 7,
                secure: true,
                sameSite: "Lax",
            });

            localStorage.setItem("token", loginToken);
            localStorage.setItem("user", JSON.stringify(loginUser));
        }
    }, []);

    // ============ LOGOUT ============
    const logout = useCallback(() => {
        setUser(null);
        setToken(null);

        if (typeof window !== "undefined") {
            Cookies.remove("token");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }

        router.replace("/login");
    }, [router]);

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
    }, []);

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
