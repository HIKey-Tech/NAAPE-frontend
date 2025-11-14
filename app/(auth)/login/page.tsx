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
import { useAuthStore } from "@/hook/useAuthStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/axios";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";
import google from "@/public/images/google.png"
import { toast } from "sonner";


const formSchema = z.object({
    email: z.email({ message: "Enter a valid email" }),
    password: z.string().min(6, "Password is required"),
});

export default function LoginPage() {
    const { login } = useAuthStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            const res = await api.post("/auth/login", values);
            login(res.data.user, res.data.token);
            router.push("/dashboard");
            toast("Login Successful", { description: `Explore your dashboard` })

        } catch (error: any) {
            form.setError(
                "email",
                { message: error.response?.data?.message || "Login Failed" }
            );
            toast("Login Failed", { description: `${error}` })
        } finally {
            setLoading(false);
        }
    }

    // Placeholder for actual google sign-in
    function handleGoogleSignIn() {
        alert("Google sign-in coming soon");
    }

    return (
        <main className="min-h-full w-full py-10 px-6 flex items-center justify-center bg-[#f6f7fa]">
            <div className="flex flex-col md:flex-row w-full max-w-6xl h-full shadow-xl rounded-xl bg-white">
                {/* Left: Login form */}
                <div className="w-full md:w-full h-full py-9 px-5 md:px-10 flex flex-col justify-center">
                    {/* Top NAAPE logo */}
                    <div className="flex items-center justify-between mb-6  relative min-h-full w-full">
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
                            <span className="text-xs  right-0 top-0 text-[#817F94]">Don&apos;t have account?</span>
                            <Link
                                href="/register"
                                className="ml-1 text-[#3970D8] font-medium hover:underline"
                            >
                                Register
                            </Link>
                        </div>
                    </div>


                    {/* Welcome / Card */}
                    <div className="">
                        <h1 className="text-[22px] md:text-[24px] leading-[1.16] font-bold text-[#0A1331] mb-1 text-center">
                            Welcome to NAAPE!
                        </h1>
                        <span className="block mb-8 text-[15px] text-[#7F8596] font-normal text-center">
                            Best app for Pilots and Engineers
                        </span>
                    </div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            {/* Google sign in */}
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

                            {/* OR separator */}
                            <div className="flex items-center gap-3 mb-1">
                                <Separator className="flex-1 bg-[#E9EAF0] h-[1.5px]" />
                                <span className="text-xs text-[#7F8596] font-medium mx-1">
                                    OR
                                </span>
                                <Separator className="flex-1 bg-[#E9EAF0] h-[1.5px]" />
                            </div>

                            {/* Email */}
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
                                                placeholder="engineer@naape.ng"
                                                autoComplete="email"
                                                className="h-[42px] rounded-[6px] border border-[#E3E6ED] bg-[#FAFBFE] text-base placeholder:text-[#A6ACC5]"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            {/* Password */}
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
                                                autoComplete="current-password"
                                                className="h-[42px] rounded-[6px] border border-[#E3E6ED] bg-[#FAFBFE] text-base placeholder:text-[#A6ACC5]"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            {/* Forgot password */}
                            <div className="flex justify-end items-center mt-1 mb-4">
                                <Link
                                    href="/forgot-password"
                                    className="text-[#3970D8] text-[14px] font-medium hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Sign In button */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-[44px] mt-1 rounded-[7px] bg-[#2852B4] hover:bg-[#2347A0] text-white text-[16px] font-semibold tracking-wide shadow-none"
                            >
                                {loading ? "Signing In..." : "Sign In"}
                            </Button>
                        </form>
                    </Form>
                </div>

                {/* Right Side Illustration */}
                <div className="bg-transparent  w-full justify-center items-center relative">
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
                </div>
            </div>
        </main>
    );
}