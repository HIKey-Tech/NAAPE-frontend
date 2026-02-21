"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import DropImageDual from "@/components/member/component/drop.image";
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
import { useEditPublication } from "@/hooks/usePublications";
import { toast } from "sonner";
import { IPublication } from "@/app/api/publication/types";

const publicationSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title is required and must be at least 2 characters" })
    .max(100, { message: "Title must be no more than 100 characters" }),
  category: z.string().min(1, { message: "Category is required" }),
  content: z
    .string()
    .min(2, { message: "Description is required" })
    .max(4000, { message: "Description is too long" }),
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

type PublicationInput = z.infer<typeof publicationSchema>;

const categories = [
  { value: "News", label: "News" },
  { value: "Engineering", label: "Engineering" },
  { value: "Pilot", label: "Pilot" },
  { value: "General", label: "General" },
];

interface EditPublicationProps {
  publication: IPublication;
}

const EditPublicationComponent: React.FC<EditPublicationProps> = ({ publication }) => {
  const router = useRouter();
  const form = useForm<PublicationInput>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      title: publication.title || "",
      category: publication.category || "",
      content: publication.content || "",
      imageFile: null,
    },
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const [submitting, setSubmitting] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(publication.image || null);

  const editPublication = useEditPublication();
  const imageInputRef = useRef<HTMLInputElement | null>(null);

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

  const onRemoveImage = useCallback(() => {
    form.setValue("imageFile", null, { shouldValidate: false, shouldDirty: true });
    setImagePreviewUrl(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }, [form]);

  const onSubmit = async (values: PublicationInput, saveAsDraft = false) => {
    setSubmitting(true);

    const updatedData: any = {
      title: values.title.trim(),
      content: values.content.trim(),
      category: values.category,
      status: saveAsDraft ? "draft" : "pending",
    };

    const file = values.imageFile as File | null;
    if (file instanceof File) {
      updatedData.image = file;
    }

    try {
      await editPublication.mutateAsync({
        id: publication._id,
        updatedData,
      });

      const successMessage = saveAsDraft
        ? "Publication saved as draft!"
        : "Publication submitted for review!";
      const successDescription = saveAsDraft
        ? "You can continue editing later."
        : "Your publication has been submitted and is awaiting approval.";

      toast.success(
        <div>
          <div className="font-bold mb-1">{successMessage}</div>
          <div className="text-sm text-slate-500">{successDescription}</div>
        </div>
      );

      router.push("/publications");
    } catch (error: any) {
      toast.error(
        <span>
          Failed to update publication: {error?.message || "Unknown error. Please try again."}
        </span>
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDraft = () => {
    form.handleSubmit((values) => onSubmit(values, true))();
  };

  const handleSubmit = () => {
    form.handleSubmit((values) => onSubmit(values, false))();
  };

  return (
    <div
      className="max-w-2xl mx-auto px-4 py-10 bg-white dark:bg-card shadow-sm border border-slate-100 dark:border-border rounded-2xl md:px-8"
      role="region"
      aria-labelledby="edit-publication-heading"
    >
      <header className="mb-7">
        <h1
          id="edit-publication-heading"
          className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2 leading-tight"
        >
          Edit Publication
        </h1>
        <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 font-medium">
          Update your publication and save as draft or submit for review.
        </p>
      </header>

      <Form {...form}>
        <form className="space-y-8 flex flex-col" autoComplete="off">
          {/* Title */}
          <section className="flex flex-col">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5 block">
                    Publication Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      maxLength={100}
                      placeholder="e.g., The Future of Education in STEM in Nigeria"
                      className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 h-12 text-base focus:bg-white dark:focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-600 dark:text-red-400 mt-1" />
                </FormItem>
              )}
            />
          </section>

          {/* Category */}
          <section className="flex flex-col">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5 block">
                    Category <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 h-12 text-base focus:bg-white dark:focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-slate-900 dark:text-slate-100">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-xs text-red-600 dark:text-red-400 mt-1" />
                </FormItem>
              )}
            />
          </section>

          {/* Content */}
          <section className="flex flex-col">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5 block">
                    Description <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      maxLength={4000}
                      placeholder="Describe your publication and its usefulness"
                      className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-base min-h-[120px] focus:bg-white dark:focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-600 dark:text-red-400 mt-1" />
                </FormItem>
              )}
            />
          </section>

          {/* Image */}
          <section className="flex flex-col">
            <FormField
              control={form.control}
              name="imageFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-2 block">
                    Upload Cover Image <span className="text-slate-300 font-normal text-xs normal-case">(optional)</span>
                  </FormLabel>
                  {imagePreviewUrl && !field.value && (
                    <div className="mb-4">
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Current image:</p>
                      <img src={imagePreviewUrl} alt="Current" className="w-full max-w-md h-48 object-cover rounded-xl" />
                    </div>
                  )}
                  <DropImageDual
                    value={field.value ?? undefined}
                    onDrop={(file) => {
                      field.onChange(file ?? null);
                      handleDrop(file ?? null);
                    }}
                    inputRef={imageInputRef as React.RefObject<HTMLInputElement>}
                    disabled={submitting}
                  />
                  <FormMessage className="text-xs text-red-600 dark:text-red-400 mt-1" />
                </FormItem>
              )}
            />
          </section>

          {/* Action buttons */}
          <section className="flex flex-row flex-wrap items-center justify-end gap-4 pt-6 border-t border-slate-100 dark:border-slate-800/50 mt-4">
            <NaapButton
              type="button"
              variant="ghost"
              className="rounded-xl h-11 px-8 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold"
              onClick={handleDraft}
              disabled={submitting}
            >
              Save as Draft
            </NaapButton>
            <NaapButton
              type="button"
              variant="primary"
              className="rounded-xl h-11 px-8 shadow-md shadow-primary/20"
              onClick={handleSubmit}
              loading={submitting}
            >
              Submit for Review
            </NaapButton>
          </section>
        </form>
      </Form>
    </div>
  );
};

export default EditPublicationComponent;
