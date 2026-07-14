"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    useAdminCourse,
    useUpdateCourse,
    useAddModule,
    useUpdateModule,
    useDeleteModule,
    useReorderModules
} from "@/hooks/useCourses";
import { uploadCourseVideo, AdminModulePayload } from "@/app/api/courses/courses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import {
    Plus, Pencil, Trash2, Loader2, ChevronLeft, ChevronUp, ChevronDown, Video, FileText, ListChecks, Upload, X
} from "lucide-react";

const MAX_VIDEO_MB = 50;

interface QuizQuestionForm {
    question: string;
    options: string[];
    correctIndex: number;
}

interface ModuleForm {
    title: string;
    type: "video" | "text";
    videoKey: string;
    textBody: string;
    hasQuiz: boolean;
    passMark: string;
    questions: QuizQuestionForm[];
}

const emptyModule: ModuleForm = {
    title: "",
    type: "video",
    videoKey: "",
    textBody: "",
    hasQuiz: false,
    passMark: "50",
    questions: []
};

const emptyQuestion: QuizQuestionForm = { question: "", options: ["", ""], correctIndex: 0 };

function ModuleDialog({
    open,
    onClose,
    onSave,
    saving,
    initial
}: {
    open: boolean;
    onClose: () => void;
    onSave: (payload: AdminModulePayload) => void;
    saving: boolean;
    initial: ModuleForm;
}) {
    const [form, setForm] = useState<ModuleForm>(initial);
    const [uploading, setUploading] = useState(false);
    const [uploadPercent, setUploadPercent] = useState(0);

    useEffect(() => {
        if (open) setForm(initial);
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleVideoFile = async (file: File | null) => {
        if (!file) return;
        if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
            toast.error(`Video must be under ${MAX_VIDEO_MB}MB. Export at 720p and keep lessons to 4-6 minutes.`);
            return;
        }
        setUploading(true);
        setUploadPercent(0);
        try {
            const videoKey = await uploadCourseVideo(file, setUploadPercent);
            setForm((f) => ({ ...f, videoKey }));
            toast.success("Video uploaded");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Video upload failed");
        } finally {
            setUploading(false);
        }
    };

    const setQuestion = (qi: number, updater: (q: QuizQuestionForm) => QuizQuestionForm) =>
        setForm((f) => ({ ...f, questions: f.questions.map((q, i) => (i === qi ? updater(q) : q)) }));

    const handleSave = () => {
        if (!form.title.trim()) return toast.error("Module title is required");
        if (form.type === "video" && !form.videoKey) return toast.error("Upload a video for this module");
        if (form.type === "text" && !form.textBody.trim()) return toast.error("Content is required for text modules");
        if (form.hasQuiz) {
            if (form.questions.length === 0) return toast.error("Add at least one quiz question");
            for (const q of form.questions) {
                if (!q.question.trim()) return toast.error("Every question needs text");
                if (q.options.some((o) => !o.trim())) return toast.error("Every option needs text");
            }
        }

        onSave({
            title: form.title,
            type: form.type,
            videoKey: form.type === "video" ? form.videoKey : undefined,
            textBody: form.textBody || undefined,
            quiz: form.hasQuiz
                ? {
                    passMark: Math.min(100, Math.max(0, Number(form.passMark) || 50)),
                    questions: form.questions.map((q) => ({
                        question: q.question,
                        options: q.options,
                        correctIndex: q.correctIndex
                    }))
                }
                : null
        });
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{initial.title ? "Edit module" : "Add module"}</DialogTitle>
                    <DialogDescription>
                        A module is one lesson: a short video (max {MAX_VIDEO_MB}MB, ~4-6 min at 720p) and/or text, with an
                        optional quiz.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label>Title</Label>
                        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                    </div>

                    <div>
                        <Label>Type</Label>
                        <Select value={form.type} onValueChange={(v: "video" | "text") => setForm({ ...form, type: v })}>
                            <SelectTrigger className="w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="video">Video lesson</SelectItem>
                                <SelectItem value="text">Text lesson</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {form.type === "video" && (
                        <div>
                            <Label>Video</Label>
                            {form.videoKey ? (
                                <div className="flex items-center gap-2 text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                                    <Video size={16} className="text-blue-500" />
                                    <span className="flex-1 truncate text-slate-600">{form.videoKey.split("/").pop()}</span>
                                    <button type="button" onClick={() => setForm({ ...form, videoKey: "" })} className="text-slate-400 hover:text-red-500">
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : uploading ? (
                                <div className="border border-slate-200 rounded-lg px-4 py-3">
                                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                                        <Upload size={14} className="animate-pulse" /> Uploading... {uploadPercent}%
                                    </div>
                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${uploadPercent}%` }} />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={(e) => handleVideoFile(e.target.files?.[0] || null)} />
                                    <p className="text-xs text-slate-400 mt-1">
                                        Max {MAX_VIDEO_MB}MB. Recommended 4-6 minutes at 720p (mp4)
                                    </p>
                                </>
                            )}
                        </div>
                    )}

                    <div>
                        <Label>{form.type === "text" ? "Lesson content" : "Notes (optional)"}</Label>
                        <Textarea
                            rows={form.type === "text" ? 8 : 3}
                            value={form.textBody}
                            onChange={(e) => setForm({ ...form, textBody: e.target.value })}
                            placeholder={form.type === "text" ? "Write the lesson content..." : "Optional notes shown under the video..."}
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <input
                            id="hasQuiz"
                            type="checkbox"
                            className="h-4 w-4"
                            checked={form.hasQuiz}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    hasQuiz: e.target.checked,
                                    questions: e.target.checked && form.questions.length === 0 ? [{ ...emptyQuestion, options: ["", ""] }] : form.questions
                                })
                            }
                        />
                        <Label htmlFor="hasQuiz">This module has a quiz/exam</Label>
                        {form.hasQuiz && (
                            <div className="flex items-center gap-2 ml-auto">
                                <Label className="text-xs text-slate-500">Pass mark %</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="w-20 h-8"
                                    value={form.passMark}
                                    onChange={(e) => setForm({ ...form, passMark: e.target.value })}
                                />
                            </div>
                        )}
                    </div>

                    {form.hasQuiz && (
                        <div className="space-y-4 border border-slate-200 rounded-xl p-4">
                            {form.questions.map((q, qi) => (
                                <div key={qi} className="space-y-2 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-slate-500">Q{qi + 1}</span>
                                        <Input
                                            placeholder="Question text"
                                            value={q.question}
                                            onChange={(e) => setQuestion(qi, (old) => ({ ...old, question: e.target.value }))}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 shrink-0"
                                            onClick={() => setForm((f) => ({ ...f, questions: f.questions.filter((_, i) => i !== qi) }))}
                                        >
                                            <Trash2 size={15} />
                                        </Button>
                                    </div>
                                    {q.options.map((opt, oi) => (
                                        <div key={oi} className="flex items-center gap-2 pl-7">
                                            <input
                                                type="radio"
                                                title="Correct answer"
                                                name={`correct-${qi}`}
                                                checked={q.correctIndex === oi}
                                                onChange={() => setQuestion(qi, (old) => ({ ...old, correctIndex: oi }))}
                                            />
                                            <Input
                                                placeholder={`Option ${oi + 1}`}
                                                className="h-8"
                                                value={opt}
                                                onChange={(e) =>
                                                    setQuestion(qi, (old) => ({
                                                        ...old,
                                                        options: old.options.map((o, i) => (i === oi ? e.target.value : o))
                                                    }))
                                                }
                                            />
                                            {q.options.length > 2 && (
                                                <button
                                                    type="button"
                                                    className="text-slate-400 hover:text-red-500"
                                                    onClick={() =>
                                                        setQuestion(qi, (old) => ({
                                                            ...old,
                                                            options: old.options.filter((_, i) => i !== oi),
                                                            correctIndex: old.correctIndex >= oi && old.correctIndex > 0 ? old.correctIndex - 1 : old.correctIndex
                                                        }))
                                                    }
                                                >
                                                    <X size={14} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <div className="pl-7">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-xs"
                                            onClick={() => setQuestion(qi, (old) => ({ ...old, options: [...old.options, ""] }))}
                                        >
                                            <Plus size={12} className="mr-1" /> Add option
                                        </Button>
                                    </div>
                                    <p className="text-xs text-slate-400 pl-7">Select the radio button next to the correct answer.</p>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setForm((f) => ({ ...f, questions: [...f.questions, { ...emptyQuestion, options: ["", ""] }] }))}
                            >
                                <Plus size={14} className="mr-1" /> Add question
                            </Button>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSave} disabled={saving || uploading}>
                        {saving && <Loader2 size={14} className="mr-2 animate-spin" />}
                        Save module
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function AdminCourseBuilderPage() {
    const params = useParams();
    const router = useRouter();
    const id = Array.isArray(params.id) ? params.id[0] : (params.id as string);

    const { data: course, isLoading } = useAdminCourse(id);
    const updateMutation = useUpdateCourse();
    const addModuleMutation = useAddModule();
    const updateModuleMutation = useUpdateModule();
    const deleteModuleMutation = useDeleteModule();
    const reorderMutation = useReorderModules();

    // Basics form
    const [basics, setBasics] = useState({ title: "", description: "", isPaid: false, price: "", status: "draft" });
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        if (course) {
            setBasics({
                title: course.title,
                description: course.description || "",
                isPaid: course.isPaid,
                price: course.price ? String(course.price) : "",
                status: course.status
            });
        }
    }, [course?._id]); // eslint-disable-line react-hooks/exhaustive-deps

    // Module dialog
    const [moduleOpen, setModuleOpen] = useState(false);
    const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
    const [moduleInitial, setModuleInitial] = useState<ModuleForm>(emptyModule);

    if (isLoading || !course) {
        return (
            <div className="flex justify-center py-24">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    const openAddModule = () => {
        setEditingModuleId(null);
        setModuleInitial({ ...emptyModule, questions: [] });
        setModuleOpen(true);
    };

    const openEditModule = (m: any) => {
        setEditingModuleId(m._id);
        setModuleInitial({
            title: m.title,
            type: m.type,
            videoKey: m.videoKey || "",
            textBody: m.textBody || "",
            hasQuiz: !!(m.quiz && m.quiz.questions?.length),
            passMark: String(m.quiz?.passMark ?? 50),
            questions: (m.quiz?.questions || []).map((q: any) => ({
                question: q.question,
                options: [...q.options],
                correctIndex: q.correctIndex
            }))
        });
        setModuleOpen(true);
    };

    const handleSaveModule = (payload: AdminModulePayload) => {
        const opts = {
            onSuccess: () => {
                toast.success(editingModuleId ? "Module updated" : "Module added");
                setModuleOpen(false);
            },
            onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to save module")
        };
        if (editingModuleId) {
            updateModuleMutation.mutate({ courseId: id!, moduleId: editingModuleId, module: payload }, opts);
        } else {
            addModuleMutation.mutate({ courseId: id!, module: payload }, opts);
        }
    };

    const moveModule = (index: number, direction: -1 | 1) => {
        const ids: string[] = course.modules.map((m: any) => String(m._id));
        const target = index + direction;
        if (target < 0 || target >= ids.length) return;
        [ids[index], ids[target]] = [ids[target], ids[index]];
        reorderMutation.mutate(
            { courseId: id!, moduleIds: ids },
            { onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to reorder modules") }
        );
    };

    const handleSaveBasics = (e: React.FormEvent) => {
        e.preventDefault();
        if (!basics.title.trim()) return toast.error("Title is required");
        if (basics.isPaid && (!basics.price || Number(basics.price) <= 0)) {
            return toast.error("A price greater than 0 is required for paid courses");
        }

        const fd = new FormData();
        fd.append("title", basics.title);
        fd.append("description", basics.description);
        fd.append("isPaid", String(basics.isPaid));
        fd.append("price", basics.isPaid ? basics.price : "0");
        fd.append("status", basics.status);
        if (imageFile) fd.append("image", imageFile);

        updateMutation.mutate(
            { courseId: id!, data: fd },
            {
                onSuccess: () => toast.success("Course updated"),
                onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to update course")
            }
        );
    };

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-4xl">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => router.push("/admin/courses")}>
                    <ChevronLeft size={18} />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{course.title}</h1>
                    <p className="text-sm text-slate-500">Edit course details, modules and quizzes.</p>
                </div>
                <Badge className={`ml-auto ${course.status === "published" ? "bg-green-600" : course.status === "draft" ? "bg-slate-500" : "bg-red-600"}`}>
                    {course.status}
                </Badge>
            </div>

            {/* Basics */}
            <form onSubmit={handleSaveBasics} className="bg-white border border-slate-100 rounded-xl p-6 space-y-4">
                <h2 className="font-bold text-slate-900">Course details</h2>
                <div>
                    <Label>Title</Label>
                    <Input value={basics.title} onChange={(e) => setBasics({ ...basics, title: e.target.value })} />
                </div>
                <div>
                    <Label>Description</Label>
                    <Textarea rows={3} value={basics.description} onChange={(e) => setBasics({ ...basics, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <Label>Cover image {course.imageUrl && <span className="text-xs text-slate-400">(replace)</span>}</Label>
                        <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                    </div>
                    <div>
                        <Label>Status</Label>
                        <Select value={basics.status} onValueChange={(v) => setBasics({ ...basics, status: v })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft (hidden)</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        id="basicsPaid"
                        type="checkbox"
                        className="h-4 w-4"
                        checked={basics.isPaid}
                        onChange={(e) => setBasics({ ...basics, isPaid: e.target.checked })}
                    />
                    <Label htmlFor="basicsPaid">Paid course</Label>
                    {basics.isPaid && (
                        <Input
                            type="number"
                            min="0"
                            placeholder="Price (NGN)"
                            className="w-40"
                            value={basics.price}
                            onChange={(e) => setBasics({ ...basics, price: e.target.value })}
                        />
                    )}
                </div>
                <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending && <Loader2 size={14} className="mr-2 animate-spin" />}
                    Save details
                </Button>
            </form>

            {/* Modules */}
            <div className="bg-white border border-slate-100 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-slate-900">Modules ({course.modules?.length || 0})</h2>
                    <Button size="sm" onClick={openAddModule}>
                        <Plus size={14} className="mr-1" /> Add module
                    </Button>
                </div>

                {(course.modules || []).length === 0 ? (
                    <p className="text-center text-slate-500 py-10 text-sm">
                        No modules yet. Add your first lesson. Members work through modules in the order listed here.
                    </p>
                ) : (
                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
                        {course.modules.map((m: any, i: number) => (
                            <div key={m._id} className="flex items-center gap-3 px-4 py-3 bg-white">
                                <span className="text-sm font-semibold text-slate-400 w-6">{i + 1}</span>
                                {m.type === "video" ? (
                                    <Video size={16} className="text-blue-500 shrink-0" />
                                ) : (
                                    <FileText size={16} className="text-emerald-500 shrink-0" />
                                )}
                                <span className="flex-1 text-slate-800">{m.title}</span>
                                {m.quiz?.questions?.length > 0 && (
                                    <span className="flex items-center gap-1 text-xs text-slate-400">
                                        <ListChecks size={14} /> {m.quiz.questions.length} question{m.quiz.questions.length === 1 ? "" : "s"}
                                    </span>
                                )}
                                <div className="flex flex-col">
                                    <button
                                        type="button"
                                        title="Move up"
                                        disabled={i === 0 || reorderMutation.isPending}
                                        onClick={() => moveModule(i, -1)}
                                        className="text-slate-400 hover:text-primary disabled:opacity-25 disabled:hover:text-slate-400"
                                    >
                                        <ChevronUp size={15} />
                                    </button>
                                    <button
                                        type="button"
                                        title="Move down"
                                        disabled={i === course.modules.length - 1 || reorderMutation.isPending}
                                        onClick={() => moveModule(i, 1)}
                                        className="text-slate-400 hover:text-primary disabled:opacity-25 disabled:hover:text-slate-400"
                                    >
                                        <ChevronDown size={15} />
                                    </button>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => openEditModule(m)}>
                                    <Pencil size={15} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500"
                                    disabled={deleteModuleMutation.isPending}
                                    onClick={() => {
                                        if (window.confirm(`Delete module "${m.title}"?`)) {
                                            deleteModuleMutation.mutate(
                                                { courseId: id!, moduleId: m._id },
                                                {
                                                    onSuccess: () => toast.success("Module deleted"),
                                                    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to delete module")
                                                }
                                            );
                                        }
                                    }}
                                >
                                    <Trash2 size={15} />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ModuleDialog
                open={moduleOpen}
                onClose={() => setModuleOpen(false)}
                onSave={handleSaveModule}
                saving={addModuleMutation.isPending || updateModuleMutation.isPending}
                initial={moduleInitial}
            />
        </div>
    );
}
