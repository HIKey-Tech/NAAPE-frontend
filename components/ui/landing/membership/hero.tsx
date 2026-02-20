"use client"

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users, Shield, TrendingUp } from "lucide-react";

export default function MembershipHeroSection() {
    return (
        <section className="relative w-full min-h-[85vh] flex items-center justify-center bg-slate-50 overflow-hidden py-20 pt-32 md:pt-40 px-6">
            {/* Background grid pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
                backgroundSize: "24px 24px"
            }} />

            <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left: Content */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                >
                    <div>
                        <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">Membership</span>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-6">
                            Welcome, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                                Future Aviation Professional!
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
                            Join NAAPE — Nigeria's premier community of pilots, engineers, and aviation professionals. <span className="text-slate-900 font-bold">Connect</span> with peers, <span className="text-slate-900 font-bold">grow</span> your career, and <span className="text-slate-900 font-bold">advance</span> aviation excellence.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/register" className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-8 py-4 rounded-full text-lg shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all">
                            Become a Member <ArrowRight size={18} />
                        </Link>
                        <Link href="/about/about-us" className="inline-flex items-center gap-2 border-2 border-primary text-primary font-bold px-8 py-4 rounded-full text-lg hover:bg-primary/5 transition-all">
                            Learn More
                        </Link>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <div className="flex -space-x-3">
                            {["/images/people1.jpg", "/images/people2.jpg", "/images/people3.jpg"].map((src, i) => (
                                <Image key={i} src={src} alt="Member" width={40} height={40} className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                            ))}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">1,200+ Members</p>
                            <p className="text-xs text-slate-500">Already a member? <Link href="/login" className="text-primary font-bold hover:underline">Sign in</Link></p>
                        </div>
                    </div>
                </motion.div>

                {/* Right: Image + Cards */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative"
                >
                    <div className="relative aspect-[4/5] max-h-[600px] rounded-3xl overflow-hidden shadow-2xl shadow-slate-300/50 border-4 border-white">
                        <Image
                            src="/images/plane.jpg"
                            alt="Nigerian pilots and engineers"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
                    </div>

                    {/* Floating Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="absolute -left-8 bottom-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
                    >
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Shield className="text-primary" size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">Safety First</p>
                            <p className="text-xs text-slate-500">100% Compliance</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="absolute -right-4 top-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
                    >
                        <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                            <TrendingUp className="text-accent" size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">39+ Years</p>
                            <p className="text-xs text-slate-500">Of Leadership</p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
