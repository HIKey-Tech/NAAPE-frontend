"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useCourseContent, useCompleteModule, useSubmitQuiz } from "@/hooks/useCourses";
import { getModuleVideoUrl, CourseLearnModule, CourseProgress } from "@/app/api/courses/courses";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Video,
    FileText,
    CheckCircle2,
    Circle,
    Award,
    Loader2,
    ChevronLeft,
    ListChecks
} from "lucide-react";

function ModuleVideo({ courseId, moduleId }: { courseId: string; moduleId: string }) {
    const { data: url, isLoading, isError } = useQuery({
        queryKey: ["module-video", courseId, moduleId],
        queryFn: () => getModuleVideoUrl(courseId, moduleId),
        staleTime: 60 * 60 * 1000 // signed URL lives 2h; refetch after 1h
    });

    if (isLoading) {
        return (
            <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center">
                <Loader2 className="animate-spin text-white/60" size={40} />
            </div>
        );
    }
    if (isError || !url) {
        return (
            <div className="aspect-video bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                Failed to load video.
            </div>
        );
    }
    return (
        <video
            key={url}
            src={url}
            controls
            controlsList="nodownload"
            className="w-full aspect-video rounded-xl bg-black"
        />
    );
}

function QuizSection({
    courseId,
    module,
    progress
}: {
    courseId: string;
    module: CourseLearnModule;
    progress: CourseProgress;
}) {
    const quiz = module.quiz!;
    const submitMutation = useSubmitQuiz(courseId);
    const [answers, setAnswers] = useState<(number | null)[]>(quiz.questions.map(() => null));
    const [result, setResult] = useState<{ score: number; passed: boolean; correct: number; total: number } | null>(null);

    useEffect(() => {
        setAnswers(quiz.questions.map(() => null));
        setResult(null);
    }, [module._id, quiz.questions.length]); // eslint-disable-line react-hooks/exhaustive-deps

    const existing = progress.quizResults.find((r) => r.module === module._id);

    const handleSubmit = async () => {
        if (answers.some((a) => a === null)) {
            toast.error("Please answer every question");
            return;
        }
        try {
            const res = await submitMutation.mutateAsync({ moduleId: module._id, answers: answers as number[] });
            setResult(res);
            if (res.passed) toast.success(`Passed with ${res.score}%`);
            else toast.error(`Scored ${res.score}% — pass mark is ${res.passMark}%`);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to submit quiz");
        }
    };

    return (
        <div className="bg-white border border-slate-100 rounded-xl p-6 mt-6">
            <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <ListChecks size={18} className="text-primary" />
                    {quiz.questions.length > 3 ? "Exam" : "Quiz"}
                </h3>
                <span className="text-xs text-slate-400 font-medium">Pass mark: {quiz.passMark}%</span>
            </div>
            {existing?.passed && !result && (
                <p className="text-sm text-green-600 font-medium mb-4 flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Passed with {existing.score}%
                </p>
            )}
            <div className="space-y-6 mt-4">
                {quiz.questions.map((q, qi) => (
                    <div key={q._id}>
                        <p className="font-medium text-slate-800 mb-3">
                            {qi + 1}. {q.question}
                        </p>
                        <div className="space-y-2">
                            {q.options.map((opt, oi) => (
                                <label
                                    key={oi}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                                        answers[qi] === oi
                                            ? "border-primary bg-primary/5"
                                            : "border-slate-200 hover:border-slate-300"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name={`q-${q._id}`}
                                        checked={answers[qi] === oi}
                                        onChange={() => {
                                            const next = [...answers];
                                            next[qi] = oi;
                                            setAnswers(next);
                                        }}
                                        className="accent-[var(--primary,#1d4ed8)]"
                                    />
                                    <span className="text-slate-700 text-sm">{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {result && (
                <div
                    className={`mt-6 rounded-lg p-4 text-sm font-medium ${
                        result.passed ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}
                >
                    {result.passed
                        ? `You passed! Score: ${result.score}% (${result.correct}/${result.total} correct)`
                        : `You scored ${result.score}% (${result.correct}/${result.total} correct). Try again.`}
                </div>
            )}

            <Button className="mt-6" onClick={handleSubmit} disabled={submitMutation.isPending}>
                {submitMutation.isPending ? (
                    <>
                        <Loader2 size={14} className="mr-2 animate-spin" /> Submitting...
                    </>
                ) : result || existing ? (
                    "Retake quiz"
                ) : (
                    "Submit answers"
                )}
            </Button>
        </div>
    );
}

export default function CourseLearnPage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : (params.id as string);

    const { data: course, isLoading, isError, error } = useCourseContent(id);
    const completeMutation = useCompleteModule(id || "");
    const [activeIdx, setActiveIdx] = useState(0);

    // Land on the first incomplete module
    useEffect(() => {
        if (course) {
            const done = new Set(course.progress.completedModules);
            const firstIncomplete = course.modules.findIndex((m) => !done.has(m._id));
            setActiveIdx(firstIncomplete === -1 ? 0 : firstIncomplete);
        }
    }, [course?._id]); // eslint-disable-line react-hooks/exhaustive-deps

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (isError || !course) {
        const notEnrolled = (error as any)?.response?.status === 403;
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 text-center max-w-md">
                    <p className="text-lg font-medium text-slate-700 mb-4">
                        {notEnrolled ? "You are not enrolled in this course." : "Failed to load course."}
                    </p>
                    <Link href={`/courses/${id}`} className="text-primary font-semibold hover:underline">
                        Go to course page
                    </Link>
                </div>
            </div>
        );
    }

    const doneSet = new Set(course.progress.completedModules);
    const module = course.modules[activeIdx];
    const moduleDone = module && doneSet.has(module._id);
    const courseCompleted = !!course.progress.completedAt;
    const hasQuiz = !!module?.quiz;

    const handleMarkComplete = async () => {
        try {
            await completeMutation.mutateAsync(module._id);
            toast.success("Module completed");
            if (activeIdx < course.modules.length - 1) setActiveIdx(activeIdx + 1);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to update progress");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 w-full pt-24 pb-16 px-4">
            <div className="max-w-6xl mx-auto">
                <Link
                    href={`/courses/${id}`}
                    className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary mb-4"
                >
                    <ChevronLeft size={16} /> {course.title}
                </Link>

                {courseCompleted && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-green-800 font-medium flex items-center gap-2">
                            <Award size={18} /> Congratulations — you completed this course!
                        </p>
                        <Button asChild size="sm" variant="outline" className="border-green-300 text-green-800 hover:bg-green-100">
                            <Link href={`/courses/${id}/certificate`}>View certificate</Link>
                        </Button>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
                    {/* Module sidebar */}
                    <aside className="bg-white border border-slate-100 rounded-xl overflow-hidden h-fit lg:sticky lg:top-24">
                        <div className="px-4 py-3 border-b border-slate-100">
                            <p className="text-sm font-bold text-slate-900">Modules</p>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {course.progress.completedModules.length}/{course.modules.length} completed
                            </p>
                            <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full transition-all"
                                    style={{
                                        width: `${(course.progress.completedModules.length / Math.max(course.modules.length, 1)) * 100}%`
                                    }}
                                />
                            </div>
                        </div>
                        <nav className="divide-y divide-slate-50 max-h-[60vh] overflow-y-auto">
                            {course.modules.map((m, i) => (
                                <button
                                    key={m._id}
                                    onClick={() => setActiveIdx(i)}
                                    className={`w-full flex items-center gap-2.5 px-4 py-3 text-left text-sm transition-colors ${
                                        i === activeIdx ? "bg-primary/5 text-primary font-semibold" : "text-slate-700 hover:bg-slate-50"
                                    }`}
                                >
                                    {doneSet.has(m._id) ? (
                                        <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                                    ) : (
                                        <Circle size={16} className="text-slate-300 shrink-0" />
                                    )}
                                    <span className="flex-1 line-clamp-2">{m.title}</span>
                                    {m.type === "video" ? (
                                        <Video size={14} className="text-slate-400 shrink-0" />
                                    ) : (
                                        <FileText size={14} className="text-slate-400 shrink-0" />
                                    )}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Content pane */}
                    <main>
                        {module ? (
                            <>
                                <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">
                                    {activeIdx + 1}. {module.title}
                                </h1>

                                {module.type === "video" && module.hasVideo && (
                                    <ModuleVideo courseId={id!} moduleId={module._id} />
                                )}

                                {module.textBody && (
                                    <div className="bg-white border border-slate-100 rounded-xl p-6 mt-4 text-slate-700 whitespace-pre-line leading-relaxed">
                                        {module.textBody}
                                    </div>
                                )}

                                {hasQuiz && (
                                    <QuizSection courseId={id!} module={module} progress={course.progress} />
                                )}

                                {!hasQuiz && !moduleDone && (
                                    <Button className="mt-6" onClick={handleMarkComplete} disabled={completeMutation.isPending}>
                                        {completeMutation.isPending ? (
                                            <>
                                                <Loader2 size={14} className="mr-2 animate-spin" /> Saving...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 size={14} className="mr-2" /> Mark as completed
                                            </>
                                        )}
                                    </Button>
                                )}

                                {moduleDone && activeIdx < course.modules.length - 1 && (
                                    <Button className="mt-6" variant="outline" onClick={() => setActiveIdx(activeIdx + 1)}>
                                        Next module
                                    </Button>
                                )}
                            </>
                        ) : (
                            <div className="bg-white border border-slate-100 rounded-xl p-10 text-center text-slate-500">
                                This course has no modules yet.
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
