
"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";
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
  FormDescription,
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
import { Checkbox } from "@/components/ui/checkbox";
import { FaTimes } from "react-icons/fa";
import { useCreatePublication } from "@/hooks/usePublications";
import { toast } from "sonner";

const publicationSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title is required and must be at least 2 characters" })
    .max(100, { message: "Title must be no more than 100 characters" }),
  tags: z.string().max(250, { message: "Tags input is too long" }).optional(),
  category: z.string().min(1, { message: "Category is required" }),
  allowComments: z.boolean().optional(),
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

const tagColors = [
  "bg-[#f9e9bc] text-[#73570a] border-[#fff0c4]",
  "bg-[#cbedfa] text-[#256881] border-[#c9f3fa]",
  "bg-[#cef7eb] text-[#086a57] border-[#dbfbf3]",
  "bg-[#fae4fa] text-[#8c3283] border-[#fddfff]",
  "bg-[#ffe3ce] text-[#895c1b] border-[#ffeccd]",
  "bg-[#ecd0f9] text-[#431c75] border-[#f2daff]",
  "bg-[#ffd7d5] text-[#9e1818] border-[#ffe4e3]",
  "bg-[#c5ddfa] text-[#1f397a] border-[#d9eafe]",
];

// Improved TagPill so less repetition and a11y-friendly focus indications
function TagPill({
  children,
  onRemove,
  colorClass,
  ariaLabel,
  tabIndex,
}: {
  children: string;
  onRemove: () => void;
  colorClass: string;
  ariaLabel: string;
  tabIndex?: number;
}) {
  return (
    <span
      className={`flex items-center gap-1 m-1 rounded-full text-sm font-medium pl-3 pr-1 py-1 shadow-sm border ${colorClass} tag-pill-hoverable group`}
      style={{
        whiteSpace: "nowrap",
        background: colorClass.startsWith("bg-")
          ? undefined
          : "linear-gradient(90deg,#F6F8FA 90%,#D8EFFF 100%)",
      }}
    >
      <span className="pr-1">{children}</span>
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={onRemove}
        className="flex items-center justify-center rounded-full bg-transparent hover:bg-[#fbe4e4] hover:text-[#f94d4d] focus:outline-none text-xs w-6 h-6 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-[#357AA8] group-hover:visible"
        tabIndex={tabIndex}
        style={{
          boxShadow: "0 1px 2px 0 rgba(39,60,117,0.03)",
          transition: "background .13s, color .13s",
          lineHeight: 1,
        }}
      >
        <FaTimes className="w-3.5 h-3.5 pointer-events-none" />
      </button>
    </span>
  );
}

// Improved util for tag parsing
const parseTagList = (input: string) =>
  Array.from(
    new Set(
      input
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    )
  );

