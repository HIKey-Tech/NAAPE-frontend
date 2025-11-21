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
import { motion } from "framer-motion";

import { Eye, EyeOff, User, Mail, Lock, ShieldCheck } from "lucide-react";

/**
 * implement this @useMembers.ts (8-17) here:
 * Exposes: useMembers() - which returns { members }
 * where members is an array of member objects, each with properties:
 *   name: string, avatarUrl: string, testimonial: string, role: string
 * Example:
 *   [
 *     { name: "Lottana Chika", avatarUrl: "/images/avatar-female.jpg", testimonial: "...", role: "Member, NAAPE" },
 *     { name: "...", ... }
 *   ]
 */
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
            // Additional member samples could go here
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
    const [showConfirm, setShowConfirm] = useState(false);

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
                        {error?.response?.data?.message ?? "An unexpected error occurred. Please try again."}
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
        <main className="min-h-full w-full py-10 flex items-center justify-center bg-[#f6f7fa]">
            <motion.div
                className="flex flex-col md:flex-row w-full max-w-6xl h-full shadow-xl rounded-xl bg-white"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
            >
                {/* Left (Form) */}
                <motion.div
                    className="w-full md:w-full h-full py-9 px-5 md:px-10 flex flex-col justify-center"
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.85, delay: 0.1, ease: "easeOut" }}
                >
                    {/* Logo and Login CTA */}
                    <motion.div
                        className="flex items-center justify-between mb-4 relative min-h-full w-full"
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                    >
                        <Image
                            src={logo}
                            alt="NAAPE Logo"
                            width={40}
                            height={40}
                            className="rounded"
                            priority
                        />
                        <span className="text-xs absolute right-0 top-0">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="text-[#2852B4] font-medium hover:underline ml-1"
                            >
                                Login
                            </Link>
                        </span>
                    </motion.div>
                    {/* Heading & subtitle */}
                    <motion.h1
                        className="text-2xl text-center font-semibold mt-2 mb-1"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                    >
                        Welcome to NAAPE!
                    </motion.h1>
                    <motion.p
                        className="text-center text-[15px] text-[#5a6472] mb-5 leading-5"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.33, ease: "easeOut" }}
                    >
                        Join the National Association of <br />
                        <span className="text-blue-700 font-medium">
                            Aircraft Pilots and Engineers
                        </span>
                    </motion.p>

                    {/* Google signup */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.38, ease: "easeOut" }}
                    >
                        <NaapButton
                            fullWidth
                            variant="ghost"
                            className="mb-3"
                            icon={
                                <Image
                                    src={google}
                                    alt="Google"
                                    width={20}
                                    height={20}
                                    className="mr-1"
                                    priority
                                />
                            }
                            iconPosition="left"
                            disabled={loading}
                            onClick={() => {
                                toast.info("Google signup is coming soon!");
                            }}
                        >
                            <span className="w-full font-medium text-gray-700">Sign up with Google</span>
                        </NaapButton>
                    </motion.div>

                    {/* OR separator */}
                    <motion.div
                        className="flex items-center mb-4"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.41, ease: "easeOut" }}
                    >
                        <Separator className="flex-1" />
                        <span className="mx-3 text-xs text-gray-400 font-semibold">OR</span>
                        <Separator className="flex-1" />
                    </motion.div>

                    {/* Signup Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.5, ease: "easeOut" }}
                    >
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="flex flex-col gap-3"
                                autoComplete="off"
                            >
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#586078] text-[15px] font-medium mb-1">
                                                Full Name
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                        <User size={18} />
                                                    </span>
                                                    <Input
                                                        {...field}
                                                        type="text"
                                                        placeholder="Enter your full name"
                                                        autoComplete="name"
                                                        className="h-[42px] rounded-[6px] border border-[#E3E6ED] bg-[#FAFBFE] text-base placeholder:text-[#A6ACC5] transition focus:border-blue-500 pl-10"
                                                        maxLength={48}
                                                        disabled={loading}
                                                        spellCheck={false}
                                                        autoFocus
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#586078] text-[15px] font-medium mb-1">
                                                Email
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                        <Mail size={18} />
                                                    </span>
                                                    <Input
                                                        {...field}
                                                        type="email"
                                                        placeholder="you@email.com"
                                                        autoComplete="email"
                                                        inputMode="email"
                                                        className="h-[42px] rounded-[6px] border border-[#E3E6ED] bg-[#FAFBFE] text-base placeholder:text-[#A6ACC5] transition focus:border-blue-500 pl-10"
                                                        disabled={loading}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#586078] text-[15px] font-medium mb-1 flex items-center gap-1">
                                                Password
                                                <span className="ml-1 text-xs text-gray-400 font-normal">(8+ chars, upper, lower, number)</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                        <Lock size={18} />
                                                    </span>
                                                    <Input
                                                        {...field}
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Create a password"
                                                        autoComplete="new-password"
                                                        className="h-[42px] rounded-[6px] border border-[#E3E6ED] bg-[#FAFBFE] text-base placeholder:text-[#A6ACC5] pr-10 pl-10 transition focus:border-blue-500"
                                                        minLength={8}
                                                        maxLength={32}
                                                        disabled={loading}
                                                    />
                                                    <button
                                                        type="button"
                                                        tabIndex={-1}
                                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                                        className="absolute right-2 top-2 text-gray-400 hover:text-blue-600 p-1 rounded focus:outline-none"
                                                        onClick={() => setShowPassword((v) => !v)}
                                                        disabled={loading}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff size={18} />
                                                        ) : (
                                                            <Eye size={18} />
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#586078] text-[15px] font-medium mb-1 flex items-center gap-1">
                                                Confirm Password
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                        <ShieldCheck size={18} />
                                                    </span>
                                                    <Input
                                                        {...field}
                                                        type="password"
                                                        placeholder="Confirm password"
                                                        autoComplete="new-password"
                                                        className="h-[42px] rounded-[6px] border border-[#E3E6ED] bg-[#FAFBFE] text-base placeholder:text-[#A6ACC5] pl-10"
                                                        disabled={loading}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <NaapButton
                                    type="submit"
                                    fullWidth
                                    variant="primary"
                                    loading={loading}
                                    loadingText="Signing up..."
                                    className="mt-2"
                                >
                                    Sign up
                                </NaapButton>
                                <div className="text-center text-xs text-muted-foreground mt-2">
                                    By clicking Sign up, you agree to NAAPE's{" "}
                                    <Link href="/terms" className="text-[#3970D8] hover:underline">
                                        Terms of Service
                                    </Link>
                                    {" "}and{" "}
                                    <Link href="/privacy" className="text-[#3970D8] hover:underline">
                                        Privacy Policy
                                    </Link>
                                </div>
                            </form>
                        </Form>
                    </motion.div>
                </motion.div>
                {/* Right Side Illustration */}
                <motion.div
                    className="bg-transparent w-full justify-center items-center relative"
                    initial={{ opacity: 0, x: 80 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.9, delay: 0.22, ease: "easeOut" }}
                >
                    <motion.div
                        className="rounded-2xl shadow-xl border border-[#E6EAF1] w-full h-full bg-black items-center justify-center relative overflow-hidden"
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
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.52 }}
                        >
                            <Image
                                src="/images/plane.jpg"
                                className="w-full h-full object-cover"
                                alt="Cockpit interior with a panoramic view"
                                width={440}
                                height={440}
                                style={{
                                    objectPosition: "center",
                                    transition: "opacity 0.7s ease",
                                    opacity: 0.98,
                                    filter: "brightness(0.92) saturate(1.05)",
                                    borderTopRightRadius: "16px",
                                    borderBottomRightRadius: "16px",
                                }}
                                priority
                            />
                        </motion.div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A173550] via-transparent to-transparent h-32 rounded-b-[16px] pointer-events-none z-10" />
                        {/* Testimonial Card */}
                        {/* Use members from useMembers */}
                        {members && members.length > 0 && (
                          <motion.div
                              className="absolute bottom-6 left-6 right-6 bg-white/95 rounded-lg p-4 shadow-lg flex flex-col gap-2 max-w-[364px] z-20"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
                          >
                              <blockquote className="text-[14px] font-medium text-[#193853] italic opacity-90">
                                &quot;{members[0].testimonial}&quot;
                              </blockquote>
                              <div className="flex items-center gap-2 mt-1">
                                  <div className="h-8 w-8 rounded-full overflow-hidden bg-[#eeeeee] flex items-center justify-center">
                                      <Image
                                          src={members[0].avatarUrl}
                                          alt="Member profile"
                                          width={32}
                                          height={32}
                                          className="object-cover"
                                          priority
                                      />
                                  </div>
                                  <div className="flex flex-col">
                                      <span className="font-semibold text-xs text-[#2852B4] leading-none">
                                          {members[0].name}
                                      </span>
                                      <span className="text-xs text-[#5a6472] leading-none">
                                          {members[0].role}
                                      </span>
                                  </div>
                              </div>
                          </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            </motion.div>
        </main>
    );
}
