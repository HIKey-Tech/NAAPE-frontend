"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useSearchParams } from "next/navigation";

import MembershipRegisterForm from "@/components/ui/custom/membership.register.form";

import { Suspense } from "react";

function RegisterContent() {
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect");

    const parentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
    };

    const childVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 50 } },
    };

    return (
        <motion.div
            className="flex w-full max-w-5xl my-auto min-h-[700px] shadow-2xl rounded-3xl bg-white overflow-hidden border border-slate-200"
            variants={parentVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Left: Register Form */}
            <motion.div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center relative bg-white">
                <motion.div className="flex items-center justify-between gap-3 mb-6" variants={childVariants}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/5 rounded-xl">
                            <Image src={logo} alt="NAAPE logo" width={40} height={40} className="w-10 h-10" />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-slate-900">NAAPE</span>
                    </div>
                    <Link href="/" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                        Back to home
                    </Link>
                </motion.div>

                <motion.div variants={childVariants} className="mb-4">
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Create Account</h1>
                    <p className="text-slate-500 font-medium text-sm">Join our community of aviation professionals.</p>
                </motion.div>

                <MembershipRegisterForm redirect={redirect} />

                <p className="mt-6 text-center text-sm font-medium text-slate-500">
                    Already have an account? <Link href={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login"} className="text-primary font-bold hover:underline">Sign in</Link>
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
    );
}

export default function RegisterPage() {
    return (
        <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 py-24 md:p-8 bg-[#f8fafc]">
            <Suspense fallback={
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-lg font-bold text-slate-800">Loading registration...</p>
                </div>
            }>
                <RegisterContent />
            </Suspense>
        </main>
    );
}
