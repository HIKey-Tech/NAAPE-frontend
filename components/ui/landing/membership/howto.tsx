"use client";

import { useRef, useState } from "react";
import { CheckCircle, FileText, ArrowLeft, AlertCircle, Download } from "lucide-react";
import { NaapButton } from "@/components/ui/custom/button.naap";
import { useSubmitForm } from "@/hooks/useMembership";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const defaultForm = {
    name: "", email: "", tel: "", address: "", designation: "",
    dateOfEmployment: "", section: "", qualification: "",
    licenseNo: "", employer: "", rank: "", signature: "", date: "",
};

function FormSection({ label, name, type = "text", value, onChange, required = false, textarea = false, placeholder = "", children, ...props }: any) {
    return (
        <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5" htmlFor={name}>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {textarea ? (
                <textarea
                    id={name} name={name} value={value} onChange={onChange} placeholder={placeholder}
                    className="w-full min-h-[80px] resize-none bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                    {...props}
                />
            ) : (
                <input
                    id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                    {...props}
                />
            )}
            {children}
        </div>
    );
}

const steps = [
    { text: "Register with NAAPE", icon: <CheckCircle size={18} className="text-primary" /> },
    { text: "Complete the Membership Form", icon: <CheckCircle size={18} className="text-primary" /> },
    { text: "Authorize Salary Deduction", icon: <CheckCircle size={18} className="text-primary" /> },
    { text: "Submit & Receive Documents", icon: <CheckCircle size={18} className="text-primary" /> },
    { text: "Optional: Download as Word Doc", icon: <FileText size={18} className="text-primary" /> },
];

function HowToBecomeMember() {
    const formRef = useRef<HTMLFormElement>(null);
    const [form, setForm] = useState({ ...defaultForm });
    const [submitted, setSubmitted] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(null);
    const [submitMessage, setSubmitMessage] = useState("");
    const [downloading, setDownloading] = useState(false);
    const submitMutation = useSubmitForm();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const generateWordDoc = async () => {
        setDownloading(true);
        await new Promise((r) => setTimeout(r, 1200));
        setDownloading(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitStatus(null);
        setSubmitMessage("");
        try {
            await submitMutation.mutateAsync({
                ...form,
                date: form.date ? new Date(form.date) : undefined,
                dateOfEmployment: form.dateOfEmployment ? new Date(form.dateOfEmployment) : undefined,
            });
            setSubmitted(true);
            setSubmitStatus("success");
            setSubmitMessage("Your membership application has been received! We'll be in touch soon.");
            setForm({ ...defaultForm });
        } catch (error: any) {
            setSubmitted(true);
            setSubmitStatus("error");
            setSubmitMessage(error?.message || "Failed to submit your membership form. Please try again.");
        }
    };

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
                        <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl ${idx === 0 ? "bg-primary/5 border border-primary/10" : "bg-slate-50 border border-slate-100"}`}>
                            {step.icon}
                            <span className={`font-medium text-sm ${idx === 0 ? "text-primary font-bold" : "text-slate-600"}`}>{step.text}</span>
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
                        <p className="text-xs text-slate-400 mb-6">Fields marked <span className="text-red-500">*</span> are required</p>

                        {!submitted ? (
                            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <FormSection label="Full Name" name="name" value={form.name} onChange={handleChange} required placeholder="Enter your full name" />
                                    <FormSection label="Email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" />
                                    <FormSection label="Phone Number" name="tel" value={form.tel} onChange={handleChange} required placeholder="+234XXXXXXXXXX" />
                                    <FormSection label="Address" name="address" value={form.address} onChange={handleChange} required placeholder="Residence address" />
                                    <FormSection label="Designation" name="designation" value={form.designation} onChange={handleChange} placeholder="Your title (optional)" />
                                    <FormSection label="Date Of Employment" name="dateOfEmployment" type="date" value={form.dateOfEmployment} onChange={handleChange} />
                                    <FormSection label="Section" name="section" value={form.section} onChange={handleChange} placeholder="Section/department (optional)" />
                                    <FormSection label="Qualification" name="qualification" value={form.qualification} onChange={handleChange} placeholder="Qualifications & certifications" />
                                    <FormSection label="License No." name="licenseNo" value={form.licenseNo} onChange={handleChange} placeholder="If applicable" />
                                    <FormSection label="Employer" name="employer" value={form.employer} onChange={handleChange} textarea rows={2} placeholder="Company & address" />
                                    <FormSection label="Rank" name="rank" value={form.rank} onChange={handleChange} placeholder="e.g. F/O, Capt, Engr." />
                                    <FormSection label="Signature (type full name)" name="signature" value={form.signature} onChange={handleChange} required placeholder="Type your full name" />
                                    <FormSection label="Date" name="date" type="date" value={form.date} onChange={handleChange} required />
                                </div>
                                <div className="flex flex-wrap gap-4 pt-4">
                                    <NaapButton
                                        type="submit"
                                        className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3 rounded-xl text-base shadow-lg hover:shadow-primary/25 transition-all"
                                        disabled={submitMutation.isPending}
                                    >
                                        {submitMutation.isPending ? "Submitting..." : "Submit Form"}
                                    </NaapButton>
                                    <button
                                        type="button"
                                        className="flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary font-bold rounded-xl text-sm hover:bg-primary/5 transition-colors"
                                        onClick={generateWordDoc}
                                        disabled={downloading}
                                    >
                                        {downloading ? (
                                            <><div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /> Preparing...</>
                                        ) : (
                                            <><Download size={16} /> Download as Word</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        ) : submitStatus === "success" ? (
                            <div className="p-8 bg-green-50 border border-green-200 rounded-2xl text-center">
                                <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
                                <p className="font-bold text-lg text-green-800 mb-2">Thank you for your submission!</p>
                                <p className="text-green-700 mb-4">{submitMessage}</p>
                                <div className="flex flex-wrap justify-center gap-3">
                                    <button className="flex items-center gap-2 text-primary font-bold text-sm hover:underline" onClick={() => { setSubmitted(false); setSubmitStatus(null); }}>
                                        <ArrowLeft size={16} /> Fill another form
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 border border-primary text-primary font-bold rounded-lg text-sm" onClick={generateWordDoc}>
                                        <Download size={16} /> Download as Word
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 bg-red-50 border border-red-200 rounded-2xl text-center">
                                <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
                                <p className="font-bold text-lg text-red-800 mb-2">Submission Failed</p>
                                <p className="text-red-700 mb-4">{submitMessage || "Sorry, we could not process your submission."}</p>
                                <button className="flex items-center gap-2 text-primary font-bold text-sm hover:underline mx-auto" onClick={() => { setSubmitted(false); setSubmitStatus(null); }}>
                                    <ArrowLeft size={16} /> Try Again
                                </button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}

export default HowToBecomeMember;
