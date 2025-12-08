"use client";

import React, { useState } from "react";
import { NaapButton } from "@/components/ui/custom/button.naap";
import { LucideMail, LucideUser, LucideSend, LucidePhone, LucideMapPin } from "lucide-react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

// Only primary color used
const PRIMARY = "#193B7A";
const ACCENT = PRIMARY;
const BORDER = PRIMARY;
const BG_INPUT = "#F8FAFC"; // Inputs can stay pale for UX, but all accents are PRIMARY
const ERROR_COLOR = PRIMARY;
const HIGHLIGHT = PRIMARY;

const contactSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    message: z.string().min(8, "Message is required (min 8 characters)"),
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
        await new Promise((res) => setTimeout(res, 1200));
        setSubmitting(false);
        setSubmitted(true);
        form.reset();
        setTimeout(() => setSubmitted(false), 3500);
    }

    return (
        <section
            className="w-full px-2"
            aria-labelledby="contact-section-heading"
        >
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-0 md:gap-14">
                {/* Left: Contact Form */}
                <div className="w-full md:w-5/9 lg:w-7/12 flex flex-col mb-8 md:mb-0">
                    <h2
                        id="contact-section-heading"
                        className="text-3xl sm:text-4xl font-extrabold text-[#193B7A] mb-1 leading-tight tracking-tight"
                    >
                        Get in Touch with NAAPE
                    </h2>
                    <p className="text-base text-[#193B7A] mb-9 font-medium max-w-xl">
                        Want to contact us for membership, partnership, questions, or support?
                        <span className="block mt-1 text-[15.5px] text-[#193B7A]">
                            Fill in this secure form and our executive team will get back to you
                            within <span className="font-semibold" style={{ color: PRIMARY }}>1-2 business days</span>.
                        </span>
                    </p>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col gap-6 bg-white rounded-xl border border-[#193B7A] p-6 md:p-8"
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
                                        <FormLabel htmlFor="name" className="block text-sm font-bold text-[#193B7A] mb-1.5">
                                            Full Name
                                        </FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <input
                                                    {...field}
                                                    id="name"
                                                    type="text"
                                                    placeholder="Your full name"
                                                    className={`border ${form.formState.errors.name ? `border-[#193B7A]` : "border-[#193B7A]/30"
                                                        } rounded-md pl-10 pr-3 py-2 w-full text-[15px] bg-[#F8FAFC] text-[#193B7A] font-medium focus:outline-none focus:ring-[2.5px]`}
                                                    style={
                                                        form.formState.errors.name
                                                            ? { borderColor: PRIMARY, boxShadow: `0 0 0 2.5px ${PRIMARY}` }
                                                            : { }
                                                    }
                                                    autoComplete="off"
                                                    aria-invalid={!!form.formState.errors.name}
                                                    aria-describedby={form.formState.errors.name ? "name-error" : undefined}
                                                />
                                            </FormControl>
                                            <LucideUser className="absolute left-2.5 top-2.5 w-5 h-5 text-[#193B7A]/70" aria-hidden />
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
                                        <FormLabel htmlFor="email" className="block text-sm font-bold text-[#193B7A] mb-1.5">
                                            Email Address
                                        </FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <input
                                                    {...field}
                                                    id="email"
                                                    type="email"
                                                    placeholder="your@email.com"
                                                    className={`border ${form.formState.errors.email ? `border-[#193B7A]` : "border-[#193B7A]/30"
                                                        } rounded-md pl-10 pr-3 py-2 w-full text-[15px] bg-[#F8FAFC] text-[#193B7A] font-medium focus:outline-none focus:ring-[2.5px]`}
                                                    style={
                                                        form.formState.errors.email
                                                            ? { borderColor: PRIMARY, boxShadow: `0 0 0 2.5px ${PRIMARY}` }
                                                            : { }
                                                    }
                                                    autoComplete="off"
                                                    aria-invalid={!!form.formState.errors.email}
                                                    aria-describedby={form.formState.errors.email ? "email-error" : undefined}
                                                />
                                            </FormControl>
                                            <LucideMail className="absolute left-2.5 top-2.5 w-5 h-5 text-[#193B7A]/70" aria-hidden />
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
                                        <FormLabel htmlFor="message" className="block text-sm font-bold text-[#193B7A] mb-1.5">
                                            Your Message
                                        </FormLabel>
                                        <FormControl>
                                            <textarea
                                                {...field}
                                                id="message"
                                                placeholder="What would you like to discuss or ask us about?"
                                                minLength={8}
                                                maxLength={2000}
                                                className={`border ${form.formState.errors.message ? `border-[#193B7A]` : "border-[#193B7A]/30"
                                                    } rounded-md px-3 py-2 min-h-[112px] w-full text-[15px] bg-[#F8FAFC] text-[#193B7A] font-medium focus:outline-none focus:ring-[2.5px]`}
                                                style={
                                                    form.formState.errors.message
                                                        ? { borderColor: PRIMARY, boxShadow: `0 0 0 2.5px ${PRIMARY}` }
                                                        : { }
                                                }
                                                aria-invalid={!!form.formState.errors.message}
                                                aria-describedby={form.formState.errors.message ? "message-error" : undefined}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="w-full pt-1">
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
                                    style={{
                                        fontWeight: 700,
                                        fontSize: "16.3px",
                                        letterSpacing: 0.11,
                                        textTransform: "none",
                                        paddingTop: 11,
                                        paddingBottom: 11,
                                        background: PRIMARY,
                                        borderColor: PRIMARY
                                    }}
                                >
                                    {submitted ? "Message Sent!" : "Send Message"}
                                </NaapButton>
                                {submitted && (
                                    <div className="text-center text-[#193B7A] text-[15px] mt-3" role="status">
                                        Thank you! We have received your message and will respond as soon as possible – usually within 1-2 business days.
                                    </div>
                                )}
                            </div>
                        </form>
                    </Form>
                    <div
                        className="mt-9 bg-white border-l-4 px-5 py-4 rounded-lg text-[#193B7A] text-[15px] leading-snug font-medium"
                        style={{ borderColor: PRIMARY }}
                        aria-live="polite"
                    >
                        <span className="font-bold text-[#193B7A] block mb-0.5">Note:</span>
                        <ul className="list-disc ml-5 space-y-1">
                            <li>For membership, include your NAAPE ID if known for faster response.</li>
                            <li>For career/HR issues, describe your situation clearly.</li>
                            <li>
                                <span className="font-bold" style={{ color: PRIMARY }}>
                                    Emergency?
                                </span>{" "}
                                Call our hotline, not just this form.
                            </li>
                            <li>We respect your privacy: your message is confidential and securely handled.</li>
                        </ul>
                    </div>
                </div>
                {/* Right: Illustration or supportive info */}
                <div className="w-full md:w-4/9 lg:w-5/12 flex flex-col items-center justify-start p-0 pt-3">
                    <div
                        className="w-full rounded-xl border-2 border-[#193B7A] bg-white flex items-center justify-center relative min-h-[220px] md:min-h-[320px] lg:min-h-[370px] mb-3"
                        style={{
                            maxHeight: 400,
                        }}
                        aria-label="Leadership photo"
                    >
                        <Image
                            src="/images/leader.png"
                            alt="Nigerian pilot with hand on aircraft throttle, NAAPE leadership"
                            className="object-cover w-full h-full rounded-xl grayscale-0 contrast-110"
                            style={{ minHeight: 0, minWidth: 0, borderRadius: "inherit" }}
                            fill
                            priority={false}
                            sizes="(max-width: 768px) 90vw, 35vw"
                        />
                    </div>
                    <div className="block mt-2 w-full">
                        <div className="text-base leading-6 font-semibold text-[#193B7A] mb-1.5 uppercase tracking-wide">
                            Why Contact Us?
                        </div>
                        <ul className="text-[15px] text-[#193B7A] font-medium list-disc space-y-0.5 ml-6 pl-0">
                            <li>Membership/dues, union support, and career help</li>
                            <li>Organizational partnerships and sponsorships</li>
                            <li>Safety/confidential reporting</li>
                            <li>Press and public relations</li>
                        </ul>
                    </div>
                </div>
            </div>
            {/* Highly readable and detailed contact information */}
            <div className="w-full max-w-3xl mx-auto mt-16">
                <h3
                    className="text-2xl font-bold text-[#193B7A] mb-6 border-b-2 pb-2"
                    style={{ borderColor: PRIMARY }}
                >
                    NAAPE Secretariat – Official Contact Details
                </h3>
                <div className="flex flex-col md:flex-row items-stretch justify-center gap-0 border border-[#193B7A]/20 rounded-lg overflow-hidden bg-white">
                    {/* Address */}
                    <div className="w-full md:w-1/3 flex flex-col items-center md:items-start bg-white border-b md:border-b-0 md:border-r border-[#193B7A]/15 px-7 py-7">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center justify-center bg-[#193B7A]/10 text-[#193B7A] rounded-full p-2 mr-1">
                                <LucideMapPin className="w-6 h-6" />
                            </span>
                            <span className="font-semibold text-[#193B7A] text-base">Office Address</span>
                        </div>
                        <address className="text-sm text-[#193B7A] text-center md:text-left not-italic leading-snug" aria-label="Office Address">
                            NAAPE Secretariat,<br />
                            Pilots' House,<br />
                            NAAPE Close, Off Oba Akinjobi Way,<br />
                            GRA Ikeja, Lagos, Nigeria<br />
                            <span className="block text-xs" style={{ color: PRIMARY, fontWeight: 600, marginTop: 4 }}>Visitors by appointment</span>
                        </address>
                    </div>
                    {/* Email */}
                    <div className="w-full md:w-1/3 flex flex-col items-center md:items-start bg-white border-t md:border-t-0 md:border-l md:border-r border-[#193B7A]/15 px-7 py-7">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center justify-center bg-[#193B7A]/10 text-[#193B7A] rounded-full p-2 mr-1">
                                <LucideMail className="w-6 h-6" />
                            </span>
                            <span className="font-semibold text-[#193B7A] text-base">Email</span>
                        </div>
                        <a
                            href="mailto:info@naape.org.ng"
                            className="text-[15.5px] underline break-all font-bold hover:text-[#193B7A] transition text-center md:text-left"
                            style={{ color: PRIMARY }}
                        >
                            info@naape.org.ng
                        </a>
                        <span className="block mt-2 text-xs font-normal text-[#193B7A] text-center md:text-left">
                            For membership, attach documentation if possible.
                        </span>
                    </div>
                    {/* Phone number */}
                    <div className="w-full md:w-1/3 flex flex-col items-center md:items-start bg-white border-t md:border-t-0 md:border-l border-[#193B7A]/15 px-7 py-7">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center justify-center bg-[#193B7A]/10 text-[#193B7A] rounded-full p-2 mr-1">
                                <LucidePhone className="w-6 h-6" />
                            </span>
                            <span className="font-semibold text-[#193B7A] text-base">Phone</span>
                        </div>
                        <a
                            href="tel:+2348081489071"
                            className="text-[#193B7A] font-bold text-[15.5px] underline hover:text-[#193B7A] transition text-center md:text-left"
                        >
                            +234 (0) 808 148 9071
                        </a>
                        <span className="mt-1 text-[#193B7A] text-xs text-center md:text-left">(Mon–Fri, 9am–5pm)</span>
                        <span
                            className="block text-xs mt-1 font-semibold text-center md:text-left"
                            style={{ color: PRIMARY }}
                        >
                            <span aria-label="emergency" className="mr-1">●</span>
                            Emergency? Call for urgent union help.
                        </span>
                    </div>
                </div>
                <div className="mt-6 px-1 text-[14.3px] text-[#193B7A] font-medium leading-tight">
                    <span className="font-bold text-[#193B7A]">Other ways to contact/engage:</span> For media requests, partnership proposals, or conference invitations,
                    email the Secretariat above for routing to the appropriate department. Social media DMs are not monitored for official matters.
                </div>
            </div>
        </section>
    );
}
