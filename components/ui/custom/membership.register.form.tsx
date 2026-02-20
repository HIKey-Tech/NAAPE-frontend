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

export default function MembershipRegisterForm() {
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

            // 2. Submit the complex membership record
            await api.post("/membership", {
                name: values.name.trim(),
                email: values.email.trim(),
                tel: values.tel.trim(),
                address: values.address.trim(),
                designation: values.designation,
                dateOfEmployment: values.dateOfEmployment ? new Date(values.dateOfEmployment) : undefined,
                section: values.section,
                qualification: values.qualification,
                licenseNo: values.licenseNo,
                employer: values.employer,
                rank: values.rank,
                signature: values.signature.trim(),
                date: new Date(values.date)
            });

            toast.success("Account created successfully! Please sign in.");
            router.replace("/login");
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 overflow-hidden relative min-h-[500px] flex items-start">
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
                                className="space-y-4 absolute w-full"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField name="name" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700">Full Name *</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                    <Input {...field} className="pl-10 h-11 bg-slate-50 border-slate-200" placeholder="John Doe" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField name="email" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700">Email *</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                    <Input {...field} className="pl-10 h-11 bg-slate-50 border-slate-200" placeholder="you@example.com" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField name="tel" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700">Phone Number *</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                    <Input {...field} className="pl-10 h-11 bg-slate-50 border-slate-200" placeholder="+234XXXXXXXXXX" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField name="address" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700">Address *</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                    <Input {...field} className="pl-10 h-11 bg-slate-50 border-slate-200" placeholder="Residence Address" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField name="password" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700">Password *</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                    <Input {...field} type={showPassword ? "text" : "password"} className="pl-10 pr-10 h-11 bg-slate-50 border-slate-200" placeholder="Create password" />
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField name="confirmPassword" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700">Confirm Password *</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                    <Input {...field} type={showConfirmPassword ? "text" : "password"} className="pl-10 pr-10 h-11 bg-slate-50 border-slate-200" placeholder="Confirm password" />
                                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>

                                <div className="pt-4 mt-8">
                                    <Button type="button" onClick={triggerValidationForStep1} className="w-full h-12 bg-primary hover:bg-blue-700 text-white font-bold rounded-xl text-lg shadow-lg flex items-center justify-center gap-2 transition-all">
                                        Next (Professional Details) <ArrowRight size={18} />
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
                                className="space-y-4 absolute w-full"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField name="employer" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700">Employer</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="h-11 bg-slate-50 border-slate-200" placeholder="Company & address" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField name="rank" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700">Rank</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="h-11 bg-slate-50 border-slate-200" placeholder="e.g. F/O, Capt, Engr." />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField name="designation" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700">Designation</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="h-11 bg-slate-50 border-slate-200" placeholder="Your title (optional)" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField name="section" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700">Section</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="h-11 bg-slate-50 border-slate-200" placeholder="Section/department (optional)" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField name="qualification" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700">Qualification</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="h-11 bg-slate-50 border-slate-200" placeholder="Qualifications & certifications" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField name="licenseNo" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700">License No.</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="h-11 bg-slate-50 border-slate-200" placeholder="If applicable" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField name="dateOfEmployment" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700">Date of Employment</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="date" className="h-11 bg-slate-50 border-slate-200" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>

                                <div className="border border-slate-200 bg-slate-50 p-4 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                    <FormField name="signature" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700">Signature (Type Full Name) *</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="h-11 bg-white border-slate-200" placeholder="Type your full name" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField name="date" control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold text-slate-700">Date *</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="date" className="h-11 bg-white border-slate-200" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>

                                <div className="pt-4 flex gap-4 mt-8 w-full">
                                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-1/3 h-12 rounded-xl font-bold flex items-center justify-center gap-2">
                                        <ArrowLeft size={18} /> Back
                                    </Button>
                                    <Button type="submit" disabled={loading} className="w-2/3 h-12 bg-primary hover:bg-blue-700 text-white font-bold rounded-xl text-lg shadow-lg hover:shadow-xl transition-all">
                                        {loading ? "Creating..." : "Submit Application"}
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
