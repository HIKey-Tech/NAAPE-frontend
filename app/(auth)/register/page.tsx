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

const signupSchema = z
    .object({
        name: z.string().min(1, "Full Name is required"),
        email: z.email("Enter a valid email"),
        password: z.string().min(6, "Password must be at least 6 characters"),
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
            toast.success("Registration Successful", {
                description: "Welcome! Please log in.",
            });
            router.push("/login");
        } catch (error: any) {
            toast.error("Registration Failed", {
                description:
                    error?.response?.data?.message ?? "Please try again.",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-full w-full py-10 flex items-center justify-center bg-[#f6f7fa]">
            <div className="flex flex-col md:flex-row w-full max-w-6xl h-full shadow-xl rounded-xl bg-white ">
                {/* Left (Form) */}
                <div className="w-full md:w-full h-full py-9 px-5 md:px-10 flex flex-col justify-center">
                    {/* Logo and Login CTA */}
                    <div className="flex items-center justify-between mb-4 relative min-h-full w-full">
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
                    </div>
                    {/* Heading & subtitle */}
                    <h1 className="text-2xl text-center font-semibold mt-2 mb-1">
                        Welcome to NAAPE!
                    </h1>
                    <p className="text-center text-[15px] text-[#5a6472] mb-5 leading-5">
                        Join the National Association of <br />
                        <span className="text-blue-700 font-medium">
                            Aircraft Pilots and Engineers
                        </span>
                    </p>

                    {/* Google signup */}
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

                    {/* OR separator */}
                    <div className="flex items-center mb-4">
                        <Separator className="flex-1" />
                        <span className="mx-3 text-xs text-gray-400 font-semibold">OR</span>
                        <Separator className="flex-1" />
                    </div>

                    {/* Signup Form */}
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
                                            <Input
                                                {...field}
                                                type="text"
                                                placeholder="Enter your name"
                                                autoComplete="name"
                                                className="h-[42px] rounded-[6px] border border-[#E3E6ED] bg-[#FAFBFE] text-base placeholder:text-[#A6ACC5]"
                                                disabled={loading}
                                            />
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
                                            <Input
                                                {...field}
                                                type="email"
                                                placeholder="Enter your email"
                                                autoComplete="email"
                                                className="h-[42px] rounded-[6px] border border-[#E3E6ED] bg-[#FAFBFE] text-base placeholder:text-[#A6ACC5]"
                                                disabled={loading}
                                            />
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
                                        <FormLabel className="text-[#586078] text-[15px] font-medium mb-1">
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="password"
                                                placeholder="Password"
                                                autoComplete="new-password"
                                                className="h-[42px] rounded-[6px] border border-[#E3E6ED] bg-[#FAFBFE] text-base placeholder:text-[#A6ACC5]"
                                                disabled={loading}
                                            />
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
                                        <FormLabel className="text-[#586078] text-[15px] font-medium mb-1">
                                            Confirm Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="password"
                                                placeholder="Confirm password"
                                                autoComplete="new-password"
                                                className="h-[42px] rounded-[6px] border border-[#E3E6ED] bg-[#FAFBFE] text-base placeholder:text-[#A6ACC5]"
                                                disabled={loading}
                                            />
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
                </div>
                {/* Right Side Illustration */}
                <div className="bg-transparent  w-full justify-center items-center relative">
                    <div className="rounded-2xl shadow-xl border border-[#E6EAF1]  w-full h-full bg-black items-center justify-center">
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
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A173550] via-transparent to-transparent h-32 rounded-b-[16px] pointer-events-none" />
                        {/* Testimonial Card */}
                        <div className="absolute bottom-6 left-6 right-6 bg-white/95 rounded-lg p-4 shadow-lg flex flex-col gap-2 max-w-[364px]">
                            <blockquote className="text-[14px] font-medium text-[#193853] italic opacity-90">
                                &quot;With NAAPE, your customer relationship can be as enjoyable as your product.
                                When it&#39;s this easy, customers keep on coming back.&quot;
                            </blockquote>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="h-8 w-8 rounded-full overflow-hidden bg-[#eeeeee] flex items-center justify-center">
                                    <Image
                                        src="/images/avatar-female.jpg"
                                        alt="Member profile"
                                        width={32}
                                        height={32}
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-xs text-[#2852B4] leading-none">
                                        Lottana Chika
                                    </span>
                                    <span className="text-xs text-[#5a6472] leading-none">
                                        Member, NAAPE
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
