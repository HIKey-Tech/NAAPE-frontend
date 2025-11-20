"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DropImageDual from "../component/drop.image";
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
import { uploadToCloudinary } from "@/app/api/cloudinary";

const publicationSchema = z.object({
  title: z.string().min(2, { message: "Title is required" }),
  tags: z.string().optional(),
  category: z.string().min(1, { message: "Category is required" }),
  allowComments: z.boolean().optional(),
  content: z.string().min(2, { message: "Description is required" }),
  // Images handled separately
});

type PublicationInput = z.infer<typeof publicationSchema>;

const categories = [
  { value: "News", label: "News" },
  { value: "Engineering", label: "Engineering" },
  { value: "Pilot", label: "Pilot" },
  { value: "General", label: "General" },
];

// Improved pill component for tags
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
      className={`flex items-center gap-1 m-1 rounded-full text-sm font-medium pl-3 pr-1 py-1 shadow-sm transition-all border ${colorClass} tag-pill-hoverable group`}
      style={{
        whiteSpace: "nowrap",
        borderColor: "rgba(39,78,117,0.09)",
        background:
          colorClass.includes("bg-") ? undefined : "linear-gradient(90deg,#F6F8FA 90%,#D8EFFF 100%)",
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
        <FaTimes className="w-3.5 h-3.5" />
      </button>
    </span>
  );
}

