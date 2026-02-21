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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, User, Mail, Lock, ShieldCheck, ArrowRight, ArrowLeft, Phone, MapPin } from "lucide-react";

// The form schema validation
const step1Schema = z.object({
    name: z.string().min(2, "Full Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    tel: z.string().min(8, "Phone number is required"),
    address: z.string().min(5, "Address is required"),
    password: z.string().min(8, "Password must be at least 8 characters").regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

const step2Schema = z.object({
    designation: z.string().optional(),
    dateOfEmployment: z.string().optional(),
    section: z.string().optional(),
    qualification: z.string().optional(),
    licenseNo: z.string().optional(),
    employer: z.string().optional(),
    rank: z.string().optional(),
    signature: z.string().min(2, "Signature is required"),
    date: z.string().min(1, "Date is required"),
});

const formSchema = step1Schema.and(step2Schema);

export default function MembershipRegisterForm({ redirect }: { redirect?: string | null }) {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "", email: "", tel: "", address: "",
            password: "", confirmPassword: "",
            designation: "", dateOfEmployment: "", section: "", qualification: "",
            licenseNo: "", employer: "", rank: "", signature: "", date: ""
        },
        mode: "onBlur",
    });

    const triggerValidationForStep1 = async () => {
        const isValid = await form.trigger(["name", "email", "tel", "address", "password", "confirmPassword"]);
        if (isValid) {
            setStep((prev) => prev + 1);
        }
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            // 1. Create account auth details with profile mapping
            await api.post("/auth/register", {
                name: values.name.trim(),
                email: values.email.trim(),
                password: values.password,
                profile: {
                    phone: values.tel.trim(),
                    specialization: values.designation || undefined,
                    organization: values.employer || undefined,
                },
                professional: {
                    licenseNumber: values.licenseNo || undefined,
                    certifications: values.qualification ? [values.qualification] : undefined,
                }
            });

            toast.success("Account created successfully! Please sign in.");
            if (redirect) {
                router.replace(`/login?redirect=${encodeURIComponent(redirect)}`);
            } else {
                router.replace("/login");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.response?.data?.error || "Registration failed");
        } finally {
            setLoading(false);
        }
    }

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 50 : -50,
            opacity: 0
        })
    };

    return (
        <div className="w-full">
            {/* Step indicator */}
            <div className="flex justify-between mb-8 items-center bg-slate-50 p-2 rounded-2xl relative">
                <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-200 -translate-y-1/2 rounded" />
                <div
                    className="absolute top-1/2 left-4 h-1 bg-primary -translate-y-1/2 rounded transition-all duration-500 ease-in-out"
                    style={{ width: step === 1 ? '0%' : '100%' }}
                />

                <div className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm transition-colors ${step >= 1 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}>
                    1
                </div>
                <div className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm transition-colors ${step >= 2 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}>
                    2
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 overflow-hidden relative flex flex-col items-start w-full">
                    <AnimatePresence custom={step === 1 ? -1 : 1} mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                custom={-1}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="space-y-4 w-full"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <FormField name="name" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700 text-sm">Full Name *</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                    <Input {...field} className="pl-9 h-11 text-sm bg-slate-50 border-slate-200" placeholder="John Doe" />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )} />

                                    <FormField name="email" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700 text-sm">Email *</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                    <Input {...field} className="pl-9 h-11 text-sm bg-slate-50 border-slate-200" placeholder="you@example.com" />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <FormField name="tel" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700 text-sm">Phone Number *</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                    <Input {...field} className="pl-9 h-11 text-sm bg-slate-50 border-slate-200" placeholder="+234..." />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )} />

                                    <FormField name="address" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700 text-sm">Address *</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                    <Input {...field} className="pl-9 h-11 text-sm bg-slate-50 border-slate-200" placeholder="Address" />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <FormField name="password" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700 text-sm">Password *</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                    <Input {...field} type={showPassword ? "text" : "password"} className="pl-9 pr-9 h-11 text-sm bg-slate-50 border-slate-200" placeholder="Password" />
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )} />

                                    <FormField name="confirmPassword" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700 text-sm">Confirm *</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                    <Input {...field} type={showConfirmPassword ? "text" : "password"} className="pl-9 pr-9 h-11 text-sm bg-slate-50 border-slate-200" placeholder="Confirm" />
                                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )} />
                                </div>

                                <div className="pt-2 mt-4">
                                    <Button type="button" onClick={triggerValidationForStep1} className="w-full h-11 bg-primary hover:bg-blue-700 text-white font-bold rounded-xl text-md shadow transition-all flex items-center justify-center gap-2">
                                        Next (Professional Details) <ArrowRight size={16} />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                custom={1}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="space-y-4 w-full"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <FormField name="employer" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700 text-sm">Employer</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="h-11 text-sm bg-slate-50 border-slate-200" placeholder="Company" />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )} />

                                    <FormField name="rank" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700 text-sm">Rank</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="h-11 text-sm bg-slate-50 border-slate-200" placeholder="F/O, Capt" />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )} />

                                    <FormField name="designation" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700 text-sm">Designation</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="h-11 text-sm bg-slate-50 border-slate-200" placeholder="Title" />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )} />

                                    <FormField name="section" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700 text-sm">Section</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="h-11 text-sm bg-slate-50 border-slate-200" placeholder="Dept" />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )} />

                                    <FormField name="qualification" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700 text-sm">Qualification</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="h-11 text-sm bg-slate-50 border-slate-200" placeholder="Certs" />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )} />

                                    <FormField name="licenseNo" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700 text-sm">License No.</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="h-11 text-sm bg-slate-50 border-slate-200" placeholder="If applicable" />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )} />
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    <FormField name="dateOfEmployment" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700 text-sm">Date of Employment</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="date" className="h-11 text-sm bg-slate-50 border-slate-200" />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )} />
                                </div>

                                <div className="border border-slate-200 bg-slate-50 p-4 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                    <FormField name="signature" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700 text-sm">Signature (Name) *</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="h-11 text-sm bg-white border-slate-200" placeholder="Full name" />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )} />

                                    <FormField name="date" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700 text-sm">Date *</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="date" className="h-11 text-sm bg-white border-slate-200" />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )} />
                                </div>

                                <div className="pt-2 flex gap-4 mt-6 w-full">
                                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-1/3 h-11 rounded-xl font-bold flex items-center justify-center gap-2">
                                        <ArrowLeft size={16} /> Back
                                    </Button>
                                    <Button type="submit" disabled={loading} className="w-2/3 h-11 bg-primary hover:bg-blue-700 text-white font-bold rounded-xl text-md shadow transition-all">
                                        {loading ? "Creating..." : "Submit"}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </Form>
        </div>
    );
}
