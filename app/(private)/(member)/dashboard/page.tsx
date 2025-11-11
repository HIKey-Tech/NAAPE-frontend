"use client";
import { useAuthStore } from "@/hook/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) router.replace("/login");
    }, [isAuthenticated]);

    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
            <p className="text-gray-600 mt-2">Role: {user?.role}</p>
        </main>
    );
}
