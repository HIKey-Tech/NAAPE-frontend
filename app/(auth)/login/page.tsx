"use client";

import {
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormField,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/axios";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth, User } from "@/context/authcontext";
import GoogleSignInButton from "@/components/ui/custom/google.signin.button";

const formSchema = z.object({
    email: z.email({ message: "Please enter a valid email address" }),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(64, "Password can't be longer than 64 characters"),
});

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get("redirect");
    const [loading, setLoading] = useState(false);
    const [signingIn, setSigningIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onBlur",
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            const res = await api.post("/auth/login", values);
            const userData: User = {
                _id: res.data._id,
                name: res.data.name,
                email: res.data.email,
                role: res.data.role ?? "member",
                profile: res.data.profile,
            };
            login(userData, res.data.token);
            setSigningIn(true);
            setLoading(false);
            toast.success("Welcome back!", {
                description: "Successfully signed in.",
                duration: 3500,
            });
            setTimeout(() => {
                const dashboardPath = userData.role === "admin" ? "/admin/dashboard" : "/dashboard";

                let finalPath = dashboardPath;

                // Validate that the redirect path is a safe internal route
                // It must start with a slash and not contain another slash or backslash immediately after (e.g. //evil.com or \/evil.com)
                if (redirectPath && redirectPath.startsWith("/") && !redirectPath.startsWith("//") && !redirectPath.startsWith("\\")) {
                    finalPath = redirectPath;
                }

                // Prevent admins from being accidentally redirected to member pages, and vice versa
                if (userData.role === "admin" && finalPath !== dashboardPath && !finalPath.startsWith("/admin")) {
                    finalPath = dashboardPath;
                } else if (userData.role !== "admin" && finalPath !== dashboardPath && finalPath.startsWith("/admin")) {
                    finalPath = dashboardPath;
                }

                window.location.href = finalPath;
            }, 1000);
        } catch (error: any) {
            if (error?.response?.data?.message?.toLowerCase().includes("password")) {
                form.setError("password", { message: error.response.data.message });
            } else {
                form.setError("email", { message: error.response?.data?.message || "Login Failed" });
            }
            toast.error("Login Failed", { description: error.response?.data?.message || "Invalid credentials" });
        } finally {
            setLoading(false);
        }
    }

    const parentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
    } as any;

    const childVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 50 } },
    } as any;

    return (
        <main className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-[#f8fafc]">
            {signingIn && (
                <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-md flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <p className="text-lg font-bold text-slate-800">Signing you in...</p>
                    </div>
                </div>
            )}

            <motion.div
                className="flex w-full max-w-5xl h-[700px] shadow-2xl rounded-3xl bg-white overflow-hidden border border-slate-200"
                variants={parentVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Left: Login Form */}
                <motion.div className="w-full md:w-1/2 p-10 md:p-14 flex flex-col justify-center relative bg-white">
                    <motion.div className="flex items-center gap-3 mb-12" variants={childVariants}>
                        <div className="p-2 bg-primary/5 rounded-xl">
                            <Image src={logo} alt="NAAPE logo" width={40} height={40} className="w-10 h-10" />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-slate-900">NAAPE</span>
                    </motion.div>

                    <motion.div variants={childVariants} className="mb-8">
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome back</h1>
                        <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
                    </motion.div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <motion.div variants={childVariants}>
                                <GoogleSignInButton text="signin_with" />
                                <div className="flex items-center gap-4 my-6">
                                    <Separator className="flex-1" />
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">or</span>
                                    <Separator className="flex-1" />
                                </div>
                            </motion.div>

                            <motion.div variants={childVariants}>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-700 font-bold">Email</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                    <Input {...field} className="pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all" placeholder="Enter your email" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>

                            <motion.div variants={childVariants}>
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-700 font-bold">Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                    <Input
                                                        {...field}
                                                        type={showPassword ? "text" : "password"}
                                                        className="pl-10 pr-10 h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                                                        placeholder="••••••••"
                                                    />
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-end mt-2">
                                    <Link href="/forgot-password" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                                        Forgot password?
                                    </Link>
                                </div>
                            </motion.div>

                            <motion.div variants={childVariants}>
                                <Button type="submit" disabled={loading} className="w-full h-12 bg-primary hover:bg-blue-700 text-white font-bold rounded-xl text-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                                    {loading ? "Signing in..." : "Sign in"}
                                </Button>
                            </motion.div>
                        </form>
                    </Form>

                    <motion.p variants={childVariants} className="mt-8 text-center text-sm font-medium text-slate-500">
                        Don't have an account? <Link href={redirectPath ? `/register?redirect=${encodeURIComponent(redirectPath)}` : "/register"} className="text-primary font-bold hover:underline">Register now</Link>
                    </motion.p>
                </motion.div>

                {/* Right: Illustration */}
                <motion.div className="hidden md:block w-1/2 relative bg-slate-900 overflow-hidden">
                    <Image
                        src="/images/plane.jpg"
                        alt="Background"
                        fill
                        className="object-cover opacity-80 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />

                    <div className="absolute bottom-12 left-12 right-12 text-white">
                        <div className="w-12 h-1 bg-accent mb-6 rounded-full" />
                        <h2 className="text-4xl font-black mb-4 leading-tight">Elevating Aviation Standards</h2>
                        <p className="text-lg text-slate-200 font-medium">Join the premier association for pilots and engineers in Nigeria.</p>
                    </div>
                </motion.div>
            </motion.div>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-lg font-bold text-slate-800">Loading...</p>
                </div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
