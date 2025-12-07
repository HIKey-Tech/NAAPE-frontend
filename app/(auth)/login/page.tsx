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
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
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
            };

            login(userData, res.data.token);

            router.push("/dashboard");
            toast.success("🎉 Logged in! Welcome back.", {
                description: (
                    <p className="text-sm  text-green-700 font-medium">
                        Successfully signed in!
                    </p>
                ),
                duration: 3500,
                position: "top-center",
            });
        } catch (error: any) {
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
        <main className="min-h-full w-full py-10 px-6 flex items-center justify-center bg-gradient-to-tr from-[#d6e1f8] via-[#eff3fa] to-[#e3ecfb]">
            <motion.div
                className="flex flex-col md:flex-row w-full max-w-6xl h-full shadow-2xl rounded-2xl bg-white border border-[#d8e0f0]"
                variants={parentVariants as any}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                {/* Left: Login form */}
                <motion.div
                    className="w-full md:w-full h-full py-12 px-6 md:px-14 flex flex-col justify-center bg-white/95 rounded-l-2xl"
                    variants={childVariants as any}
                >
                    {/* Top NAAPE logo */}
                    <motion.div
                        className="flex items-start justify-between mb-8 relative w-full"
                        variants={childVariants as any}
                    >
                        <div className="flex items-center gap-2">
                            <Image
                                src={logo}
                                alt="NAAPE logo"
                                width={55}
                                height={55}
                                className="drop-shadow"
                                priority
                            />
                            <span className="ml-1 text-xl md:text-2xl font-extrabold tracking-tight text-[#2347a0] hover:text-[#2852b4]">
                                NAAPE
                            </span>
                        </div>
                        <div className="flex flex-col md:flex-row justify-end items-end gap-0 md:gap-1 text-[15px] font-normal">
                            <span className="text-xs text-[#586078] mb-1 md:mb-0">
                                Don&apos;t have an account?
                            </span>
                            <Link
                                href="/register"
                                className="text-[#2852B4] font-semibold hover:underline transition duration-150 text-[14.5px]"
                            >
                                Register
                            </Link>
                        </div>
                    </motion.div>

                    {/* Welcome / Card */}
                    <motion.div variants={childVariants as any}>
                        <h1 className="text-2xl md:text-3xl leading-[1.12] font-extrabold text-slate-900 mb-2 text-left">
                            Sign in to your <span className="text-[#2852B4]">NAAPE</span> account
                        </h1>
                        <span className="block mb-8 text-[15px] text-[#3d4770] font-medium">
                            Best app for <span className="font-semibold text-[#3970D8]">Pilots</span> and <span className="font-semibold text-[#e65d15]">Engineers</span>
                        </span>
                    </motion.div>
                    <Form {...form}>
                        <motion.form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
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
                                    className="mb-3 w-full h-[41px] rounded-md gap-3 border border-[#DADFF2] bg-white text-[#2347a0] font-semibold text-[15.3px] shadow-none hover:bg-[#f3f6fa] transition-colors duration-150"
                                >
                                    <Image
                                        src={google}
                                        alt="Google"
                                        width={24}
                                        height={24}
                                        className="-ml-2"
                                    />
                                    <span className="font-semibold">Sign in with Google</span>
                                </Button>
                            </motion.div>

                            {/* OR separator */}
                            <motion.div className="flex items-center gap-4 mb-2" variants={childVariants as any}>
                                <Separator className="flex-1 bg-[#DADFF2] h-[2px]" />
                                <span className="text-xs/relaxed text-slate-600 font-semibold tracking-[0.08em] mx-1 uppercase">
                                    or
                                </span>
                                <Separator className="flex-1 bg-[#DADFF2] h-[2px]" />
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
                                                className="text-[#1e2c50] text-[15.3px] font-semibold mb-1"
                                            >
                                                Email Address
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3970D8]">
                                                        <Mail size={19} />
                                                    </span>
                                                    <Input
                                                        {...field}
                                                        id="login-email"
                                                        type="email"
                                                        inputMode="email"
                                                        placeholder="you@email.com"
                                                        autoComplete="email"
                                                        aria-label="Email"
                                                        aria-required="true"
                                                        spellCheck={false}
                                                        className={`h-[44px] rounded-md border border-[#CBD6F1] bg-white text-base font-medium placeholder:text-[#A4B2D5] pl-11 focus:ring-2 focus:ring-[#2852B4] focus:border-[#2852B4] transition-colors duration-150 ${form.formState.errors.email ? "border-[#e65d15] focus:ring-[#e65d15]" : ""}`}
                                                        disabled={loading}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs text-[#e65d15] mt-1" />
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
                                                className="text-[#1e2c50] text-[15.3px] font-semibold mb-1 flex justify-between items-center"
                                            >
                                                Password
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3970D8]">
                                                        <Lock size={19} />
                                                    </span>
                                                    <Input
                                                        {...field}
                                                        id="login-password"
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Your password"
                                                        autoComplete="current-password"
                                                        aria-label="Password"
                                                        aria-required="true"
                                                        minLength={6}
                                                        maxLength={64}
                                                        spellCheck={false}
                                                        className={`h-[44px] rounded-md border border-[#CBD6F1] bg-white text-base font-medium placeholder:text-[#A4B2D5] pr-11 pl-11 focus:ring-2 focus:ring-[#2852B4] focus:border-[#2852B4] transition-colors duration-150 ${form.formState.errors.password ? "border-[#e65d15] focus:ring-[#e65d15]" : ""}`}
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
                                                            ? <EyeOff size={18} className="text-[#7A88C7]" />
                                                            : <Eye size={18} className="text-[#7A88C7]" />
                                                        }
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs text-[#e65d15] mt-1" />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>

                            {/* Forgot password */}
                            <motion.div className="flex justify-end items-center mt-0 mb-4" variants={childVariants as any}>
                                <Link
                                    href="/forgot-password"
                                    className="text-[#2852B4] text-[14.1px] font-semibold hover:underline focus:outline-none focus:ring"
                                >
                                    Forgot password?
                                </Link>
                            </motion.div>

                            {/* Sign In button */}
                            <motion.div variants={childVariants as any}>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-[50px] mt-1 rounded-lg bg-gradient-to-r from-[#2852B4] to-[#3970d8] hover:from-[#2347A0] hover:to-[#2852B4] text-white text-[17px] font-extrabold tracking-wide shadow-lg flex items-center justify-center transition-all duration-150"
                                >
                                    {loading ? (
                                        <>
                                            <span className="mr-2 animate-spin flex items-center">
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
                    className="bg-transparent w-full justify-center items-center relative rounded-r-2xl overflow-hidden"
                    initial={{ opacity: 0, x: 70 }}
                    animate={{ opacity: 1, x: 0, transition: { type: "spring", delay: 0.28, stiffness: 46, damping: 12 } }}
                    exit={{ opacity: 0, x: 70, transition: { duration: 0.25 } }}
                >
                    <div className="absolute inset-0 shadow-lg rounded-r-2xl overflow-hidden">
                        <Image
                            src="/images/plane.jpg"
                            alt="Cockpit interior with a panoramic view"
                            fill
                            quality={90}
                            style={{
                                objectFit: "cover",
                                objectPosition: "center",
                                transition: "opacity 0.7s ease",
                                opacity: 0.98,
                                filter: "brightness(0.86) saturate(1.09) contrast(1.07)",
                                borderTopRightRadius: "16px",
                                borderBottomRightRadius: "16px",
                            }}
                            sizes="(max-width: 900px) 0vw, 53vw"
                            priority
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1b284cdd] via-transparent to-transparent h-36 rounded-b-[16px] pointer-events-none" />
                        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[#2a325066] via-transparent to-transparent h-28 rounded-tr-[16px] pointer-events-none" />
                    </div>
                </motion.div>
            </motion.div>
        </main>
    );
}