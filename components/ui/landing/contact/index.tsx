"use client";

import React, { useState } from "react";
import { NaapButton } from "@/components/ui/custom/button.naap";
import { Mail, User, Send, Phone, MapPin, CheckCircle } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

const contactSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    message: z.string().min(8, "Message is required (min 8 characters)").max(2000, "Message too long"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactSection() {
    const [submitting, setSubmitting] = useState(false);

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: { name: "", email: "", message: "" },
        mode: "onBlur",
    });

    async function onSubmit(data: ContactFormValues) {
        setSubmitting(true);
        // Simulate API call
        await new Promise((res) => setTimeout(res, 1500));
        setSubmitting(false);
        form.reset();
        toast.success("Message Sent Successfully!", {
            description: "We'll get back to you within 1-2 business days."
        });
    }

    return (
        <section className="w-full max-w-7xl mx-auto py-16 px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
                {/* Left: Contact Form */}
                <div className="w-full lg:w-7/12">
                    <div className="mb-10">
                        <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-2 block">Contact Us</span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
                            Get in Touch with NAAPE
                        </h2>
                        <p className="text-lg text-slate-500 max-w-xl leading-relaxed">
                            Have questions about membership, partnerships, or support? Fill out the form below and our executive team will respond shortly.
                        </p>
                    </div>

                    <Card className="border-0 shadow-2xl shadow-slate-200/50 bg-white rounded-3xl overflow-hidden">
                        <CardContent className="p-8 md:p-10">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-bold text-slate-700">Full Name</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                            <Input {...field} className="pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all" placeholder="John Doe" />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="font-bold text-slate-700">Email Address</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                            <Input {...field} className="pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all" placeholder="name@company.com" />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold text-slate-700">Message</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        {...field}
                                                        className="min-h-[150px] bg-slate-50 border-slate-200 focus:bg-white transition-all resize-none p-4"
                                                        placeholder="How can we help you?"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="pt-2">
                                        <NaapButton
                                            type="submit"
                                            loading={submitting}
                                            loadingText="Sending Message..."
                                            className="w-full bg-primary hover:bg-blue-700 text-white font-bold h-12 rounded-xl text-base shadow-lg hover:shadow-primary/25 transition-all"
                                            icon={<Send size={18} />}
                                            iconPosition="right"
                                        >
                                            Send Message
                                        </NaapButton>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    <div className="mt-8 bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <CheckCircle size={18} className="text-secondary" />
                                Response Time
                            </h4>
                            <p className="text-sm text-slate-500">We typically respond to inquiries within 1-2 business days.</p>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <CheckCircle size={18} className="text-secondary" />
                                Privacy
                            </h4>
                            <p className="text-sm text-slate-500">Your information is secure and will never be shared with third parties.</p>
                        </div>
                    </div>
                </div>

                {/* Right: Info & Visuals */}
                <div className="w-full lg:w-5/12 space-y-8">
                    <div className="relative h-[300px] md:h-[400px] w-full rounded-3xl overflow-hidden shadow-xl">
                        <Image
                            src="/images/leader.png"
                            alt="Contact Support"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6 text-white text-center">
                            <p className="font-bold text-lg">"We are dedicated to serving our members with excellence and integrity."</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 p-8 space-y-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <MapPin className="text-primary" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Office Address</h4>
                                        <p className="text-sm text-slate-500 leading-relaxed">
                                            NAAPE Secretariat, Pilots' House,<br />
                                            NAAPE Close, Off Oba Akinjobi Way,<br />
                                            GRA Ikeja, Lagos, Nigeria
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Mail className="text-primary" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Email Us</h4>
                                        <a href="mailto:info@naape.org.ng" className="text-sm text-primary font-medium hover:underline">info@naape.org.ng</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Phone className="text-primary" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">Call Us</h4>
                                        <a href="tel:+2348081489071" className="text-sm text-primary font-medium hover:underline">+234 (0) 808 148 9071</a>
                                        <p className="text-xs text-slate-400 mt-0.5">Mon–Fri, 9am–5pm</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
