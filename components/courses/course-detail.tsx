"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/authcontext";
import { useSingleCourse, useEnrollInCourse } from "@/hooks/useCourses";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    BookOpen,
    Video,
    FileText,
    Lock,
    CheckCircle2,
    Award,
    Loader2,
    ListChecks
} from "lucide-react";

export default function CourseDetail({ id }: { id?: string }) {
    const router = useRouter();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const { data: course, isLoading, isError } = useSingleCourse(id);
    const enrollMutation = useEnrollInCourse();
    const [redirecting, setRedirecting] = useState(false);

    const handleEnroll = async () => {
        if (!id) return;
        try {
            const res = await enrollMutation.mutateAsync(id);
            if (res.link) {
                // Paid course: off to Flutterwave
                setRedirecting(true);
                window.location.href = res.link;
            } else {
                toast.success(res.message || "Enrolled successfully");
                router.push(`/courses/${id}/learn`);
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Enrollment failed");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (isError || !course) {
        return (
            <div className="flex items-center justify-center py-24 px-4">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 text-center max-w-md">
                    <p className="text-lg font-medium text-slate-700 mb-4">Course not found.</p>
                    <Link href="/courses" className="text-primary font-semibold hover:underline">
                        Browse all courses
                    </Link>
                </div>
            </div>
        );
    }

    const price = course.isPaid
        ? `${course.currency === "NGN" ? "₦" : course.currency}${course.price.toLocaleString()}`
        : "Free";
    const completed = !!course.progress?.completedAt;
    const busy = enrollMutation.isPending || redirecting;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="relative h-56 md:h-72 bg-slate-100">
                    {course.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={course.imageUrl} alt={course.title} className="object-cover w-full h-full" />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-slate-300">
                            <BookOpen size={64} />
                        </div>
                    )}
                    <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className={course.isPaid ? "bg-amber-600" : "bg-slate-600"}>{price}</Badge>
                        {completed && (
                            <Badge className="bg-green-600 flex items-center gap-1">
                                <Award size={12} /> Completed
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="p-6 md:p-10">
                    <h1 className="text-2xl md:text-4xl font-black text-slate-900 mb-3">{course.title}</h1>
                    {course.description && (
                        <p className="text-slate-500 mb-8 whitespace-pre-line">{course.description}</p>
                    )}

                    {/* CTA */}
                    <div className="mb-10">
                        {authLoading ? null : !isAuthenticated ? (
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
                                <Lock className="mx-auto text-slate-400 mb-3" size={28} />
                                <p className="font-semibold text-slate-800 mb-1">This course is for NAAPE members</p>
                                <p className="text-sm text-slate-500 mb-5">
                                    Log in or create an account to {course.isPaid ? "purchase and " : ""}start learning.
                                </p>
                                <div className="flex justify-center gap-3">
                                    <Button asChild>
                                        <Link href={`/login?redirect=/courses/${id}`}>Log in</Link>
                                    </Button>
                                    <Button asChild variant="outline">
                                        <Link href="/register">Create account</Link>
                                    </Button>
                                </div>
                            </div>
                        ) : course.enrolled ? (
                            <div className="flex flex-wrap gap-3">
                                <Button asChild size="lg">
                                    <Link href={`/courses/${id}/learn`}>
                                        {completed ? "Review course" : "Continue learning"}
                                    </Link>
                                </Button>
                                {completed && (
                                    <Button asChild size="lg" variant="outline">
                                        <Link href={`/courses/${id}/certificate`}>
                                            <Award size={16} className="mr-2" /> View certificate
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <Button size="lg" onClick={handleEnroll} disabled={busy}>
                                {busy ? (
                                    <>
                                        <Loader2 size={16} className="mr-2 animate-spin" />
                                        {redirecting ? "Redirecting to payment..." : "Please wait..."}
                                    </>
                                ) : course.isPaid ? (
                                    `Buy course — ${price}`
                                ) : (
                                    "Enroll for free"
                                )}
                            </Button>
                        )}
                    </div>

                    {/* Module list */}
                    <h2 className="text-lg font-bold text-slate-900 mb-4">
                        Course content · {course.moduleCount} module{course.moduleCount === 1 ? "" : "s"}
                    </h2>
                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                        {(course.modules || []).map((m, i) => {
                            const done = course.progress?.completedModules?.includes(m._id);
                            return (
                                <div key={m._id} className="flex items-center gap-3 px-4 py-3.5 bg-white">
                                    <span className="text-sm font-semibold text-slate-400 w-6">{i + 1}</span>
                                    {m.type === "video" ? (
                                        <Video size={16} className="text-blue-500 shrink-0" />
                                    ) : (
                                        <FileText size={16} className="text-emerald-500 shrink-0" />
                                    )}
                                    <span className="text-slate-800 flex-1">{m.title}</span>
                                    {m.hasQuiz && (
                                        <span className="flex items-center gap-1 text-xs text-slate-400">
                                            <ListChecks size={14} /> Quiz
                                        </span>
                                    )}
                                    {done ? (
                                        <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                                    ) : !course.enrolled ? (
                                        <Lock size={14} className="text-slate-300 shrink-0" />
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
