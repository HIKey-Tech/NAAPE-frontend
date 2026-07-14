"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useCertificate } from "@/hooks/useCourses";
import { downloadCertificatePdf } from "@/app/api/courses/courses";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Award, Printer, Download, ChevronLeft, Loader2 } from "lucide-react";

export default function CourseCertificatePage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : (params.id as string);
    const { data: cert, isLoading, isError } = useCertificate(id);
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        if (!id) return;
        setDownloading(true);
        try {
            await downloadCertificatePdf(id, cert?.certificateId);
        } catch {
            toast.error("Failed to download certificate PDF");
        } finally {
            setDownloading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    if (isError || !cert) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 text-center max-w-md">
                    <p className="text-lg font-medium text-slate-700 mb-4">
                        Certificate not available yet. Complete the course to earn it.
                    </p>
                    <Link href={`/courses/${id}/learn`} className="text-primary font-semibold hover:underline">
                        Back to course
                    </Link>
                </div>
            </div>
        );
    }

    const completedDate = new Date(cert.completedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    return (
        <div className="min-h-screen bg-gray-50 w-full pt-24 pb-16 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-6 print:hidden">
                    <Link
                        href={`/courses/${id}/learn`}
                        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary"
                    >
                        <ChevronLeft size={16} /> Back to course
                    </Link>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => window.print()}>
                            <Printer size={16} className="mr-2" /> Print
                        </Button>
                        <Button onClick={handleDownload} disabled={downloading}>
                            {downloading ? (
                                <Loader2 size={16} className="mr-2 animate-spin" />
                            ) : (
                                <Download size={16} className="mr-2" />
                            )}
                            Download PDF
                        </Button>
                    </div>
                </div>

                {/* Printable certificate */}
                <div className="bg-white border-8 border-double border-primary/30 rounded-xl p-10 md:p-16 text-center shadow-sm print:shadow-none print:border-4">
                    <Award className="mx-auto text-primary mb-6" size={56} />
                    <p className="text-sm font-bold tracking-[0.3em] text-slate-400 uppercase mb-2">
                        Certificate of Completion
                    </p>
                    <p className="text-slate-500 mb-8">
                        National Association of Aircraft Pilots and Engineers
                    </p>

                    <p className="text-slate-500 mb-2">This certifies that</p>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">{cert.memberName}</h1>
                    <p className="text-slate-500 mb-2">has successfully completed the course</p>
                    <h2 className="text-xl md:text-2xl font-bold text-primary mb-10">{cert.courseTitle}</h2>

                    <div className="flex items-center justify-center gap-10 text-sm text-slate-500">
                        <div>
                            <p className="font-semibold text-slate-800">{completedDate}</p>
                            <p className="text-xs mt-1 border-t border-slate-200 pt-1">Date</p>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800">{cert.certificateId}</p>
                            <p className="text-xs mt-1 border-t border-slate-200 pt-1">Certificate ID</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
