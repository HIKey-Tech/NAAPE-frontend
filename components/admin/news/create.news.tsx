"use client";

import React, { useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NaapButton } from "@/components/ui/custom/button.naap";
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
                formData.append("image", file)
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

    const inputBase =
        "bg-[#F6F8FA] border border-[#B4D3EF] rounded px-3 py-2 focus:border-[#357AA8] transition-colors";
    const labelBase = "font-medium mb-1 block";

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-5 text-[#16355D]">
                Create News Article
            </h1>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-7"
                    autoComplete="off"
                    noValidate
                >
                    {/* Title */}
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className={`${labelBase} text-[#144]`}>
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
                                        className={`${inputBase} h-10 text-base`}
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
                                <FormLabel className={`${labelBase} text-[#144]`}>
                                    News Category <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger
                                            id="news-category"
                                            className={`${inputBase} h-10 text-base w-full`}
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
                                <FormLabel className={`${labelBase} text-[#144]`}>
                                    News Content <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        minLength={20}
                                        maxLength={6000}
                                        placeholder="Write the full news article here."
                                        className={`${inputBase} text-base min-h-[160px]`}
                                        rows={8}
                                        aria-required="true"
                                    />
                                </FormControl>
                                <div className="flex justify-end text-xs text-gray-500 mt-1">
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
                                    <FormLabel className="text-[#203040] font-medium mb-2 block">
                                        Upload Cover Image{" "}
                                        <span className="text-[#8CA1B6] font-normal">
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
                                    // previewUrl={imagePreviewUrl || undefined}
                                    // onRemove={onRemoveImage}
                                    />
                                    <FormMessage className="text-xs text-red-600 mt-1" />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-row items-center pb-6 justify-end gap-3 pt-3">
                        <NaapButton
                            type="button"
                            variant="ghost"
                            className="!rounded !h-10 !px-8 border border-[#357AA8] text-[#357AA8] hover:bg-[#ecf3f9] font-semibold"
                            style={{ minWidth: 130 }}
                            onClick={() => toast.info("Draft news saved locally. (Feature coming soon!)")}
                            disabled={submitting || imageUploading}
                            data-testid="save-draft-btn"
                        >
                            Save as Draft
                        </NaapButton>
                        <NaapButton
                            type="submit"
                            variant="primary"
                            className="!rounded !h-10 !px-8"
                            style={{ minWidth: 100 }}
                            loading={submitting || imageUploading}
                            data-testid="submit-btn"
                            disabled={submitting || imageUploading}
                        >
                            {submitting || imageUploading ? "Publishing..." : "Publish News"}
                        </NaapButton>
                    </div>
                </form>
            </Form>
        </div>
    );
}
