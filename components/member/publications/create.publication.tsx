
"use client";

import React, { useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useCreatePublication } from "@/hooks/usePublications";
import { toast } from "sonner";
import { useAuth } from "@/context/authcontext";

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

// Main Form Component
const CreatePublicationComponent: React.FC = () => {
  const { user } = useAuth();

  const isAdmin = user?.role === "admin" || user?.role === "editor";

  const form = useForm<PublicationInput>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      title: "",
      category: "",
      content: "",
      imageFile: null,
    },
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const [submitting, setSubmitting] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const createPublication = useCreatePublication();
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

  const onSubmit = async (values: PublicationInput) => {
    setSubmitting(true);

    const file = values.imageFile as File | null;
    const payload = {
      title: values.title.trim(),
      content: values.content.trim(),
      category: values.category,
    };

    try {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("content", payload.content);
      formData.append("category", payload.category);

      if (file instanceof File) {
        formData.append("image", file);
      }

      await createPublication.mutateAsync(formData, {});

      toast.success(
        <div>
          <div className="font-bold mb-1">Publication submitted!</div>
          <div className="text-sm text-slate-500">
            {isAdmin
              ? "Your publication has been published successfully."
              : "Your publication has been submitted and is awaiting approval."}
          </div>
        </div>
      );

      form.reset();
      setImagePreviewUrl(null);
    } catch (error: any) {
      toast.error(
        <span>
          Failed to submit publication: {error?.message || "Unknown error. Please try again."}
        </span>
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDraft = async () => {
    const values = form.getValues();

    if (!values.title.trim() || !values.content.trim() || !values.category) {
      toast.error("Please fill in title, category, and content before saving as draft.");
      return;
    }

    setSubmitting(true);

    const file = values.imageFile as File | null;
    const payload = {
      title: values.title.trim(),
      content: values.content.trim(),
      category: values.category,
      status: "draft",
    };

    try {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("content", payload.content);
      formData.append("category", payload.category);
      formData.append("status", payload.status);

      if (file instanceof File) {
        formData.append("image", file);
      }

      await createPublication.mutateAsync(formData, {});

      toast.success(
        <div>
          <div className="font-bold mb-1">Publication saved as draft!</div>
          <div className="text-sm text-slate-500">
            You can edit and submit it later from My Publications.
          </div>
        </div>
      );

      form.reset();
      setImagePreviewUrl(null);
    } catch (error: any) {
      toast.error(
        <span>
          Failed to save draft: {error?.message || "Unknown error. Please try again."}
        </span>
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="max-w-2xl mx-auto px-4 py-10 bg-white dark:bg-card shadow-sm border border-slate-100 dark:border-border rounded-2xl md:px-8"
      role="region"
      aria-labelledby="create-publication-heading"
      tabIndex={-1}
    >
      <>
          <header className="mb-7">
            <h1
              id="create-publication-heading"
              tabIndex={-1}
              className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2 leading-tight"
            >
              Create a New Publication
            </h1>
            <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 font-medium">
              Submit your article to share expertise and ideas with NAAPE members.
            </p>
          </header>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 flex flex-col"
              autoComplete="off"
              aria-describedby="form-description"
            >
              {/* Title */}
              <section aria-labelledby="publication-title-label" className="flex flex-col">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        id="publication-title-label"
                        htmlFor="publication-title-input"
                        className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5 block"
                      >
                        Publication Title <span className="text-red-500" aria-hidden="true">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="publication-title-input"
                          maxLength={100}
                          autoFocus
                          placeholder="e.g., The Future of Education in STEM in Nigeria"
                          aria-required="true"
                          aria-describedby="publication-title-hint"
                          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 h-12 text-base focus:bg-white dark:focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        />
                      </FormControl>
                      <span
                        id="publication-title-hint"
                        className="text-xs text-slate-400 dark:text-slate-500 block my-0.5"
                      >
                        Enter a concise and descriptive title (max 100 characters).
                      </span>
                      <FormMessage className="text-xs text-red-600 dark:text-red-400 mt-1" />
                    </FormItem>
                  )}
                />
              </section>

              {/* Category Dropdown */}
              <section aria-labelledby="publication-category-label" className="flex flex-col">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        id="publication-category-label"
                        htmlFor="publication-category"
                        className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5 block"
                      >
                        Category <span className="text-red-500" aria-hidden="true">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger
                            id="publication-category"
                            aria-required="true"
                            aria-describedby="publication-category-hint"
                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 h-12 text-base focus:bg-white dark:focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all w-full text-slate-900 dark:text-slate-100"
                          >
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
                      <span
                        id="publication-category-hint"
                        className="text-xs text-slate-400 dark:text-slate-500 block my-0.5"
                      >
                        Select the category that best fits your publication.
                      </span>
                      <FormMessage className="text-xs text-red-600 dark:text-red-400 mt-1" />
                    </FormItem>
                  )}
                />
              </section>

              {/* Description Textarea */}
              <section aria-labelledby="publication-description-label" className="flex flex-col">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        id="publication-description-label"
                        htmlFor="publication-description"
                        className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5 block"
                      >
                        Description <span className="text-red-500" aria-hidden="true">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          id="publication-description"
                          maxLength={4000}
                          placeholder="Describe your publication and its usefulness"
                          aria-required="true"
                          aria-describedby="publication-description-hint"
                          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-base min-h-[120px] focus:bg-white dark:focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                          rows={5}
                        />
                      </FormControl>
                      <span
                        id="publication-description-hint"
                        className="text-xs text-slate-400 dark:text-slate-500 block my-0.5"
                      >
                        Share what this publication covers and why it matters, up to 4000 characters.
                      </span>
                      <FormMessage className="text-xs text-red-600 dark:text-red-400 mt-1" />
                    </FormItem>
                  )}
                />
              </section>

              {/* Image Upload */}
              <section aria-labelledby="publication-image-label" className="flex flex-col">
                <FormField
                  control={form.control}
                  name="imageFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        id="publication-image-label"
                        htmlFor="publication-image-input"
                        className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block"
                      >
                        Upload Cover Image{" "}
                        <span className="text-slate-300 font-normal text-xs normal-case">
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
                        aria-describedby="publication-image-desc"
                      />
                      <span
                        id="publication-image-desc"
                        className="text-xs text-slate-400 block my-0.5"
                      >
                        Supported formats: jpeg, png, webp, gif. Max size 8MB.
                      </span>
                      <FormMessage className="text-xs text-red-600 mt-1" />
                    </FormItem>
                  )}
                />
              </section>

              {/* Action buttons */}
              <section aria-label="Publication Actions" className="flex flex-row flex-wrap items-center justify-end gap-4 pt-6 border-t border-slate-100 dark:border-slate-800/50 mt-4">
                <NaapButton
                  type="button"
                  variant="ghost"
                  className="rounded-xl h-11 px-8 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold outline-offset-2 focus-visible:outline-primary focus-visible:outline-2"
                  style={{ minWidth: 130 }}
                  onClick={handleDraft}
                  disabled={submitting}
                  data-testid="save-draft-btn"
                  aria-label="Save as Draft"
                >
                  Save as Draft
                </NaapButton>
                <NaapButton
                  type="submit"
                  variant="primary"
                  className="rounded-xl h-11 px-8 shadow-md shadow-primary/20 focus-visible:outline-primary focus-visible:outline-2"
                  style={{ minWidth: 100 }}
                  loading={submitting}
                  data-testid="submit-btn"
                  aria-label="Submit Publication"
                >
                  Submit
                </NaapButton>
              </section>
            </form>
          </Form>
      </>
    </div>
  );
};

export default CreatePublicationComponent;
