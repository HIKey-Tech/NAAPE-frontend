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

// Fallback select and checkbox if shadcn is not available
function SelectSimple({
    value,
    onChange,
    options,
    placeholder,
    id,
    ...rest
}: {
    value: string;
    onChange: (val: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    id?: string;
}) {
    return (
        <select
            id={id}
            value={value}
            onChange={e => onChange(e.target.value)}
            className="bg-[#F6F8FA] border border-[#C3D6ED] rounded px-3 py-2 h-10 text-base focus:border-[#357AA8] w-full"
            {...rest}
        >
            <option value="">{placeholder ?? "Select an option"}</option>
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    );
}
function CheckboxSimple({
    checked,
    onCheckedChange,
    id,
    ...rest
}: {
    checked: boolean;
    onCheckedChange?: (v: boolean) => void;
    id?: string;
}) {
    return (
        <input
            type="checkbox"
            id={id}
            checked={checked}
            onChange={e => onCheckedChange?.(e.target.checked)}
            className="w-4 h-4 accent-[#357AA8]"
            {...rest}
        />
    );
}

const publicationSchema = z.object({
    title: z.string().min(2, { message: "Title is required" }),
    tags: z.string().optional(),
    category: z.string().min(1, { message: "Category is required" }),
    allowComments: z.boolean().optional(),
    description: z.string().min(2, { message: "Description is required" }),
    // Images handled separately
});

type PublicationInput = z.infer<typeof publicationSchema>;

const categories = [
    { value: "science", label: "Science" },
    { value: "engineering", label: "Engineering" },
    { value: "mathematics", label: "Mathematics" },
    { value: "technology", label: "Technology" },
    { value: "other", label: "Other" },
];

export default function CreatePublicationPage() {
    const form = useForm<PublicationInput>({
        resolver: zodResolver(publicationSchema),
        defaultValues: {
            title: "",
            tags: "",
            category: "",
            allowComments: false,
            description: "",
        },
    });

    const [submitting, setSubmitting] = React.useState(false);

    // Placeholder upload handler
    // You would implement your actual file/image/PDF logic here.
    const handleDrop = (files: FileList | null) => { };

    const onSubmit = async (values: PublicationInput) => {
        setSubmitting(true);
        // TODO: Upload files, send publication data
        await new Promise((res) => setTimeout(res, 900));
        setSubmitting(false);
        alert("Publication submitted!\n\n" + JSON.stringify(values, null, 2));
    };

    // Support for Save as Draft (optional)
    const handleDraft = () => {
        alert("Draft saved (not really, implement me)!");
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-7 bg-white shadow-sm rounded-lg">

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

                    {/* Tags (optional) */}
                    <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[#203040] font-medium mb-1 block">
                                    Tags <span className="text-[#8CA1B6] font-normal">(optional)</span>
                                </FormLabel>
                                <FormControl>
                                    <div>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {(field.value?.split(",").map((t: string) => t.trim()).filter(Boolean) || []).map(
                                                (tag: string, idx: number, arr: string[]) => (
                                                    <span
                                                        key={tag + idx}
                                                        className="bg-[#D4E4F6] text-[#357AA8] px-2 py-1 rounded-full text-xs flex items-center group"
                                                    >
                                                        <span>{tag}</span>
                                                        <button
                                                            type="button"
                                                            aria-label={`Remove tag "${tag}"`}
                                                            onClick={() => {
                                                                if (!field.value) return;
                                                                // Only remove this specific tag
                                                                const nextTags = arr.filter((t, i) => !(t === tag && i === idx));
                                                                field.onChange(nextTags.join(", "));
                                                            }}
                                                            className="ml-1 text-[#357AA8] hover:text-red-500 outline-none focus:ring-2 focus:ring-blue-200 transition"
                                                        >
                                                            <span className="text-base leading-none">&times;</span>
                                                        </button>
                                                    </span>
                                                )
                                            )}
                                        </div>
                                        <Input
                                            value={field.value || ""}
                                            onChange={e => {
                                                // Sanitize all incoming tags: trim redundant spaces and remove duplicate commas
                                                const input = e.target.value.replace(/,+/g, ',').replace(/(^,)|(,$)/g, '');
                                                field.onChange(input);
                                            }}
                                            placeholder="E.g. stem, education"
                                            className="bg-[#F6F8FA] border border-[#C3D6ED] rounded px-3 py-2 h-10 text-base focus:border-[#357AA8]"
                                            autoComplete="off"
                                            spellCheck={false}
                                            aria-label="Publication tags"
                                        />
                                    </div>
                                </FormControl>
                                <FormDescription className="text-xs text-[#8CA1B6]">
                                    Separate tags with commas. Each tag will become a tablet.
                                </FormDescription>
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
                                <FormLabel className="text-[#203040] font-medium mb-1 block">
                                    Category
                                </FormLabel>
                                <FormControl>
                                    <SelectSimple
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={categories}
                                        placeholder="Select category"
                                        id="publication-category"
                                    />
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
                            <FormItem className="flex items-center gap-2 mb-1">
                                <FormControl>
                                    <CheckboxSimple
                                        checked={!!field.value}
                                        onCheckedChange={field.onChange}
                                        id="allow-comments-checkbox"
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
                        name="description"
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
                        <FormLabel className="text-[#203040] font-medium mb-1 block">
                            Upload Cover Image &nbsp; <span className="text-[#8CA1B6] font-normal">(optional, recommended to attract more readers)</span>
                        </FormLabel>
                        <DropImageDual />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-row items-center justify-end gap-3 pt-3">
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
        </div>
    );
}
