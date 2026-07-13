"use client";

import { useState } from "react";
import {
    useAdminTrainings,
    useCreateTraining,
    useUpdateTraining,
    useDeleteTraining,
    useUpdateTrainingStatus,
    useTrainingRegistrants,
} from "@/hooks/useTrainings";
import { exportTrainingRegistrants, Training } from "@/app/api/trainings/trainings";
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
import { Plus, Download, Users, Pencil, Trash2, Search, Loader2 } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
    published: "bg-green-600",
    draft: "bg-slate-500",
    cancelled: "bg-red-600",
    completed: "bg-blue-600",
};

const emptyForm = {
    title: "",
    description: "",
    date: "",
    type: "online" as "online" | "in-person",
    address: "",
    meetingLink: "",
    isPaid: false,
    price: "",
    memberPrice: "",
    currency: "NGN",
    maxCapacity: "",
    registrationDeadline: "",
    status: "published",
};

type FormState = typeof emptyForm;

function trainingToForm(t: Training): FormState {
    const toLocalInput = (d?: string) => {
        if (!d) return "";
        const dt = new Date(d);
        dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
        return dt.toISOString().slice(0, 16);
    };
    return {
        title: t.title,
        description: t.description || "",
        date: toLocalInput(t.date),
        type: t.type,
        address: t.address || "",
        meetingLink: (t as any).meetingLink || "",
        isPaid: t.isPaid,
        price: t.price ? String(t.price) : "",
        memberPrice: t.memberPrice != null ? String(t.memberPrice) : "",
        currency: t.currency || "NGN",
        maxCapacity: t.maxCapacity != null ? String(t.maxCapacity) : "",
        registrationDeadline: toLocalInput(t.registrationDeadline),
        status: t.status,
    };
}

