"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    useAdminCourses,
    useCreateCourse,
    useDeleteCourse,
    useUpdateCourseStatus,
    useCourseEnrollments
} from "@/hooks/useCourses";
import { Course } from "@/app/api/courses/courses";
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
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Users, Pencil, Trash2, Search, Loader2, Award } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
    published: "bg-green-600",
    draft: "bg-slate-500",
    archived: "bg-red-600",
};

export default function AdminCoursesPage() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);

    const { data, isLoading } = useAdminCourses({ search: search || undefined, status: statusFilter, page, limit: 10 });
    const createMutation = useCreateCourse();
    const deleteMutation = useDeleteCourse();
    const statusMutation = useUpdateCourseStatus();

    const courses: (Course & { enrolledCount: number; completedCount: number; totalRevenue: number; modules: any[] })[] =
        data?.courses || [];
    const totalPages = data?.pagination?.pages || 1;

    // Create dialog (basics only; modules are added in the builder)
    const [createOpen, setCreateOpen] = useState(false);
    const [form, setForm] = useState({ title: "", description: "", isPaid: false, price: "", currency: "NGN" });
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Delete confirm
    const [deleting, setDeleting] = useState<Course | null>(null);

    // Enrollments dialog
    const [enrollmentsFor, setEnrollmentsFor] = useState<Course | null>(null);
    const { data: enrollmentsData, isLoading: enrollmentsLoading } = useCourseEnrollments(enrollmentsFor?._id);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim()) {
            toast.error("Title is required");
            return;
        }
        if (form.isPaid && (!form.price || Number(form.price) <= 0)) {
            toast.error("A price greater than 0 is required for paid courses");
            return;
        }

        const fd = new FormData();
        fd.append("title", form.title);
        fd.append("description", form.description);
        fd.append("isPaid", String(form.isPaid));
        fd.append("price", form.isPaid ? form.price : "0");
        fd.append("currency", form.currency);
        fd.append("status", "draft");
        if (imageFile) fd.append("image", imageFile);

        createMutation.mutate(fd, {
            onSuccess: (res) => {
                toast.success("Course created. Now add modules");
                setCreateOpen(false);
                setForm({ title: "", description: "", isPaid: false, price: "", currency: "NGN" });
                setImageFile(null);
                router.push(`/admin/courses/${res.course._id}`);
            },
            onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to create course"),
        });
    };

    const handleDelete = () => {
        if (!deleting) return;
        deleteMutation.mutate(deleting._id, {
            onSuccess: () => {
                toast.success("Course deleted");
                setDeleting(null);
            },
            onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to delete course"),
        });
    };

    return (
        <div className="p-6 md:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Courses</h1>
                    <p className="text-sm text-slate-500">Create and manage LMS courses, modules and quizzes.</p>
                </div>
                <Button onClick={() => setCreateOpen(true)}>
                    <Plus size={16} className="mr-2" /> New course
                </Button>
            </div>

            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-52">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input
                        placeholder="Search courses..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
                <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                    <SelectTrigger className="w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="bg-white border border-slate-100 rounded-xl overflow-x-auto">
                {isLoading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="animate-spin text-primary" size={32} />
                    </div>
                ) : courses.length === 0 ? (
                    <p className="text-center text-slate-500 py-16">No courses yet. Create your first course.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Course</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Modules</TableHead>
                                <TableHead>Enrolled</TableHead>
                                <TableHead>Revenue</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {courses.map((c) => (
                                <TableRow key={c._id}>
                                    <TableCell className="font-medium max-w-64">
                                        <span className="line-clamp-1">{c.title}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={c.status}
                                            onValueChange={(status) =>
                                                statusMutation.mutate(
                                                    { courseId: c._id, status },
                                                    {
                                                        onSuccess: () => toast.success("Status updated"),
                                                        onError: (err: any) =>
                                                            toast.error(err?.response?.data?.message || "Failed to update status"),
                                                    }
                                                )
                                            }
                                        >
                                            <SelectTrigger className="w-32 h-8">
                                                <Badge className={STATUS_COLORS[c.status]}>{c.status}</Badge>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="draft">Draft</SelectItem>
                                                <SelectItem value="published">Published</SelectItem>
                                                <SelectItem value="archived">Archived</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        {c.isPaid ? `${c.currency === "NGN" ? "₦" : c.currency}${c.price.toLocaleString()}` : "Free"}
                                    </TableCell>
                                    <TableCell>{c.modules?.length ?? 0}</TableCell>
                                    <TableCell>
                                        {c.enrolledCount}
                                        {c.completedCount > 0 && (
                                            <span className="text-xs text-green-600 ml-1.5 inline-flex items-center gap-0.5">
                                                <Award size={12} /> {c.completedCount}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {c.totalRevenue > 0
                                            ? `${c.currency === "NGN" ? "₦" : c.currency}${c.totalRevenue.toLocaleString()}`
                                            : "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" title="Enrolled members" onClick={() => setEnrollmentsFor(c)}>
                                                <Users size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                title="Edit course"
                                                onClick={() => router.push(`/admin/courses/${c._id}`)}
                                            >
                                                <Pencil size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                title="Delete course"
                                                className="text-red-500 hover:text-red-600"
                                                onClick={() => setDeleting(c)}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                        Previous
                    </Button>
                    <span className="flex items-center text-sm text-slate-500">
                        Page {page} of {totalPages}
                    </span>
                    <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                        Next
                    </Button>
                </div>
            )}

            {/* Create dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>New course</DialogTitle>
                        <DialogDescription>Set the basics. You&apos;ll add modules and quizzes next.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                rows={3}
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="image">Cover image</Label>
                            <Input id="image" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                id="isPaid"
                                type="checkbox"
                                checked={form.isPaid}
                                onChange={(e) => setForm({ ...form, isPaid: e.target.checked })}
                                className="h-4 w-4"
                            />
                            <Label htmlFor="isPaid">Paid course</Label>
                            {form.isPaid && (
                                <Input
                                    type="number"
                                    min="0"
                                    placeholder="Price (NGN)"
                                    className="w-40"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                                />
                            )}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createMutation.isPending}>
                                {createMutation.isPending && <Loader2 size={14} className="mr-2 animate-spin" />}
                                Create & add modules
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete confirm */}
            <Dialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete course?</DialogTitle>
                        <DialogDescription>
                            &quot;{deleting?.title}&quot; and its module videos will be permanently deleted. Courses with enrolled
                            members cannot be deleted; archive them instead.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleting(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
                            {deleteMutation.isPending && <Loader2 size={14} className="mr-2 animate-spin" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Enrollments dialog */}
            <Dialog open={!!enrollmentsFor} onOpenChange={(open) => !open && setEnrollmentsFor(null)}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Enrolled members: {enrollmentsFor?.title}</DialogTitle>
                    </DialogHeader>
                    {enrollmentsLoading ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="animate-spin text-primary" size={28} />
                        </div>
                    ) : (enrollmentsData?.enrollments || []).length === 0 ? (
                        <p className="text-center text-slate-500 py-10">No enrollments yet.</p>
                    ) : (
                        <div className="max-h-[60vh] overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Member</TableHead>
                                        <TableHead>Payment</TableHead>
                                        <TableHead>Progress</TableHead>
                                        <TableHead>Certificate</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {enrollmentsData.enrollments.map((e: any) => (
                                        <TableRow key={e._id}>
                                            <TableCell>
                                                <p className="font-medium">{e.user?.name || "-"}</p>
                                                <p className="text-xs text-slate-500">{e.user?.email || ""}</p>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={e.paymentStatus === "free" ? "bg-slate-500" : e.paymentStatus === "successful" ? "bg-green-600" : "bg-amber-600"}>
                                                    {e.paymentStatus}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{e.progress}</TableCell>
                                            <TableCell>{e.certificateId || "-"}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
