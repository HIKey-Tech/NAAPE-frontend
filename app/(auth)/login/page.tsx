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
import loginpic from "@/public/images/loginpic.jpg"
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
            toast("Login Failed", {  description: `${error}` })
        } finally {
            setLoading(false);
        }
    }

    // Placeholder for actual google sign-in
    function handleGoogleSignIn() {
        alert("Google sign-in coming soon");
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#F5F7FA] p-14">
            <div className="flex w-full max-w-full rounded-2xl bg-white shadow-[0_4px_32px_0_rgba(66,88,144,0.10)] overflow-hidden border border-[#E6EAF1]">
                {/* Left: Login form */}
                <div className="flex flex-col flex-1 min-w-[380px] max-w-full px-10 py-[52px] md:px-14 md:py-20 justify-center">
                    {/* Top NAAPE logo */}
                    <div className="flex items-center justify-start mb-2">
                        <Image
                            src={logo}
                            alt="NAAPE logo"
                            width={60}
                            height={45}
                            className="object-contain"
                        />
                    </div>

                    {/* Don't have account link */}
                    <div className="flex justify-end text-[14px] font-normal mb-6">
                        <span className="text-[#817F94]">Don&apos;t have account?</span>
                        <Link
                            href="/register"
                            className="ml-1 text-[#3970D8] font-medium hover:underline"
                        >
                            Register
                        </Link>
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

                {/* Right (image) */}
                <div className="hidden md:block md:w-[53%] h-full relative">
                    <div className="absolute inset-0">
                        <Image
                            src={loginpic}
                            alt="Cockpit"
                            fill
                            style={{
                                objectFit: "cover",
                                objectPosition: "center",
                                opacity: 1,
                            }}
                            sizes="(max-width: 900px) 0vw, 53vw"
                            priority
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}