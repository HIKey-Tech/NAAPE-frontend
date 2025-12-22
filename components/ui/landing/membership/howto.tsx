"use client";

import { useRef, useState } from "react";
import { FaCheckCircle, FaFileWord, FaArrowLeft, FaExclamationCircle } from "react-icons/fa";
import { NaapButton } from "@/components/ui/custom/button.naap";
import { useSubmitForm } from "@/hooks/useMembership";

const PRIMARY_COLOR = 'var(--primary)';

// Form fields used in the membership form
const defaultForm = {
    name: "",
    email: "",
    tel: "",
    address: "",
    designation: "",
    dateOfEmployment: "",
    section: "",
    qualification: "",
    licenseNo: "",
    employer: "",
    rank: "",
    signature: "",
    date: "",
};

function FormSection({
    label,
    name,
    type = "text",
    value,
    onChange,
    required = false,
    textarea = false,
    placeholder = "",
    children,
    ...props
}: any) {
    return (
        <div className="mb-2">
            <label
                className="block text-sm font-semibold tracking-wide mb-1"
                style={{ color: PRIMARY_COLOR }}
                htmlFor={name}
            >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div
                className="rounded-md transition-all"
                style={{
                    border: `1.5px solid ${PRIMARY_COLOR}`,
                    background: "white",
                    overflow: "hidden"
                }}
            >
                {textarea ? (
                    <textarea
                        id={name}
                        name={name}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        className="input w-full min-h-[42px] resize-none bg-transparent border-0 focus:ring-0 focus:outline-0"
                        style={{
                            border: "none",
                            boxShadow: "none",
                            outline: "none",
                            padding: "10px 14px"
                        }}
                        {...props}
                    />
                ) : (
                    <input
                        id={name}
                        name={name}
                        type={type}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        className="input w-full bg-transparent border-0 focus:ring-0 focus:outline-0"
                        style={{
                            border: "none",
                            boxShadow: "none",
                            outline: "none",
                            padding: "10px 14px"
                        }}
                        required={required}
                        {...props}
                    />
                )}
            </div>
            {children}
        </div>
    );
}

function StepIndicator({ stepCount = 5 }) {
    const steps = [
        {
            text: "Register with NAAPE",
            icon: <FaCheckCircle style={{ color: PRIMARY_COLOR }} />,
        },
        {
            text: "Complete the Membership Form",
            icon: <FaCheckCircle style={{ color: PRIMARY_COLOR }} />,
        },
        {
            text: "Authorize Salary Deduction",
            icon: <FaCheckCircle style={{ color: PRIMARY_COLOR }} />,
        },
        {
            text: "Submit & Receive Documents",
            icon: <FaCheckCircle style={{ color: PRIMARY_COLOR }} />,
        },
        {
            text: "Optional: Download as Word Doc",
            icon: <FaFileWord style={{ color: PRIMARY_COLOR }} />,
        },
    ];

    return (
        <ol className="mb-7 mt-2 space-y-2">
            {steps.map(({ text, icon }, idx) => (
                <li
                    key={idx}
                    className={`flex items-center gap-2 pl-2 py-1 rounded ${
                        idx === 0
                            ? "font-semibold"
                            : ""
                    }
                    text-gray-700 dark:text-gray-200`}
                    style={
                        idx === 0
                            ? { background: "#f4faff", color: PRIMARY_COLOR }
                            : {}
                    }
                >
                    <span className="flex items-center justify-center w-6">
                        {icon}
                    </span>
                    <span className={"ml-1"}>{text}</span>
                </li>
            ))}
        </ol>
    );
}

