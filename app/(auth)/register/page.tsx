"use client";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/axios";
import logo from "@/public/logo.png";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Eye, EyeOff, User, Mail, Lock, ShieldCheck, Check } from "lucide-react";
import GoogleSignInButton from "@/components/ui/custom/google.signin.button";

const formSchema = z
    .object({
        name: z.string().min(2, "Full Name must be at least 2 characters"),
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(8, "Password must be at least 8 characters").regex(/[0-9]/, "Must contain a number"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
        mode: "onBlur",
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            await api.post("/auth/register", {
                name: values.name.trim(),
                email: values.email.trim(),
                password: values.password,
            });
            toast.success("Account created successfully!");
            router.replace("/dashboard");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    }

    const parentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
    };

    const childVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 50 } },
    };

    return (
        <main className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-[#f8fafc]">
            <motion.div
                className="flex w-full max-w-5xl md:h-[800px] h-auto shadow-2xl rounded-3xl bg-white overflow-hidden border border-slate-200"
                variants={parentVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Left: Register Form */}
                <motion.div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative bg-white">
                    <motion.div className="flex items-center gap-3 mb-8" variants={childVariants}>
                        <div className="p-2 bg-primary/5 rounded-xl">
                            <Image src={logo} alt="NAAPE logo" width={40} height={40} className="w-10 h-10" />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-slate-900">NAAPE</span>
                    </motion.div>

                    <motion.div variants={childVariants} className="mb-8">
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Create Account</h1>
                        <p className="text-slate-500 font-medium">Join our community of aviation professionals.</p>
                    </motion.div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <motion.div variants={childVariants}>
                                <GoogleSignInButton text="signup_with" />
                                <div className="flex items-center gap-4 my-6">
                                    <Separator className="flex-1" />
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">or</span>
                                    <Separator className="flex-1" />
                                </div>
                            </motion.div>

                            <motion.div variants={childVariants} className="space-y-4">
                                <FormField name="name" control={form.control} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold text-slate-700">Full Name</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <Input {...field} className="pl-10 h-11 bg-slate-50 border-slate-200" placeholder="John Doe" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField name="email" control={form.control} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold text-slate-700">Email</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <Input {...field} className="pl-10 h-11 bg-slate-50 border-slate-200" placeholder="john@example.com" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField name="password" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700">Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                    <Input {...field} type={showPassword ? "text" : "password"} className="pl-10 pr-10 h-11 bg-slate-50 border-slate-200" placeholder="Create password" />
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField name="confirmPassword" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700">Confirm</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                    <Input {...field} type={showConfirmPassword ? "text" : "password"} className="pl-10 pr-10 h-11 bg-slate-50 border-slate-200" placeholder="Confirm password" />
                                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            </motion.div>

                            <motion.div variants={childVariants} className="pt-2">
                                <Button type="submit" disabled={loading} className="w-full h-12 bg-primary hover:bg-blue-700 text-white font-bold rounded-xl text-lg shadow-lg hover:shadow-xl transition-all">
                                    {loading ? "Creating Account..." : "Create Account"}
                                </Button>
                            </motion.div>
                        </form>
                    </Form>
                    <p className="mt-8 text-center text-sm font-medium text-slate-500">
                        Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Sign in</Link>
                    </p>
                </motion.div>

                {/* Right: Illustration */}
                <motion.div className="hidden md:block w-1/2 relative bg-slate-900">
                    <Image
                        src="/images/plane.jpg"
                        alt="Background"
                        fill
                        className="object-cover opacity-60 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                    <div className="absolute bottom-16 left-12 right-12 text-white space-y-6">
                        <div className="space-y-4">
                            {[
                                "Exclusive Member Resources",
                                "Professional Networking",
                                "Legal & Safety Advocacy",
                                "Career Development"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                                        <Check size={14} strokeWidth={3} />
                                    </div>
                                    <span className="font-bold text-lg">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </main>
    );
}