// Main Form Component
const CreatePublicationComponent: React.FC = () => {
  const form = useForm<PublicationInput>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      title: "",
      tags: "",
      category: "",
      content: "",
      allowComments: true,
      imageFile: null,
    },
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const [submitting, setSubmitting] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const createPublication = useCreatePublication();
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  // Handle image drag/drop/upload
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

  // Remove selected image
  const onRemoveImage = useCallback(() => {
    form.setValue("imageFile", null, { shouldValidate: false, shouldDirty: true });
    setImagePreviewUrl(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }, [form]);

  // Main form submit handler
  const onSubmit = async (values: PublicationInput) => {
    setSubmitting(true);

    const file = values.imageFile as File | null;
    const tags = typeof values.tags === "string" ? parseTagList(values.tags) : [];

    const payload = {
      title: values.title.trim(),
      content: values.content.trim(),
      category: values.category,
      tags,
      allowComments: Boolean(values.allowComments),
    };

    try {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("content", payload.content);
      formData.append("category", payload.category);
      formData.append("allowComments", String(payload.allowComments));
      formData.append("tags", JSON.stringify(payload.tags));

      if (file instanceof File) {
        formData.append("image", file);
      }

      await createPublication.mutateAsync(formData);

      toast.success(
        <div>
          <div className="font-bold mb-1">Publication submitted!</div>
          <div className="text-sm text-[#244]">
            Your publication has been submitted and is awaiting approval.
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

  // Draft handler, can later implement draft-saving logic here
  const handleDraft = () => {
    toast.info("Save as draft functionality coming soon!");
  };

  // Tag input with pills UI
  const TagInputField = ({ field }: { field: any }) => {
    const tags = useMemo(() => parseTagList(field.value || ""), [field.value]);
    const tooManyTags = tags.length >= 10;

    // Remove by index
    const removeTag = (idx: number) => {
      const newTags = tags.filter((_, i) => i !== idx);
      field.onChange(newTags.join(", "));
    };

    // Add tag on Enter or ,
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        const value = e.currentTarget.value.trim();
        if (value && !tags.includes(value) && !tooManyTags) {
          const newTags = [...tags, value];
          field.onChange(newTags.join(", "));
        }
        e.currentTarget.value = "";
      }
    };

    const raw = field.value || "";
    const typingValue =
      raw.endsWith(",") || tags.length === 0
        ? ""
        : raw.split(",").slice(-1)[0] ?? "";

    return (
      <FormItem>
        <FormLabel className="text-[#203040] font-medium mb-1 block">
          Tags <span className="text-xs text-[#9BB0C9]">(optional)</span>
        </FormLabel>
        <FormControl>
          <div
            className={[
              "bg-[#F6F8FA] border",
              tooManyTags ? "!border-red-300" : "border-[#C3D6ED]",
              "rounded px-3 py-2 h-auto text-base focus-within:border-[#357AA8] flex flex-wrap min-h-10",
            ].join(" ")}
          >
            {tags.map((tag, idx) => (
              <TagPill
                key={tag + idx}
                colorClass={tagColors[idx % tagColors.length]}
                onRemove={() => removeTag(idx)}
                ariaLabel={`Remove tag ${tag}`}
              >
                {tag}
              </TagPill>
            ))}
            <input
              type="text"
              value={typingValue}
              disabled={tooManyTags}
              placeholder={tags.length === 0 ? "E.g. stem, education" : ""}
              className="bg-transparent border-0 outline-none px-0 py-1 flex-1 min-w-[80px] text-base"
              style={{ minWidth: 120, flex: "1" }}
              onChange={e => {
                const parts = raw.split(",");
                parts[parts.length - 1] = e.target.value;
                field.onChange(parts.join(","));
              }}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              aria-label="Add tag"
              maxLength={30}
            />
          </div>
        </FormControl>
        <FormDescription className="text-xs text-[#8CA1B6]">
          {tooManyTags
            ? "You can add up to 10 tags only."
            : "Separate tags with commas or press Enter. Up to 10 tags."}
        </FormDescription>
        <FormMessage className="text-xs text-red-600 mt-1" />
      </FormItem>
    );
  };

  // ----------- Main JSX -----------
  return (
    <div className="max-w-full mx-auto px-4 py-7 bg-white shadow-sm rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-[#16355D]">Create New Publication</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 flex flex-col"
          autoComplete="off"
        >
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#203040] font-medium mb-1 block">
                  Publication Title
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    maxLength={100}
                    autoFocus
                    placeholder="E.g. The future of education in STEM in Nigeria"
                    className="bg-[#F6F8FA] border border-[#C3D6ED] rounded px-3 py-2 h-10 text-base focus:border-[#357AA8]"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-600 mt-1" />
              </FormItem>
            )}
          />

          {/* Tags with improved pill UI */}
          <FormField control={form.control} name="tags" render={TagInputField} />

          {/* Category Dropdown */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#203040] font-medium mb-1 block">
                  Category
                </FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="publication-category"
                      className="bg-[#F6F8FA] border border-[#C3D6ED] rounded px-3 py-2 h-10 text-base focus:border-[#357AA8] w-full"
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
                <FormMessage className="text-xs text-red-600 mt-1" />
              </FormItem>
            )}
          />

          {/* Allow Comments Checkbox */}
          <FormField
            control={form.control}
            name="allowComments"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 mb-4">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                    id="allow-comments-checkbox"
                    className="w-4 h-4 accent-[#357AA8]"
                  />
                </FormControl>
                <FormLabel
                  htmlFor="allow-comments-checkbox"
                  className="text-[#203040] font-normal select-none mb-0"
                  style={{ cursor: "pointer" }}
                >
                  Allow readers to add comments
                </FormLabel>
              </FormItem>
            )}
          />

          {/* Description Textarea */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#203040] font-medium mb-1 block">
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    maxLength={4000}
                    placeholder="Describe your publication and its usefulness"
                    className="bg-[#F6F8FA] border border-[#C3D6ED] rounded px-3 py-2 text-base min-h-[120px] focus:border-[#357AA8]"
                    rows={5}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-600 mt-1" />
              </FormItem>
            )}
          />

          {/* Image Upload */}
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

          {/* Action buttons */}
          <div className="flex flex-row items-center pb-20 justify-end gap-3 pt-3">
            <NaapButton
              type="button"
              variant="ghost"
              className="!rounded !h-10 !px-8 border border-[#357AA8] text-[#357AA8] hover:bg-[#ecf3f9] font-semibold"
              style={{ minWidth: 130 }}
              onClick={handleDraft}
              disabled={submitting}
              data-testid="save-draft-btn"
            >
              Save as Draft
            </NaapButton>
            <NaapButton
              type="submit"
              variant="primary"
              className="!rounded !h-10 !px-8"
              style={{ minWidth: 100 }}
              loading={submitting}
              data-testid="submit-btn"
            >
              Submit
            </NaapButton>
          </div>
        </form>
      </Form>

      {/* Global style for tag pill hover/focus */}
      <style jsx global>{`
        .tag-pill-hoverable button {
          opacity: 0.6 !important;
          pointer-events: auto;
        }
        .tag-pill-hoverable:hover button,
        .tag-pill-hoverable:focus-within button {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default CreatePublicationComponent;