export default function AdminTrainingsPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);

    const { data, isLoading } = useAdminTrainings({ search: search || undefined, status: statusFilter, page, limit: 10 });
    const createMutation = useCreateTraining();
    const updateMutation = useUpdateTraining();
    const deleteMutation = useDeleteTraining();
    const statusMutation = useUpdateTrainingStatus();

    const trainings: (Training & { registrantCount: number; totalRevenue: number })[] = data?.trainings || [];
    const totalPages = data?.pagination?.pages || 1;

    // Create/edit dialog
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<Training | null>(null);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Registrants dialog
    const [registrantsFor, setRegistrantsFor] = useState<Training | null>(null);
    const { data: registrantsData, isLoading: registrantsLoading } = useTrainingRegistrants(registrantsFor?._id);

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setImageFile(null);
        setFormOpen(true);
    };

    const openEdit = (t: Training) => {
        setEditing(t);
        setForm(trainingToForm(t));
        setImageFile(null);
        setFormOpen(true);
    };

    const set = (key: keyof FormState, value: any) => setForm((f) => ({ ...f, [key]: value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (form.type === "in-person" && !form.address.trim()) {
            toast.error("Address is required for in-person trainings");
            return;
        }
        if (form.type === "online" && !form.meetingLink.trim()) {
            toast.error("Meeting link is required for online trainings");
            return;
        }
        if (form.isPaid && (!form.price || Number(form.price) <= 0)) {
            toast.error("A price greater than 0 is required for paid trainings");
            return;
        }

        const fd = new FormData();
        fd.append("title", form.title);
        fd.append("description", form.description);
        fd.append("date", new Date(form.date).toISOString());
        fd.append("type", form.type);
        fd.append("address", form.type === "in-person" ? form.address : "");
        fd.append("meetingLink", form.type === "online" ? form.meetingLink : "");
        fd.append("isPaid", String(form.isPaid));
        fd.append("price", form.isPaid ? form.price : "0");
        if (form.isPaid && form.memberPrice) fd.append("memberPrice", form.memberPrice);
        fd.append("currency", form.currency);
        if (form.maxCapacity) fd.append("maxCapacity", form.maxCapacity);
        if (form.registrationDeadline) fd.append("registrationDeadline", new Date(form.registrationDeadline).toISOString());
        fd.append("status", form.status);
        if (imageFile) fd.append("image", imageFile);

        const onDone = {
            onSuccess: () => {
                toast.success(editing ? "Training updated" : "Training created");
                setFormOpen(false);
            },
            onError: (err: any) => toast.error(err?.response?.data?.message || err?.message || "Failed to save training"),
        };

        if (editing) {
            updateMutation.mutate({ trainingId: editing._id, data: fd }, onDone);
        } else {
            createMutation.mutate(fd, onDone);
        }
    };

    const handleDelete = (t: Training) => {
        if (!window.confirm(`Delete "${t.title}"? This cannot be undone.`)) return;
        deleteMutation.mutate(t._id, {
            onSuccess: () => toast.success("Training deleted"),
            onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to delete"),
        });
    };

    const handleExport = async (t: Training) => {
        try {
            await exportTrainingRegistrants(t._id, t.title);
            toast.success("CSV downloaded");
        } catch {
            toast.error("Failed to export registrants");
        }
    };

    const saving = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Trainings</h1>
                    <p className="text-sm text-slate-500">Create and manage trainings, view registrants, export CSVs.</p>
                </div>
                <Button onClick={openCreate}>
                    <Plus size={16} className="mr-1" /> New Training
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input placeholder="Search trainings..." className="pl-9" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
                </div>
                <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-x-auto">
                {isLoading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="animate-spin text-primary" size={28} />
                    </div>
                ) : trainings.length === 0 ? (
                    <div className="text-center text-slate-400 py-16">No trainings yet. Create your first one.</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Format</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Registrants</TableHead>
                                <TableHead>Revenue</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {trainings.map((t) => (
                                <TableRow key={t._id}>
                                    <TableCell className="font-medium max-w-[220px] truncate">{t.title}</TableCell>
                                    <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{t.type === "online" ? "Online" : "In-Person"}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {t.isPaid ? `${t.currency === "NGN" ? "₦" : t.currency}${t.price.toLocaleString()}` : "Free"}
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={t.status}
                                            onValueChange={(status) =>
                                                statusMutation.mutate(
                                                    { trainingId: t._id, status },
                                                    {
                                                        onSuccess: () => toast.success("Status updated"),
                                                        onError: () => toast.error("Failed to update status"),
                                                    }
                                                )
                                            }
                                        >
                                            <SelectTrigger className="w-32 h-8">
                                                <Badge className={STATUS_COLORS[t.status]}>{t.status}</Badge>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="draft">Draft</SelectItem>
                                                <SelectItem value="published">Published</SelectItem>
                                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>{t.registrantCount}</TableCell>
                                    <TableCell>
                                        {t.totalRevenue ? `${t.currency === "NGN" ? "₦" : t.currency}${t.totalRevenue.toLocaleString()}` : "—"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="sm" title="View registrants" onClick={() => setRegistrantsFor(t)}>
                                                <Users size={15} />
                                            </Button>
                                            <Button variant="ghost" size="sm" title="Export CSV" onClick={() => handleExport(t)}>
                                                <Download size={15} />
                                            </Button>
                                            <Button variant="ghost" size="sm" title="Edit" onClick={() => openEdit(t)}>
                                                <Pencil size={15} />
                                            </Button>
                                            <Button variant="ghost" size="sm" title="Delete" className="text-red-600" onClick={() => handleDelete(t)}>
                                                <Trash2 size={15} />
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
                <div className="flex justify-center gap-2 mt-4">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                    <span className="flex items-center text-sm text-slate-500">Page {page} of {totalPages}</span>
                    <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
                </div>
            )}

            {/* Create/Edit dialog */}
            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editing ? "Edit Training" : "New Training"}</DialogTitle>
                        <DialogDescription>
                            {editing ? "Update the training details." : "Fill in the details to create a training."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input required value={form.title} onChange={(e) => set("title", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Date & time</Label>
                                <Input type="datetime-local" required value={form.date} onChange={(e) => set("date", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Registration deadline</Label>
                                <Input type="datetime-local" value={form.registrationDeadline} onChange={(e) => set("registrationDeadline", e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Format</Label>
                                <Select value={form.type} onValueChange={(v) => set("type", v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="online">Online</SelectItem>
                                        <SelectItem value="in-person">In-Person</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Max capacity (optional)</Label>
                                <Input type="number" min={1} value={form.maxCapacity} onChange={(e) => set("maxCapacity", e.target.value)} />
                            </div>
                        </div>
                        {form.type === "in-person" ? (
                            <div className="space-y-2">
                                <Label>Address</Label>
                                <Input required value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Venue address" />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Label>Meeting link</Label>
                                <Input required type="url" value={form.meetingLink} onChange={(e) => set("meetingLink", e.target.value)} placeholder="https://..." />
                                <p className="text-xs text-slate-500">Only shared with registrants via their confirmation email.</p>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label>Pricing</Label>
                            <Select value={form.isPaid ? "paid" : "free"} onValueChange={(v) => set("isPaid", v === "paid")}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="free">Free</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {form.isPaid && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Price (NGN)</Label>
                                    <Input type="number" min={1} required value={form.price} onChange={(e) => set("price", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Member price (optional)</Label>
                                    <Input type="number" min={0} value={form.memberPrice} onChange={(e) => set("memberPrice", e.target.value)} />
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={form.status} onValueChange={(v) => set("status", v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Image (optional)</Label>
                                <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={saving}>
                                {saving ? <Loader2 className="animate-spin" size={16} /> : editing ? "Save changes" : "Create training"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Registrants dialog */}
            <Dialog open={!!registrantsFor} onOpenChange={(open) => !open && setRegistrantsFor(null)}>
                <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Registrants — {registrantsFor?.title}</DialogTitle>
                        <DialogDescription>
                            {registrantsData?.registrants?.length || 0} total
                        </DialogDescription>
                    </DialogHeader>
                    {registrantsLoading ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="animate-spin text-primary" size={24} />
                        </div>
                    ) : (registrantsData?.registrants?.length || 0) === 0 ? (
                        <div className="text-center text-slate-400 py-10">No registrations yet.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Member</TableHead>
                                        <TableHead>Payment</TableHead>
                                        <TableHead>Registered</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {registrantsData.registrants.map((r: any) => (
                                        <TableRow key={r._id}>
                                            <TableCell className="font-medium">{r.name}</TableCell>
                                            <TableCell>{r.email}</TableCell>
                                            <TableCell>{r.phone || "—"}</TableCell>
                                            <TableCell>{r.isMember ? "Yes" : "No"}</TableCell>
                                            <TableCell>
                                                <Badge className={
                                                    r.paymentStatus === "successful" ? "bg-green-600"
                                                        : r.paymentStatus === "free" ? "bg-slate-500"
                                                        : r.paymentStatus === "pending" ? "bg-amber-500"
                                                        : "bg-red-600"
                                                }>
                                                    {r.paymentStatus}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{new Date(r.registeredAt).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                    <DialogFooter>
                        {registrantsFor && (
                            <Button variant="outline" onClick={() => handleExport(registrantsFor)}>
                                <Download size={15} className="mr-1" /> Export CSV
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
