"use client";

import { useState, useRef } from "react";
import { FaCheckCircle, FaFileWord, FaArrowLeft, FaExclamationCircle } from "react-icons/fa";
import { NaapButton } from "@/components/ui/custom/button.naap";

// Import the primary color from the correct source

const PRIMARY_COLOR = 'var(--primary)'
const defaultForm = {
    name: "",
    address: "",
    tel: "",
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

const WORD_TEMPLATE = `
NATIONAL ASSOCIATION OF AIRCRAFT PILOTS & ENGINEERS

(NAAPE)

National Secretariat:
No.2, Unity Road
Ikeja, Lagos.
Tel: 234-01-8417290

Membership Form

Name: {name}
Address: {address}
Tel. No.: {tel}
Designation: {designation}
Date Of Employment: {dateOfEmployment}
Section: {section}
Academic / Professional Qualification: {qualification}
License No.: {licenseNo}
Name / Address Of Employer: {employer}

I, F/O, SF/O, SF/E, Capt, Engr. (Please delete as appropriate) {rank}
have decided to join the membership of the Association. The Management is hereby authorized
to deduct One Percent (1%) of my base pay which includes (Basic salary, Housing and Transport)
monthly from my salary. Please send me the complete package of the Association’s membership
documents including the new constitution.

Signature Of Member: {signature}
Date: {date}
`;

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
        <div>
            <label
                className="block text-sm font-semibold tracking-wide mb-1"
                style={{ color: PRIMARY_COLOR }}
                htmlFor={name}
            >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {textarea ? (
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="input input-bordered w-full min-h-[42px] resize-none transition-all"
                    style={{
                        borderColor: PRIMARY_COLOR,
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
                    className="input input-bordered w-full transition-all"
                    style={{
                        borderColor: PRIMARY_COLOR,
                        // For focus:
                        // outlineColor: PRIMARY_COLOR,
                    }}
                    required={required}
                    {...props}
                />
            )}
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
                            : { }
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
    const [form, setForm] = useState(defaultForm);
    const [submitted, setSubmitted] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<null | "success" | "fail">(null);
    const [submitMessage, setSubmitMessage] = useState<string>("");
    const [downloading, setDownloading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    // Simple required fields validation for this form
    function validateForm() {
        // Required fields for the minimal form:
        const requiredFields: Array<keyof typeof defaultForm> = ['name', 'address', 'tel', 'signature', 'date'];
        for (const field of requiredFields) {
            if (!form[field] || form[field].trim() === "") {
                return false;
            }
        }
        return true;
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Simple validation
        if (!validateForm()) {
            setSubmitStatus("fail");
            setSubmitted(true);
            setSubmitMessage("Please fill out all required fields.");
            return;
        }

        // Simulate successful form submission (could be replaced with actual API call)
        try {
            // Here you would implement backend interaction if required
            setSubmitStatus("success");
            setSubmitted(true);
            setSubmitMessage("Your NAAPE membership form has been submitted. Our team will contact you with further instructions and provide your membership package.");
        } catch (err) {
            setSubmitStatus("fail");
            setSubmitted(true);
            setSubmitMessage("There was a problem submitting your application. Please try again.");
        }
    }

    function generateWordDoc() {
        setDownloading(true);
        let content = WORD_TEMPLATE;
        Object.entries(form).forEach(([key, value]) => {
            content = content.replace(`{${key}}`, value || "_________________");
        });
        const wordHtml =
            `<html xmlns:o='urn:schemas-microsoft-com:office:office' ` +
            `xmlns:w='urn:schemas-microsoft-com:office:word' ` +
            `xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset="utf-8"><title>Membership Form</title></head><body>` +
            content.replace(/\n/g, "<br>") +
            `</body></html>`;

        const blob = new Blob([wordHtml], { type: "application/msword" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "NAAPE_Membership_Form.doc";
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
            URL.revokeObjectURL(url);
            document.body.removeChild(link);
            setDownloading(false);
        }, 1200);
    }

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
                                >
                                    Submit Form
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
                                        <FaArrowLeft/> Fill another form
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
                                        <FaArrowLeft/> Try Again
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
