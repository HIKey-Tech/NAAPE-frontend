"use client";

import { CheckCircle, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import MembershipRegisterForm from "@/components/ui/custom/membership.register.form";

const steps = [
    { text: "Register with NAAPE", icon: <CheckCircle size={18} className="text-primary" /> },
    { text: "Complete the Account Setup", icon: <CheckCircle size={18} className="text-primary" /> },
    { text: "Update your Profile inside Dashboard", icon: <CheckCircle size={18} className="text-primary" /> },
    { text: "Receive final approval", icon: <CheckCircle size={18} className="text-primary" /> },
];

function HowToBecomeMember() {
    return (
        <section className="py-24 px-6 md:px-12 bg-white w-full">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-10"
                >
                    <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-2 block">Membership Process</span>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
                        How to Become a <span className="text-primary">Member</span>
                    </h2>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed">
                        Apply to join NAAPE and gain access to a professional network, member resources, and representation in your field.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="mb-10 space-y-3">
                    {steps.map((step, idx) => (
                        <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl ${idx === 0 ? "bg-primary/5 border border-primary/10 flex-col items-start gap-1" : "bg-slate-50 border border-slate-100"}`}>
                            <div className="flex gap-2 items-center">
                                {step.icon}
                                <span className={`font-medium text-sm ${idx === 0 ? "text-primary font-bold" : "text-slate-600"}`}>{step.text}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Form Card */}
                <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden">
                    <CardContent className="p-8 md:p-10">
                        <div className="flex items-center gap-3 mb-6">
                            <FileText size={24} className="text-primary" />
                            <h3 className="text-2xl font-bold text-slate-900">NAAPE Membership Form</h3>
                        </div>
                        <p className="text-sm text-slate-500 mb-6 font-medium">Create your account below. You will be prompted to update your full information in your profile settings later.</p>

                        <MembershipRegisterForm />
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}

export default HowToBecomeMember;
