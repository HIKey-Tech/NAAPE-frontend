"use client";

import React, { useState } from "react";
import { NaapButton } from "@/components/ui/custom/button.naap";
import { LucideMail, LucideUser, LucideSend } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormControl,
    FormDescription,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

// Define the form schema with zod
const contactSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    message: z.string().min(8, "Message is required (min 8 characters)")
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactSection() {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
        mode: "onTouched",
    });

    async function onSubmit(data: ContactFormValues) {
        setSubmitting(true);
        // Simulate async API request
        await new Promise((res) => setTimeout(res, 1200));
        setSubmitting(false);
        setSubmitted(true);
        form.reset();
        setTimeout(() => setSubmitted(false), 3500);
    }

    return (
        <section className="w-full flex flex-col items-center py-16 bg-gradient-to-b from-white to-blue-50/50">
            <div className="max-w-full w-full mx-auto px-6">
                {/* Heading */}
                <header className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 tracking-tight">
                        Connect with <span className="text-blue-600 underline underline-offset-4 decoration-blue-300">NAAPE</span>
                    </h2>
                    <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                        Have a question, idea, or want to collaborate? <span className="inline md:block">We're eager to hear from you.</span> <br className="hidden md:inline" />
                        Reach out below and a dedicated member of our team will respond promptly.
                    </p>
                </header>
                {/* Grid for form and image */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
                    {/* Contact Form */}
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col gap-5 bg-white rounded-xl shadow-md p-6 md:p-8"
                            autoComplete="off"
                            aria-label="Contact form"
                            noValidate
                        >
                            {/* Name */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Name
                                        </FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <input
                                                    {...field}
                                                    id="name"
                                                    type="text"
                                                    placeholder="Full name"
                                                    className={`border ${form.formState.errors.name ? "border-red-400" : "border-gray-200"
                                                        } rounded-md pl-9 pr-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
                                                    autoComplete="off"
                                                    aria-invalid={!!form.formState.errors.name}
                                                    aria-describedby={form.formState.errors.name ? "name-error" : undefined}
                                                />
                                            </FormControl>
                                            <LucideUser className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" aria-hidden />
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <input
                                                    {...field}
                                                    id="email"
                                                    type="email"
                                                    placeholder="Email address"
                                                    className={`border ${form.formState.errors.email ? "border-red-400" : "border-gray-200"
                                                        } rounded-md pl-9 pr-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
                                                    autoComplete="off"
                                                    aria-invalid={!!form.formState.errors.email}
                                                    aria-describedby={form.formState.errors.email ? "email-error" : undefined}
                                                />
                                            </FormControl>
                                            <LucideMail className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" aria-hidden />
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Message */}
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                            Message
                                        </FormLabel>
                                        <FormControl>
                                            <textarea
                                                {...field}
                                                id="message"
                                                placeholder="Type your message..."
                                                minLength={8}
                                                maxLength={2000}
                                                className={`border ${form.formState.errors.message ? "border-red-400" : "border-gray-200"
                                                    } rounded-md px-3 py-2 min-h-[110px] w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none transition`}
                                                aria-invalid={!!form.formState.errors.message}
                                                aria-describedby={form.formState.errors.message ? "message-error" : undefined}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div>
                                <NaapButton
                                    type="submit"
                                    loading={submitting}
                                    loadingText="Sending..."
                                    fullWidth
                                    variant="primary"
                                    icon={<LucideSend className="h-4 w-4" />}
                                    iconPosition="left"
                                    tooltip="Send your message"
                                    disabled={submitting || submitted}
                                >
                                    {submitted ? "Message Sent!" : "Send Message"}
                                </NaapButton>
                                {/* Send animation/message */}
                                {submitted && (
                                    <div className="text-center text-green-600 text-sm mt-2 animate-fadeIn" role="status">
                                        Thank you! Your message has been sent.
                                    </div>
                                )}
                            </div>
                        </form>
                    </Form>
                    {/* Image side */}
                    <div className="w-full  rounded-xl flex items-center justify-center relative min-h-[280px] md:min-h-[340px] lg:min-h-[400px] xl:min-h-[460px] overflow-hidden">
                        <Image
                            src="/images/leader.png"
                            alt="Nigerian pilot with hand on aircraft throttle, NAAPE leadership"
                            className="object-cover w-full h-full rounded-xl shadow-lg transition-transform duration-300 hover:scale-105 brightness-95"
                            style={{ minHeight: 0, minWidth: 0 }}
                            fill
                            priority={false}
                            sizes="(max-width: 768px) 90vw, 40vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/70 via-transparent to-blue-100/20 pointer-events-none rounded-xl" aria-hidden="true"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
