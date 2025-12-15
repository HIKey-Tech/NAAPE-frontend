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
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { NaapButton } from "@/components/ui/custom/button.naap";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/axios";
import logo from "@/public/logo.png";
import google from "@/public/images/google.png";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { Eye, EyeOff, User, Mail, Lock, ShieldCheck } from "lucide-react";

function useMembers() {
    // In reality, you might fetch this, but here it's hardcoded as per instructions
    return {
        members: [
            {
                name: "Lottana Chika",
                avatarUrl: "/images/leader.png",
                testimonial:
                    'With NAAPE, your customer relationship can be as enjoyable as your product. When it\'s this easy, customers keep on coming back.',
                role: "Member, NAAPE",
            },
        ],
    };
}

const signupSchema = z
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
            .email("Enter a valid email")
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

type SignupFormValues = z.infer<typeof signupSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { members } = useMembers();

    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        }
    });

    async function onSubmit(values: SignupFormValues) {
        setLoading(true);
        try {
            await api.post("/auth/register", {
                name: values.name.trim(),
                email: values.email.trim(),
                password: values.password,
            });
            toast.success(
                <div>
                    <div className="font-semibold">Registration Successful 🎉</div>
                    <div className="text-sm mt-1">Welcome to NAAPE!</div>
                </div>,
                {
                    duration: 4000,
                    position: "top-center",
                    icon: "👏",
                    className: "bg-green-50 border border-green-200 text-green-700"
                }
            );
            router.push("/dashboard");
        } catch (error: any) {
            toast.error(
                <div>
                    <div className="font-semibold">Registration Failed</div>
                    <div className="text-sm mt-1">
                        {error?.response?.data?.message ?? "Registration Failed."}
                    </div>
                </div>,
                {
                    duration: 5000,
                    position: "top-center",
                    icon: "❌",
                    className: "bg-red-50 border border-red-200 text-red-700"
                }
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-full w-full py-10 flex items-center justify-center bg-[#EDF1F9]">
            <motion.div
                className="flex flex-col md:flex-row w-full max-w-6xl h-full rounded-2xl bg-white border-2 border-[#123976] overflow-hidden"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                style={{ boxShadow: "none" }}
            >
                {/* Left (Form) */}
                <motion.div
                    className="w-full md:w-full h-full py-14 px-6 md:px-16 flex flex-col justify-center border-0 md:border-r-2 border-[#DBE5F8] bg-white"
                    initial={{ opacity: 0, x: -38 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.85, delay: 0.1, ease: "easeOut" }}
                >
                    {/* Logo and Login CTA */}
                    <motion.div
                        className="flex items-center justify-between mb-9 relative min-h-full w-full"
                        initial={{ opacity: 0, y: -14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                    >
                        <motion.div
                            initial={{ rotate: -12, scale: 0.88 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.27, type: "spring" }}
                        >
                            <Image
                                src={logo}
                                alt="NAAPE Logo"
                                width={52}
                                height={52}
                                className="rounded border-2 border-[#174ee7] bg-white transition-all"
                                priority
                            />
                        </motion.div>
                        <span className="text-sm absolute right-0 top-0 font-medium text-[#5680cb] bg-[#f0f4fe] rounded px-3 py-1 border border-[#d8e5fa]">
                            Already a member?{" "}
                            <Link
                                href="/login"
                                className="text-[#103176] font-extrabold underline underline-offset-2 hover:text-[#174ee7] ml-1 transition-all"
                            >
                                Login
                            </Link>
                        </span>
                    </motion.div>
                    {/* Heading & subtitle */}
                    <motion.h1
                        className="text-[2.2rem] text-center font-black text-[#133574] mb-1 mt-7 tracking-tight leading-tight uppercase"
                        initial={{ opacity: 0, y: 8, scale: 1.04 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.33, ease: "easeOut" }}
                        style={{
                            letterSpacing: "0.01em",
                            textShadow: "0 2px 0 #f0f4fe",
                        }}
                    >
                        Join NAAPE
                    </motion.h1>
                    <motion.p
                        className="text-center text-base md:text-lg font-medium leading-6 mt-2 mb-8 text-[#385ecb]"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.37, ease: "easeOut" }}
                    >
                        <span className="block font-bold text-[#1a3482] mb-1 text-lg md:text-xl uppercase tracking-wide">National Association of Aircraft Pilots & Engineers</span>
                        <span className="block text-[#4b689d] font-medium tracking-wide">
                            The home of aviation professionals in Nigeria
                        </span>
                    </motion.p>

                    {/* Google signup */}
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.41, ease: "easeOut" }}
                    >
                        <NaapButton
                            fullWidth
                            className="mb-5 border-2 border-[#174ee7] hover:bg-[#174ee7]/10 focus:bg-[#174ee7]/15 transition font-extrabold text-[#174ee7] rounded-lg"
                            icon={
                                <motion.span
                                    whileHover={{ scale: 1.13, rotate: -8 }}
                                    whileTap={{ scale: 0.95, rotate: 4 }}
                                    className="mr-1"
                                >
                                    <Image
                                        src={google}
                                        alt="Google"
                                        width={20}
                                        height={20}
                                        priority
                                    />
                                </motion.span>
                            }
                            iconPosition="left"
                            disabled={loading}
                            onClick={() => {
                                toast.info("Google signup is coming soon!");
                            }}
                        >
                            <span className="w-full font-bold text-[#174ee7]">Sign up with Google</span>
                        </NaapButton>
                    </motion.div>

                    {/* OR separator */}
                    <motion.div
                        className="flex items-center mb-6 mt-1"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.35, delay: 0.44, ease: "easeOut" }}
                    >
                        <Separator className="flex-1 bg-[#cee5fb]" />
                        <span className="mx-4 text-xs text-[#174ee7] font-black uppercase tracking-widest">
                            OR
                        </span>
                        <Separator className="flex-1 bg-[#cee5fb]" />
                    </motion.div>

                    {/* Signup Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.68, delay: 0.52, ease: "easeOut" }}
                        className="pt-2"
                    >
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="flex flex-col gap-4"
                                autoComplete="off"
                            >
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#123976] text-base font-bold mb-1 tracking-wide">
                                                Full Name
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <motion.span
                                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#174ee7]"
                                                        initial={false}
                                                        whileFocus={{ scale: 1.32, color: "#0b1854" }}
                                                    >
                                                        <User size={19} />
                                                    </motion.span>
                                                    <Input
                                                        {...field}
                                                        type="text"
                                                        placeholder="Enter your full name"
                                                        autoComplete="name"
                                                        className="h-[46px] rounded-lg border-2 border-[#C3D0F5] bg-[#F6FAFF] text-base placeholder:text-[#a2badf] focus:border-[#174ee7] pl-10 font-semibold text-[#18346A] ring-0 transition-colors"
                                                        maxLength={48}
                                                        disabled={loading}
                                                        spellCheck={false}
                                                        autoFocus
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs font-semibold text-[#dc2c34] mt-1" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#123976] text-base font-bold mb-1 tracking-wide">
                                                Email Address
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <motion.span
                                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#174ee7]"
                                                        initial={false}
                                                        whileFocus={{ scale: 1.32, color: "#0b1854" }}
                                                    >
                                                        <Mail size={19} />
                                                    </motion.span>
                                                    <Input
                                                        {...field}
                                                        type="email"
                                                        placeholder="your@email.com"
                                                        autoComplete="email"
                                                        inputMode="email"
                                                        className="h-[46px] rounded-lg border-2 border-[#C3D0F5] bg-[#F6FAFF] text-base placeholder:text-[#a2badf] focus:border-[#174ee7] pl-10 font-semibold text-[#18346A] ring-0 transition-colors"
                                                        disabled={loading}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs font-semibold text-[#dc2c34] mt-1" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#123976] text-base font-bold mb-1 flex items-center gap-2">
                                                Password
                                                <span className="ml-2 text-xs text-[#7fa1ec] font-medium">(minimum 8 characters, upper &amp; lower-case, number)</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <motion.span
                                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#174ee7]"
                                                        initial={false}
                                                        whileFocus={{ scale: 1.32, color: "#174ee7" }}
                                                    >
                                                        <Lock size={19} />
                                                    </motion.span>
                                                    <Input
                                                        {...field}
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Create a password"
                                                        autoComplete="new-password"
                                                        className="h-[46px] rounded-lg border-2 border-[#C3D0F5] bg-[#F6FAFF] text-base placeholder:text-[#a2badf] focus:border-[#174ee7] pr-10 pl-10 font-semibold text-[#18346A] ring-0 transition-colors"
                                                        minLength={8}
                                                        maxLength={32}
                                                        disabled={loading}
                                                    />
                                                    <motion.button
                                                        type="button"
                                                        tabIndex={-1}
                                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                                        className="absolute right-2 top-2 text-[#7fa1ec] hover:text-[#174ee7] p-1 rounded focus:outline-none duration-150"
                                                        whileHover={{ scale: 1.13, color: "#103176" }}
                                                        onClick={() => setShowPassword((v) => !v)}
                                                        disabled={loading}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff size={19} />
                                                        ) : (
                                                            <Eye size={19} />
                                                        )}
                                                    </motion.button>
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs font-semibold text-[#dc2c34] mt-1" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#123976] text-base font-bold mb-1 flex items-center gap-1">
                                                Confirm Password
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <motion.span
                                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#174ee7]"
                                                        initial={false}
                                                        whileFocus={{ scale: 1.16, color: "#103176" }}
                                                    >
                                                        <ShieldCheck size={19} />
                                                    </motion.span>
                                                    <Input
                                                        {...field}
                                                        type="password"
                                                        placeholder="Confirm password"
                                                        autoComplete="new-password"
                                                        className="h-[46px] rounded-lg border-2 border-[#C3D0F5] bg-[#F6FAFF] text-base placeholder:text-[#a2badf] focus:border-[#174ee7] pl-10 font-semibold text-[#18346A] ring-0 transition-colors"
                                                        disabled={loading}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs font-semibold text-[#dc2c34] mt-1" />
                                        </FormItem>
                                    )}
                                />
                                <NaapButton
                                    type="submit"
                                    fullWidth
                                    variant="primary"
                                    loading={loading}
                                    loadingText="Signing up..."
                                    className="mt-4 py-3 text-lg rounded-lg bg-gradient-to-b from-[#174ee7] to-[#123976] hover:from-[#123976] hover:to-[#174ee7] duration-200 font-extrabold border-2 border-[#103176] text-white transition-all shadow-none"
                                >
                                    <motion.span
                                        initial={false}
                                        whileHover={{ scale: 1.032, letterSpacing: "0.06em" }}
                                        whileTap={{ scale: 0.97 }}
                                        className="flex items-center justify-center gap-2"
                                    >
                                        <svg width={24} height={24} fill="none" className="inline mr-1" aria-hidden focusable="false">
                                            <circle cx={12} cy={12} r={12} fill="#fff" fillOpacity={0.09}/>
                                            <path d="M6.8 12.5l2.75 2.7 6-6.2" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Sign up
                                    </motion.span>
                                </NaapButton>
                                <div className="text-center text-xs text-[#8ea6da] mt-3 font-medium leading-tight pt-2">
                                    By clicking <span className="font-bold text-[#123976]">Sign up</span>, you agree to NAAPE's{" "}
                                    <Link href="/terms-of-service" className="text-[#174ee7] font-bold underline underline-offset-2 hover:text-[#123976]">
                                        Terms of Service
                                    </Link>
                                    {" "}and{" "}
                                    <Link href="/privacy-policy" className="text-[#174ee7] font-bold underline underline-offset-2 hover:text-[#123976]">
                                        Privacy Policy
                                    </Link>
                                </div>
                            </form>
                        </Form>
                    </motion.div>
                </motion.div>

                {/* Right Side Illustration */}
                <motion.div
                    className="bg-[#123976] w-full flex justify-center items-center relative rounded-r-2xl overflow-hidden"
                    initial={{ opacity: 0, x: 80 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.9, delay: 0.22, ease: "easeOut" }}
                >
                    <motion.div
                        className="rounded-2xl border-0 w-full h-full flex items-center justify-center relative overflow-hidden"
                        initial={{ scale: 0.97, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
                    >
                        <motion.div
                            style={{
                                height: "100%",
                                width: "100%",
                                position: "absolute",
                                top: 0,
                                left: 0,
                                zIndex: 1,
                            }}
                            initial={{ opacity: 0, scale: 1.02 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.52 }}
                        >
                            <Image
                                src="/images/plane.jpg"
                                className="w-full h-full object-cover object-center grayscale-[12%] contrast-105"
                                alt="Cockpit interior with a panoramic view"
                                width={470}
                                height={470}
                                style={{
                                    transition: "opacity 0.8s, filter 0.3s",
                                    opacity: 0.88,
                                    filter: "brightness(0.77) saturate(1.18) contrast(1.08)",
                                    borderTopRightRadius: "16px",
                                    borderBottomRightRadius: "16px",
                                    borderLeft: "6px solid #174ee7"
                                }}
                                priority
                            />
                        </motion.div>
                        {/* No gradient - use a crisp border instead for separation */}
                        {/* Testimonial Card */}
                        {members && members.length > 0 && (
                            <AnimatePresence>
                                <motion.div
                                    className="absolute bottom-10 left-14 right-10 bg-[#f6f6fb] rounded-xl p-5 pt-6 flex flex-col gap-2 max-w-[380px] z-20 border-2 border-[#174ee7]"
                                    initial={{ opacity: 0, y: 18, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 14, scale: 0.97 }}
                                    transition={{ duration: 0.63, delay: 0.7, ease: "easeOut" }}
                                >
                                    <blockquote className="text-[#1a308c] text-[15.5px] font-bold italic leading-[1.68] mb-2">
                                        <motion.span
                                            initial={false}
                                            whileHover={{ color: "#174ee7", scale: 1.045 }}
                                        >
                                            &quot;{members[0].testimonial}&quot;
                                        </motion.span>
                                    </blockquote>
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="h-10 w-10 rounded-full overflow-hidden bg-[#e3e8f5] flex items-center justify-center border-2 border-[#174ee7]">
                                            <motion.div
                                                initial={{ scale: 0.93 }}
                                                animate={{ scale: 1 }}
                                                whileHover={{ scale: 1.13, rotate: -6 }}
                                                transition={{ type: "spring", stiffness: 210 }}
                                            >
                                                <Image
                                                    src={members[0].avatarUrl}
                                                    alt="Member profile"
                                                    width={38}
                                                    height={38}
                                                    className="object-cover"
                                                    priority
                                                />
                                            </motion.div>
                                        </div>
                                        <div className="flex flex-col pl-2">
                                            <span className="font-extrabold text-sm text-[#174ee7] leading-tight">
                                                {members[0].name}
                                            </span>
                                            <span className="text-xs text-[#395671] font-semibold leading-tight">
                                                {members[0].role}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        )}
                        {/* Bottom border to reinforce strong separation */}
                        <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#174ee7] z-30 rounded-b-xl" />
                    </motion.div>
                </motion.div>
            </motion.div>
        </main>
    );
}