function HowToBecomeMember() {
    const formRef = useRef<HTMLFormElement>(null);

    // Membership form state, local to this component.
    const [form, setForm] = useState({ ...defaultForm });
    const [submitted, setSubmitted] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(null);
    const [submitMessage, setSubmitMessage] = useState("");
    const [downloading, setDownloading] = useState(false);

    // React Query mutation
    const submitMutation = useSubmitForm();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Word doc generator mock
    const generateWordDoc = async () => {
        setDownloading(true);
        // Simple delay mock
        await new Promise((r) => setTimeout(r, 1200));
        setDownloading(false);
        // Normally would generate and download .doc with current form data
        // Here, can use code for docx, file-saver, etc.
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitStatus(null);
        setSubmitMessage("");
        // Send the full form object (all fields) to the backend for maximal data completeness
        try {
            // This will POST the whole form object to /submit-form via the useSubmitForm hook.
            await submitMutation.mutateAsync({ ...form });
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
        <section className="relative max-w-2xl mx-auto px-2 sm:px-6 py-10">
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <span className="h-6 w-1 rounded-full" style={{ background: PRIMARY_COLOR }} />
                    <span
                        className="uppercase tracking-widest font-semibold text-xs"
                        style={{ color: PRIMARY_COLOR }}
                    >
                        Membership Process
                    </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-2 leading-tight text-gray-900 dark:text-white">
                    How to Become a Member of <span style={{ color: PRIMARY_COLOR }}>NAAPE</span>
                </h2>
                <p className="mb-4 text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                    Apply to join the National Association of Aircraft Pilots &amp; Engineers (NAAPE) and gain access to a professional network, member resources, and representation in your field. Follow these steps to get started:
                </p>
                <StepIndicator />

                <div className="border border-gray-200 dark:border-[#232a3e] rounded-xl p-6 sm:p-8 bg-white dark:bg-[#18213a] mb-9 transition-all">
                    <h3
                        className="text-2xl font-bold mb-1 tracking-tight flex items-center gap-2"
                        style={{ color: PRIMARY_COLOR }}
                    >
                        <span>
                            <FaFileWord className="inline-block mr-1" size={23} style={{ color: PRIMARY_COLOR }} />
                        </span>
                        <span>NAAPE Membership Form</span>
                    </h3>
                    <div className="text-xs text-gray-500 mb-4">
                        Fields marked <span className="text-red-500">*</span> are required
                    </div>

                    {!submitted ? (
                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <FormSection
                                    label="Full Name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your full name"
                                />
                                <FormSection
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter a valid email address"
                                />
                                <FormSection
                                    label="Tel. No."
                                    name="tel"
                                    value={form.tel}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. +234XXXXXXXXXX"
                                />
                                <FormSection
                                    label="Address"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    required
                                    placeholder="Residence address"
                                />
                                <FormSection
                                    label="Designation"
                                    name="designation"
                                    value={form.designation}
                                    onChange={handleChange}
                                    placeholder="(Optional) Your title"
                                />
                                <FormSection
                                    label="Date Of Employment"
                                    name="dateOfEmployment"
                                    type="date"
                                    value={form.dateOfEmployment}
                                    onChange={handleChange}
                                />
                                <FormSection
                                    label="Section"
                                    name="section"
                                    value={form.section}
                                    onChange={handleChange}
                                    placeholder="(Optional) Enter section/department"
                                />
                                <FormSection
                                    label="Academic / Professional Qualification"
                                    name="qualification"
                                    value={form.qualification}
                                    onChange={handleChange}
                                    placeholder="Qualifications & certifications"
                                />
                                <FormSection
                                    label="License No."
                                    name="licenseNo"
                                    value={form.licenseNo}
                                    onChange={handleChange}
                                    placeholder="(if any)"
                                />
                                <FormSection
                                    label="Name / Address Of Employer"
                                    name="employer"
                                    value={form.employer}
                                    onChange={handleChange}
                                    textarea
                                    rows={2}
                                    placeholder="Company & address"
                                />
                                <FormSection
                                    label="Rank (e.g. F/O, SF/O, SF/E, Capt, Engr.)"
                                    name="rank"
                                    value={form.rank}
                                    onChange={handleChange}
                                    placeholder="Enter rank (optional)"
                                />
                                <FormSection
                                    label="Signature (type full name)"
                                    name="signature"
                                    value={form.signature}
                                    onChange={handleChange}
                                    required
                                    placeholder="Type your full name"
                                />
                                <FormSection
                                    label="Date"
                                    name="date"
                                    type="date"
                                    value={form.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-wrap gap-4 items-center pt-3">
                                <NaapButton
                                    type="submit"
                                    className="px-8 font-bold text-lg rounded transition-colors"
                                    style={{
                                        color: "#fff",
                                        background: PRIMARY_COLOR,
                                        boxShadow: "none",
                                        border: "none",
                                    }}
                                    disabled={submitMutation.isPending}
                                >
                                    {submitMutation.isPending ? "Submitting..." : "Submit Form"}
                                </NaapButton>
                                <button
                                    type="button"
                                    className="btn btn-outline flex items-center gap-2"
                                    style={{
                                        borderColor: PRIMARY_COLOR,
                                        color: PRIMARY_COLOR,
                                    }}
                                    onClick={generateWordDoc}
                                    disabled={downloading}
                                >
                                    {downloading ? (
                                        <>
                                            <svg
                                                className="animate-spin -ml-1 mr-2 h-5 w-5"
                                                style={{ color: PRIMARY_COLOR }}
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v8z"
                                                ></path>
                                            </svg>
                                            Preparing...
                                        </>
                                    ) : (
                                        <>
                                            <FaFileWord style={{ color: PRIMARY_COLOR }} /> Download as Word Document
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        submitStatus === "success" ? (
                            <div className="p-5 bg-green-50 dark:bg-[#233031] border border-green-300 dark:border-green-600 rounded-xl text-center transition-all">
                                <FaCheckCircle size={45} className="mx-auto mb-2" style={{ color: "#16a34a" }} />
                                <p className="font-bold text-lg mb-2" style={{ color: "#15803d" }}>
                                    Thank you for your submission!
                                </p>
                                <p className="mb-2 text-gray-700 dark:text-gray-200 leading-snug">
                                    {submitMessage}
                                </p>
                                <div className="flex flex-wrap justify-center gap-2 mt-2">
                                    <button
                                        className="btn btn-link mt-1 p-0 flex items-center gap-2"
                                        style={{ color: PRIMARY_COLOR }}
                                        onClick={() => { setSubmitted(false); setSubmitStatus(null); setSubmitMessage(""); }}
                                    >
                                        <FaArrowLeft /> Fill another form
                                    </button>
                                    <button
                                        className="btn btn-outline flex items-center gap-2"
                                        style={{
                                            borderColor: PRIMARY_COLOR,
                                            color: PRIMARY_COLOR,
                                        }}
                                        onClick={generateWordDoc}
                                    >
                                        <FaFileWord style={{ color: PRIMARY_COLOR }} /> Download as Word Document
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-5 bg-red-50 dark:bg-[#3a2020] border border-red-300 dark:border-red-800 rounded-xl text-center transition-all">
                                <FaExclamationCircle size={45} className="mx-auto mb-2" style={{ color: "#dc2626" }} />
                                <p className="font-bold text-lg mb-2" style={{ color: "#dc2626" }}>
                                    Submission Failed
                                </p>
                                <p className="mb-2 text-gray-700 dark:text-gray-200 leading-snug">
                                    {submitMessage || "Sorry, we could not process your submission. Please try again or check your form entries."}
                                </p>
                                <div className="flex flex-wrap justify-center gap-2 mt-2">
                                    <button
                                        className="btn btn-link mt-1 p-0 flex items-center gap-2"
                                        style={{ color: PRIMARY_COLOR }}
                                        onClick={() => { setSubmitted(false); setSubmitStatus(null); setSubmitMessage(""); }}
                                    >
                                        <FaArrowLeft /> Try Again
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mt-6 pl-1">
                    <span className="font-bold uppercase" style={{ color: PRIMARY_COLOR }}>
                        NAAPE Secretariat:
                    </span>
                    <span>No.2, Unity Road, Ikeja, Lagos. Tel: 234-01-8417290</span>
                </div>
            </div>
        </section>
    );
}

export default HowToBecomeMember;
