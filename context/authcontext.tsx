" use client"

import { createContext, useState, ReactNode, useContext } from "react";
import Cookies from "js-cookie";


interface User {

    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;

    login: (user: User, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const login = (user: User, token: string) => {
        setUser(user);
        setToken(token);


        // Save token in browser cookie (readable by middleware)
        Cookies.set("token", token, {
            expires: 7, // 7 days
            secure: true,
            sameSite: "Lax",
        });

        // If you also want to keep localStorage:
        localStorage.setItem("token", token);    };

    const logout = () => {
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user: user,
                token: token,
                isAuthenticated: !!user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
}