export default function CreatePublicationComponent() {
  const form = useForm<PublicationInput>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      title: "",
      tags: "",
      category: "",
      // allowComments: false,
      content: "",
    },
  });

  const [submitting, setSubmitting] = React.useState(false);
  const [imageFile, setImageFile] = React.useState<File | null>(null);

  const createPublication = useCreatePublication();

  // Use DropImageDual and store file in component state
  const handleDrop = (files: FileList | null) => {
    if (files && files.length > 0) {
      setImageFile(files[0]);
    } else {
      setImageFile(null);
    }
  };

  // Pass handleDrop to DropImageDual as prop (assumes DropImageDual supports an onDrop prop)
  // Adjust to your DropImageDual signature as needed.

  const onSubmit = async (values: PublicationInput) => {
    setSubmitting(true);

    let imageUrl: string | null = null;
    if (imageFile) {
      imageUrl = await uploadToCloudinary(imageFile);
    }

    // Merge values + image url, prepare payload for creation
    const payload = {
      title: values.title,
      content: values.content,
      category: values.category,
      image: imageUrl || "",
    };

    console.log('payload', payload)
    try {
      await createPublication.mutateAsync(payload);
      setSubmitting(false);
      toast.success(
        <>
          <div className="font-bold mb-1">Publication submitted!</div>
          <div className="text-sm text-[#244]">Your publication has been submitted and is awaiting approval.</div>
        </>
      );
      form.reset();
      setImageFile(null); // clear image after successful submission
    } catch (error: any) {
      setSubmitting(false);
      toast.error(
        <span>
          Failed to submit publication:{" "}
          {error?.message || "Unknown error. Please try again."}
        </span>
      );
    }
  };

  const handleDraft = () => {
    toast.info("Draft saved (not really, implement me)!");
  };

  return (
    <div className="max-w-full mx-auto px-4  py-7 bg-white shadow-sm rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-[#16355D]">
        Create New Publication
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 flex flex-col"
          autoComplete="off"
        >
          {/* Publication Title */}
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
                    autoFocus
                    placeholder="E.g. The future of education in STEM in Nigeria"
                    className="bg-[#F6F8FA] border border-[#C3D6ED] rounded px-3 py-2 h-10 text-base focus:border-[#357AA8]"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500 mt-1" />
              </FormItem>
            )}
          />

          {/* Tags (optional) with pill UI */}
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => {
              // Parse and deduplicate tags, remove empties
              const tags = Array.from(
                new Set(
                  (field.value || "")
                    .split(",")
                    .map((t: string) => t.trim())
                    .filter((t: string) => !!t)
                )
              );

              // Improved color palette + fallback
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

              // Remove tag by index
              const removeTag = (idx: number) => {
                const newTags = tags.filter((_, i) => i !== idx);
                const newValue = newTags.join(", ");
                field.onChange(newValue);
              };

              // Add tag on enter/comma key
              const handleKeyDown = (
                e: React.KeyboardEvent<HTMLInputElement>
              ) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  const value = e.currentTarget.value.trim();
                  if (value && !tags.includes(value)) {
                    const newTags = [...tags, value];
                    field.onChange(newTags.join(", "));
                  }
                  setTimeout(() => {
                    e.currentTarget.value = "";
                  }, 0);
                }
              };

              // Calculate the value being typed (after the last comma)
              const raw = field.value || "";
              // Never show the deduped tags as input value
              const typingValue =
                raw.endsWith(",")
                  ? ""
                  : (raw.split(",").slice(-1)[0] ?? "");

              return (
                <FormItem>
                  <FormLabel className="text-[#203040] font-medium mb-1 block">
                    Tag (optional)
                  </FormLabel>
                  <FormControl>
                    <div className="bg-[#F6F8FA] border border-[#C3D6ED] rounded px-3 py-2 h-auto text-base focus-within:border-[#357AA8] flex flex-wrap min-h-10">
                      {/* Pills */}
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
                      {/* Input field for typing */}
                      <input
                        type="text"
                        value={typingValue}
                        placeholder={tags.length === 0 ? "E.g. stem, education" : ""}
                        className="bg-transparent border-0 outline-none px-0 py-1 flex-1 min-w-[80px] text-base"
                        style={{ minWidth: "120px", flex: "1" }}
                        onChange={(e) => {
                          // Only update the last portion after the last comma
                          const parts = raw.split(",");
                          parts[parts.length - 1] = e.target.value;
                          field.onChange(parts.join(","));
                        }}
                        onKeyDown={handleKeyDown}
                        spellCheck={false}
                        aria-label="Add tag"
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-[#8CA1B6]">
                    Separate tags with commas or press Enter.
                  </FormDescription>
                  <FormMessage className="text-xs text-red-500 mt-1" />
                </FormItem>
              );
            }}
          />

          {/* Category */}
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
                <FormMessage className="text-xs text-red-500 mt-1" />
              </FormItem>
            )}
          />

          {/* Allow Comments */}
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
                  className="text-[#203040] font-normal"
                  style={{
                    cursor: "pointer",
                    marginBottom: 0,
                  }}
                >
                  Allow readers to add comments
                </FormLabel>
              </FormItem>
            )}
          />

          {/* Description */}
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
                    placeholder="Describe your publication and its usefulness"
                    className="bg-[#F6F8FA] border border-[#C3D6ED] rounded px-3 py-2 text-base min-h-[120px] focus:border-[#357AA8]"
                    rows={4}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500 mt-1" />
              </FormItem>
            )}
          />

          {/* Upload */}
          <div>
            <FormLabel className="text-[#203040] font-medium mb-2 block">
              Upload Cover Image &nbsp;{" "}
              <span className="text-[#8CA1B6] font-normal">
                (optional, recommended to attract more readers)
              </span>
            </FormLabel>
            {/* @ts-expect-error DropImageDual props typing needs update */}
            <DropImageDual onDrop={handleDrop} imageFile={imageFile} />
            {imageFile && (
              <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                <span>Selected file:</span>
                <span className="font-mono">{imageFile.name}</span>
                <button
                  type="button"
                  onClick={() => setImageFile(null)}
                  aria-label="Remove selected image"
                  className="text-red-600 hover:underline ml-2"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
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
      <style jsx global>{`
        .tag-pill-hoverable button {
          opacity: 0.6;
        }
        .tag-pill-hoverable:hover button,
        .tag-pill-hoverable:focus-within button {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
