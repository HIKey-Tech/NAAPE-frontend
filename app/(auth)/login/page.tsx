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
import google from "@/public/images/google.png"
import { toast } from "sonner";

// import { GoogleLogin } from "@react-oauth/google";


// ADD ICONS
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

// Framer Motion
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, User } from "@/context/authcontext";

const formSchema = z.object({
    email: z.email({ message: "Please enter a valid email address" }),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(64, "Password can't be longer than 64 characters"),
});

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth()

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
            };

            login(userData, res.data.token);

            // setUser(res.data.user, res.data.token)
            router.push("/dashboard");
            toast("Login Successful", { description: `Explore your dashboard` });
        } catch (error: any) {
            // Prefer more specific error mapping for better feedback
            if (error?.response?.data?.message?.toLowerCase().includes("password")) {
                form.setError("password", {
                    message: error.response.data.message,
                });
            } else {
                form.setError("email", {
                    message: error.response?.data?.message || "Login Failed",
                });
            }
            toast("Login Failed", { description: `${error.response?.data?.message || error}` });
        } finally {
            setLoading(false);
        }
    }

    // Placeholder for actual google sign-in
    function handleGoogleSignIn() {
        alert("Google sign-in coming soon");
    }

    // Framer motion variants
    const parentVariants = {
        hidden: { opacity: 0, y: 35 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 70,
                damping: 17,
                staggerChildren: 0.12,
            },
        },
        exit: { opacity: 0, y: 35, transition: { duration: 0.32 } }
    };

    const childVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60, damping: 15 } },
        exit: { opacity: 0, y: 20, transition: { duration: 0.22 } }
    };

    return (
        <main className="min-h-full w-full py-10 px-6 flex items-center justify-center bg-[#f6f7fa]">
            <motion.div
                className="flex flex-col md:flex-row w-full max-w-6xl h-full shadow-xl rounded-xl bg-white"
                variants={parentVariants as any}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                {/* Left: Login form */}
                <motion.div
                    className="w-full md:w-full h-full py-9 px-5 md:px-10 flex flex-col justify-center"
                    variants={childVariants as any}
                >
                    {/* Top NAAPE logo */}
                    <motion.div
                        className="flex items-center justify-between mb-6 relative min-h-full w-full"
                        variants={childVariants as any}
                    >
                        <Image
                            src={logo}
                            alt="NAAPE logo"
                            width={60}
                            height={60}
                            className=""
                            priority
                        />
                        {/* Don't have account link */}
                        <div className="flex justify-end items-center text-[14px] font-normal mb-6">
                            <span className="text-xs right-0 top-0 text-[#817F94]">Don&apos;t have account?</span>
                            <Link
                                href="/register"
                                className="ml-1 text-[#3970D8] font-medium hover:underline"
                            >
                                Register
                            </Link>
                        </div>
                    </motion.div>

                    {/* Welcome / Card */}
                    <motion.div variants={childVariants as any}>
                        <h1 className="text-[22px] md:text-[24px] leading-[1.16] font-bold text-[#0A1331] mb-1 text-center">
                            Welcome to NAAPE!
                        </h1>
                        <span className="block mb-8 text-[15px] text-[#7F8596] font-normal text-center">
                            Best app for Pilots and Engineers
                        </span>
                    </motion.div>
                    <Form {...form}>
                        <motion.form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                            autoComplete="on"
                            variants={parentVariants as any}
                            initial={false}
                            animate="visible"
                        >
                            {/* Google sign in */}
                            <motion.div variants={childVariants as any}>
                                <Button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    variant="outline"
                                    className="mb-3 w-full h-[38px] rounded-[6px] gap-2 border border-[#E3E6ED] bg-transparent text-[#091B3C] font-medium text-[14.4px] shadow-none hover:bg-[#F6F7FB]"
                                >
                                    <Image
                                        src={google}
                                        alt="Google"
                                        width={20}
                                        height={20}
                                        className="-ml-1"
                                    />
                                    <span className="font-medium">Sign in with Google</span>
                                </Button>
                            </motion.div>

                            {/* OR separator */}
                            <motion.div className="flex items-center gap-3 mb-1" variants={childVariants as any}>
                                <Separator className="flex-1 bg-[#E9EAF0] h-[1.5px]" />
                                <span className="text-xs text-[#7F8596] font-medium mx-1">
                                    OR
                                </span>
                                <Separator className="flex-1 bg-[#E9EAF0] h-[1.5px]" />
                            </motion.div>

                            {/* Email with icon */}
                            <motion.div variants={childVariants as any}>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                htmlFor="login-email"
                                                className="text-[#586078] text-[15px] font-medium mb-1"
                                            >
                                                Email address
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A6ACC5]">
                                                        <Mail size={18} />
                                                    </span>
                                                    <Input
                                                        {...field}
                                                        id="login-email"
                                                        type="email"
                                                        inputMode="email"
                                                        placeholder="engineer@naape.ng"
                                                        autoComplete="email"
                                                        aria-label="Email"
                                                        aria-required="true"
                                                        spellCheck={false}
                                                        className={`h-[42px] rounded-[6px] border border-[#E3E6ED] bg-[#FAFBFE] text-base placeholder:text-[#A6ACC5] pl-10 ${form.formState.errors.email ? "border-red-400" : ""}`}
                                                        disabled={loading}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs mt-1" />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>

                            {/* Password with icon and visibility toggle */}
                            <motion.div variants={childVariants as any}>
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                htmlFor="login-password"
                                                className="text-[#586078] text-[15px] font-medium mb-1 flex justify-between items-center"
                                            >
                                                Password
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A6ACC5]">
                                                        <Lock size={18} />
                                                    </span>
                                                    <Input
                                                        {...field}
                                                        id="login-password"
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Password"
                                                        autoComplete="current-password"
                                                        aria-label="Password"
                                                        aria-required="true"
                                                        minLength={6}
                                                        maxLength={64}
                                                        spellCheck={false}
                                                        className={`h-[42px] rounded-[6px] border border-[#E3E6ED] bg-[#FAFBFE] text-base placeholder:text-[#A6ACC5] pr-10 pl-10 ${form.formState.errors.password ? "border-red-400" : ""}`}
                                                        disabled={loading}
                                                    />
                                                    <button
                                                        type="button"
                                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                                        className="absolute right-2 top-0 bottom-0 flex items-center"
                                                        tabIndex={-1}
                                                        onClick={() => setShowPassword((p) => !p)}
                                                        disabled={loading}
                                                    >
                                                        {showPassword
                                                            ? <EyeOff size={18} className="text-[#A6ACC5]" />
                                                            : <Eye size={18} className="text-[#A6ACC5]" />
                                                        }
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs mt-1" />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>

                            {/* Forgot password */}
                            <motion.div className="flex justify-end items-center mt-1 mb-4" variants={childVariants as any}>
                                <Link
                                    href="/forgot-password"
                                    className="text-[#3970D8] text-[14px] font-medium hover:underline focus:outline-none focus:ring"
                                >
                                    Forgot password?
                                </Link>
                            </motion.div>

                            {/* Sign In button */}
                            <motion.div variants={childVariants as any}>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-[44px] mt-1 rounded-[7px] bg-[#2852B4] hover:bg-[#2347A0] text-white text-[16px] font-semibold tracking-wide shadow-none flex items-center justify-center"
                                >
                                    {loading ? (
                                        <>
                                            {/* Plane spinner */}
                                            <span className="mr-2 animate-spin" style={{ display: "flex", alignItems: "center" }}>
                                                {/* Replace below SVG with any plane SVG or icon as your setup prefers */}
                                                <svg viewBox="0 0 20 20" fill="none" width={20} height={20}>
                                                    <path
                                                        d="M2 10l16-4-2 5-9 3-1 4-2-5z"
                                                        fill="#fff"
                                                        stroke="#fff"
                                                        strokeWidth={1}
                                                    />
                                                </svg>
                                            </span>
                                            Signing In...
                                        </>
                                    ) : (
                                        "Sign In"
                                    )}
                                </Button>
                            </motion.div>
                        </motion.form>
                    </Form>
                </motion.div>

                {/* Right Side Illustration */}
                <motion.div
                    className="bg-transparent w-full justify-center items-center relative"
                    initial={{ opacity: 0, x: 70 }}
                    animate={{ opacity: 1, x: 0, transition: { type: "spring", delay: 0.28, stiffness: 46, damping: 12 } }}
                    exit={{ opacity: 0, x: 70, transition: { duration: 0.25 } }}
                >
                    <div className="absolute inset-0">
                        <Image
                            src="/images/plane.jpg"
                            alt="Cockpit interior with a panoramic view"
                            fill
                            quality={70}
                            style={{
                                objectFit: "cover",
                                objectPosition: "center",
                                transition: "opacity 0.7s ease",
                                opacity: 0.98,
                                filter: "brightness(0.92) saturate(1.05)",
                                borderTopRightRadius: "16px",
                                borderBottomRightRadius: "16px",
                            }}
                            sizes="(max-width: 900px) 0vw, 53vw"
                            priority
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A173550] via-transparent to-transparent h-32 rounded-b-[16px] pointer-events-none" />
                    </div>
                </motion.div>
            </motion.div>
        </main>
    );
}