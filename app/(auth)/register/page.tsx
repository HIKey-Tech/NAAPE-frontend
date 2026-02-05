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
import google from "@/public/images/google.png";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Eye, EyeOff, User, Mail, Lock, ShieldCheck } from "lucide-react";
import GoogleSignInButton from "@/components/ui/custom/google.signin.button";

const formSchema = z
    .object({
        name: z
            .string()
            .min(2, "Full Name must be at least 2 characters")
            .max(48, "Full Name must be less than 48 characters")
            .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ '.-]{2,48}$/, {
                message: "Full Name can only contain alphabetic characters, spaces and . ' -",
            }),
        email: z
            .string()
            .email("Please enter a valid email address")
            .min(1, "Email is required"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(32, "Password can't be more than 32 characters")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[0-9]/, "Password must contain at least one number"),
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
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
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
            
            toast.success("🎉 Registration successful! Welcome to NAAPE.", {
                description: (
                    <p className="text-sm text-green-700 font-medium">
                        Your account has been created successfully!
                    </p>
                ),
                duration: 3500,
                position: "top-center",
            });
            
            router.replace("/dashboard");
        } catch (error: any) {
            if (error?.response?.data?.message) {
                toast("Registration Failed", { 
                    description: error.response.data.message 
                });
            } else {
                toast("Registration Failed", { 
                    description: "An error occurred during registration" 
                });
            }
        } finally {
            setLoading(false);
        }
    }

    function handleGoogleSignUp() {
        alert("Google sign-up coming soon");
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
                {/* Left: Register form */}
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
                                Already a member?
                            </span>
                            <Link
                                href="/login"
                                className="text-[#2852B4] font-semibold hover:underline transition duration-150 text-[14.5px]"
                            >
                                Login
                            </Link>
                        </div>
                    </motion.div>

                    {/* Welcome / Card */}
                    <motion.div variants={childVariants as any}>
                        <h1 className="text-2xl md:text-3xl leading-[1.12] font-extrabold text-slate-900 mb-2 text-left">
                            Join <span className="text-[#2852B4]">NAAPE</span>
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
                            {/* Google sign up */}
                            <motion.div variants={childVariants as any}>
                                <GoogleSignInButton text="signup_with" />
                            </motion.div>

                            {/* OR separator */}
                            <motion.div className="flex items-center gap-4 mb-2" variants={childVariants as any}>
                                <Separator className="flex-1 bg-[#DADFF2] h-[2px]" />
                                <span className="text-xs/relaxed text-slate-600 font-semibold tracking-[0.08em] mx-1 uppercase">
                                    or
                                </span>
                                <Separator className="flex-1 bg-[#DADFF2] h-[2px]" />
                            </motion.div>

                            {/* Full Name with icon */}
                            <motion.div variants={childVariants as any}>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                htmlFor="register-name"
                                                className="text-[#1e2c50] text-[15.3px] font-semibold mb-1"
                                            >
                                                Full Name
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3970D8]">
                                                        <User size={19} />
                                                    </span>
                                                    <Input
                                                        {...field}
                                                        id="register-name"
                                                        type="text"
                                                        placeholder="Enter your full name"
                                                        autoComplete="name"
                                                        aria-label="Full Name"
                                                        aria-required="true"
                                                        spellCheck={false}
                                                        maxLength={48}
                                                        className={`h-[44px] rounded-md border border-[#CBD6F1] bg-white text-base font-medium placeholder:text-[#A4B2D5] pl-11 focus:ring-2 focus:ring-[#2852B4] focus:border-[#2852B4] transition-colors duration-150 ${form.formState.errors.name ? "border-[#e65d15] focus:ring-[#e65d15]" : ""}`}
                                                        disabled={loading}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs text-[#e65d15] mt-1" />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>

                            {/* Email with icon */}
                            <motion.div variants={childVariants as any}>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                htmlFor="register-email"
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
                                                        id="register-email"
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
                                                htmlFor="register-password"
                                                className="text-[#1e2c50] text-[15.3px] font-semibold mb-1"
                                            >
                                                Password
                                                <span className="ml-2 text-xs text-[#7A88C7] font-normal">(minimum 8 characters, upper & lower-case, number)</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3970D8]">
                                                        <Lock size={19} />
                                                    </span>
                                                    <Input
                                                        {...field}
                                                        id="register-password"
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Create a password"
                                                        autoComplete="new-password"
                                                        aria-label="Password"
                                                        aria-required="true"
                                                        minLength={8}
                                                        maxLength={32}
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

                            {/* Confirm Password with icon and visibility toggle */}
                            <motion.div variants={childVariants as any}>
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel
                                                htmlFor="register-confirm-password"
                                                className="text-[#1e2c50] text-[15.3px] font-semibold mb-1"
                                            >
                                                Confirm Password
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3970D8]">
                                                        <ShieldCheck size={19} />
                                                    </span>
                                                    <Input
                                                        {...field}
                                                        id="register-confirm-password"
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        placeholder="Confirm password"
                                                        autoComplete="new-password"
                                                        aria-label="Confirm Password"
                                                        aria-required="true"
                                                        spellCheck={false}
                                                        className={`h-[44px] rounded-md border border-[#CBD6F1] bg-white text-base font-medium placeholder:text-[#A4B2D5] pr-11 pl-11 focus:ring-2 focus:ring-[#2852B4] focus:border-[#2852B4] transition-colors duration-150 ${form.formState.errors.confirmPassword ? "border-[#e65d15] focus:ring-[#e65d15]" : ""}`}
                                                        disabled={loading}
                                                    />
                                                    <button
                                                        type="button"
                                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                                        className="absolute right-2 top-0 bottom-0 flex items-center"
                                                        tabIndex={-1}
                                                        onClick={() => setShowConfirmPassword((p) => !p)}
                                                        disabled={loading}
                                                    >
                                                        {showConfirmPassword
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

                            {/* Terms and Privacy */}
                            <motion.div className="text-center text-xs text-[#7A88C7] mt-0 mb-2" variants={childVariants as any}>
                                By clicking Sign up, you agree to NAAPE's{" "}
                                <Link href="/terms-of-service" className="text-[#2852B4] font-semibold hover:underline">
                                    Terms of Service
                                </Link>
                                {" "}and{" "}
                                <Link href="/privacy-policy" className="text-[#2852B4] font-semibold hover:underline">
                                    Privacy Policy
                                </Link>
                            </motion.div>

                            {/* Sign Up button */}
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
                                            Signing Up...
                                        </>
                                    ) : (
                                        "Sign up"
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
