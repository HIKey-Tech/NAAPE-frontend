"use client";

import React, { useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormLabel,
    FormControl,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import DropImageDual from "@/components/member/component/drop.image";
import { useCreateNews } from "@/hooks/useNews";
import { FaNewspaper } from "react-icons/fa";

// Schema for frontend validation using Zod
const newsSchema = z.object({
    title: z
        .string()
        .min(5, { message: "Title must be at least 5 characters" })
        .max(120, { message: "Title must be less than 120 characters" }),
    content: z
        .string()
        .min(20, { message: "Body content must be at least 20 characters" })
        .max(6000, { message: "Body content must be less than 6000 characters" }),
    category: z.enum(["Engineering", "Pilot", "General", "Announcement"], {
        message: "Invalid category selected",
    }),
    imageFile: z
        .any()
        .refine(
            (file) =>
                !file ||
                (file instanceof File &&
                    [undefined, "image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type) &&
                    file.size <= 8 * 1024 * 1024),
            {
                message: "Only jpeg, png, webp, gif images up to 8MB are allowed.",
            }
        )
        .optional(),
});

type NewsInput = z.infer<typeof newsSchema>;

const newsCategories = [
    { value: "Engineering", label: "Engineering" },
    { value: "Pilot", label: "Pilot" },
    { value: "General", label: "General" },
    { value: "Announcement", label: "Announcement" },
];

export default function CreateNewsComponent() {
    const [submitting, setSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUploading, setImageUploading] = useState(false);

    const defaultCategory = newsCategories[0].value as NewsInput["category"];
    const form = useForm<NewsInput>({
        resolver: zodResolver(newsSchema),
        defaultValues: {
            title: "",
            category: defaultCategory,
            content: "",
            imageFile: "",
        },
        mode: "onBlur",
    });

    const createNews = useCreateNews();
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

    const handleDrop = useCallback(
        (file: File | null) => {
            form.setValue("imageFile", file, {
                shouldValidate: Boolean(file),
                shouldDirty: true,
            });
            setImagePreviewUrl(file ? URL.createObjectURL(file) : null);
        },
        [form]
    );

    const titleInputRef = useRef<HTMLInputElement>(null);

    const handleImageFile = (file: File | null) => setImageFile(file);

    const resetForm = () => {
        form.reset({
            title: "",
            category: defaultCategory,
            content: "",
            imageFile: "",
        });
        setImageFile(null);
        titleInputRef.current?.focus();
    };

    const onSubmit = async (values: NewsInput) => {
        setSubmitting(true);
        const file = values.imageFile as File | null;

        try {
            const payload = {
                title: values.title.trim(),
                content: values.content.trim(),
                category: values.category,
            };

            const formData = new FormData();
            formData.append("title", payload.title);
            formData.append("content", payload.content);
            formData.append("category", payload.category);

            if (file instanceof File) {
                formData.append("image", file);
            }

            await createNews.mutateAsync(formData);
            toast.success("News created successfully.");
            resetForm();
        } catch (error: any) {
            setImageUploading(false);
            toast.error(
                <>
                    <span>Failed to submit news.</span>
                    {error?.message && <div className="text-[13px] opacity-90">{error.message}</div>}
                </>
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                {/* Header */}
                <div className="flex items-center gap-3 p-6 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                        <FaNewspaper className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Create News Article</h1>
                        <p className="text-sm text-slate-500">Write and publish a new article</p>
                    </div>
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="p-6 space-y-6"
                        autoComplete="off"
                        noValidate
                    >
                        {/* Title */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                                        News Title <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            inputMode="text"
                                            autoFocus
                                            ref={titleInputRef}
                                            maxLength={120}
                                            placeholder="E.g. Electric Propulsion Now Powers Engineering Spacecraft"
                                            className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white h-11 text-base"
                                            aria-required="true"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 mt-1" />
                                </FormItem>
                            )}
                        />

                        {/* Category */}
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                                        News Category <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger
                                                id="news-category"
                                                className="rounded-xl border-slate-200 bg-slate-50 h-11 text-base w-full"
                                            >
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {newsCategories.map((cat) => (
                                                    <SelectItem key={cat.value} value={cat.value}>
                                                        {cat.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage className="text-xs text-red-500 mt-1" />
                                </FormItem>
                            )}
                        />

                        {/* Content */}
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                                        News Content <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            minLength={20}
                                            maxLength={6000}
                                            placeholder="Write the full news article here."
                                            className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white text-base min-h-[160px]"
                                            rows={8}
                                            aria-required="true"
                                        />
                                    </FormControl>
                                    <div className="flex justify-end text-xs text-slate-400 mt-1">
                                        {form.watch("content")?.length || 0}/6000
                                    </div>
                                    <FormMessage className="text-xs text-red-500 mt-1" />
                                </FormItem>
                            )}
                        />

                        {/* Image */}
                        <div>
                            <FormField
                                control={form.control}
                                name="imageFile"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                                            Upload Cover Image{" "}
                                            <span className="text-slate-400 font-normal normal-case tracking-normal">
                                                (optional, recommended to attract more readers)
                                            </span>
                                        </FormLabel>
                                        <DropImageDual
                                            value={field.value ?? undefined}
                                            onDrop={file => {
                                                field.onChange(file ?? null);
                                                handleDrop(file ?? null);
                                            }}
                                            inputRef={imageInputRef as React.RefObject<HTMLInputElement>}
                                            disabled={submitting}
                                        />
                                        <FormMessage className="text-xs text-red-600 mt-1" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
                            <Button
                                type="button"
                                variant="outline"
                                className="rounded-xl font-bold border-slate-200 px-8 h-11"
                                onClick={() => toast.info("Draft news saved locally. (Feature coming soon!)")}
                                disabled={submitting || imageUploading}
                                data-testid="save-draft-btn"
                            >
                                Save as Draft
                            </Button>
                            <Button
                                type="submit"
                                className="rounded-xl font-bold shadow-md shadow-primary/20 px-8 h-11"
                                disabled={submitting || imageUploading}
                                data-testid="submit-btn"
                            >
                                {submitting || imageUploading ? "Publishing..." : "Publish News"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
