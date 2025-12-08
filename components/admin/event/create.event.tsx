"use client";

import React, { useCallback, useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useCreateEvent } from "@/hooks/useEvents";
import { NaapButton } from "@/components/ui/custom/button.naap";
import DropImageDual from "@/components/member/component/drop.image";
import { toast } from "sonner";
import { MdSmartToy, MdAdd, MdImage, MdEvent, MdLocationOn, MdOutlineAttachMoney } from "react-icons/md";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { AiOutlineCheckSquare } from "react-icons/ai";

// --- AI Suggest Title function ---
async function suggestTitles(content: string) {
  const res = await fetch("/api/suggest-title", {
    method: "POST",
    body: JSON.stringify({ text: content }),
  });
  const data = await res.json();
  return data.titles;
}

// --- Validation Schema ---
const eventSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters.")
    .max(80, "Title must be at most 80 characters."),
  date: z.string().min(1, "Date is required."),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters.")
    .max(60, "Location must be at most 60 characters."),
  imageFile: z.instanceof(File).optional().or(z.null()),
  description: z.string().max(2000).optional().or(z.literal("")),
  price: z.string().regex(/^\d*(\.\d{1,2})?$/, "Invalid amount").optional(),
  currency: z.string().max(8).optional(),
  isPaid: z.boolean().default(false),
});

type EventFormValues = z.infer<typeof eventSchema>;

const DEFAULT_VALUES: EventFormValues = {
  title: "",
  date: "",
  location: "",
  imageFile: null,
  description: "",
  price: "",
  currency: "NGN",
  isPaid: false,
};

const AnimatedPanel: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className = "",
}) => (
  <div
    className={`relative bg-white border border-[#e5eaf2] rounded-2xl flex flex-col min-h-[520px] w-full overflow-hidden ${className}`}
    style={{
      animation: "fadein-up .7s cubic-bezier(0.18,0.8,0.27,1) both",
    }}
  >
    {children}
    <style>{`
      @keyframes fadein-up {
        0% {opacity:0; transform:translateY(32px) scale(.97);}
        100% {opacity:1; transform:translateY(0) scale(1);}
      }
    `}</style>
  </div>
);

const FormSection: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className = "",
}) => (
  <div className={`flex flex-col flex-1 px-7 py-7 gap-7 ${className}`}>
    {children}
  </div>
);

const CreateEvent: React.FC = () => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageLoading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  // --- AI Suggest Title State ---
  const [suggesting, setSuggesting] = useState(false);
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  const router = useRouter();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema) as any,
    defaultValues: DEFAULT_VALUES,
    mode: "onTouched",
  });

  const createEventMutation = useCreateEvent();
  const uploading = createEventMutation.isPending || imageLoading;

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

  // Handle Suggest Title button click
  const handleSuggestClick = async () => {
    setSuggestError(null);
    setSuggesting(true);
    setSuggestedTitles([]);
    try {
      const description = form.watch("description")?.toString() || "";
      if (!description || description.trim().length < 8) {
        setSuggestError("Add some event description for creative title suggestions.");
        setSuggesting(false);
        return;
      }
      const titles = await suggestTitles(description);
      if (!titles || !Array.isArray(titles) || titles.length === 0) {
        setSuggestError("No suggestions found.");
      } else {
        setSuggestedTitles(titles);
      }
    } catch (e) {
      setSuggestError("You're out of credit");
    }
    setSuggesting(false);
  };

  // Handle clicking a suggestion
  const handleTitleSuggestion = (title: string) => {
    form.setValue("title", title, { shouldValidate: true, shouldDirty: true });
    setSuggestedTitles([]);
    setSuggestError(null);
  };

  const PRIMARY = "var(--primary)"
  // Handle submit
  const onSubmit = async (values: EventFormValues) => {
    const file = values.imageFile as File | null;
    try {
      const formData = new FormData();
      formData.append("title", values.title.trim());
      formData.append("date", values.date.trim());
      formData.append("location", values.location.trim());
      formData.append("description", values.description?.trim?.() ?? "");
      if (typeof values.price === "number") {
        formData.append("price", values.price);
      } else if (typeof values.price === "string" && values.price.trim() !== "") {
        formData.append("price", values.price.trim());
      } else {
        formData.append("price", "0");
      }
      formData.append("currency", values.currency?.trim() || "NGN");
      formData.append("isPaid", values.isPaid ? "true" : "false");

      if (file instanceof File) formData.append("image", file);

      createEventMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("🎉 Event created!");
          form.reset(DEFAULT_VALUES);
          setImagePreviewUrl("");
          setTimeout(() => router.push("/admin/events"), 900);
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message ||
            err?.message ||
            "Failed to create event."
          );
        },
      });
    } catch (error) {
      toast.error("Unexpected error creating event.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4 py-10 md:py-20 lg:px-0 bg-[#F8FBFF]">
      <div className="w-full max-w-xl mx-auto">
        <AnimatedPanel>
          {/* Header */}
          <div className="flex justify-between items-center px-7 pt-7 pb-3 border-b border-[#e4eaf7] bg-white relative z-10">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[var(--primary-light, #f2f3fc)] p-2 border-2 border-[var(--primary-a10, #e5eaf4)]">
                <MdEvent className="text-[var(--primary, #563be7)]" size={24} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[var(--primary-dark, #2d325a)] tracking-tight">
                Create <span className="text-[var(--primary, #563be7)]">Event</span>
              </h2>
            </div>
            <span className="uppercase text-[11px] tracking-widest font-bold text-[var(--primary, #563be7)] bg-[var(--primary-lightest, #efe8ff)] px-3 py-1.5 rounded-2xl border border-[var(--primary-a20,#dedffe)]">
              Admin
            </span>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              autoComplete="off"
              className="flex flex-col flex-1 gap-0"
            >
              {/* Banner / Dropzone */}
              <div className="px-7 pt-7">
                <FormField
                  control={form.control}
                  name="imageFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-[var(--primary-dark, #41547d)] mb-2 flex items-center gap-2">
                        <MdImage className="text-[var(--primary, #563be7)]" />
                        Upload Cover Image{" "}
                        <span className="text-[var(--primary, #ba84e7)] font-normal italic ml-1">
                          (Optional — helps your event stand out)
                        </span>
                      </FormLabel>
                      <DropImageDual
                        value={field.value ?? undefined}
                        onDrop={file => {
                          field.onChange(file ?? null);
                          handleDrop(file ?? null);
                        }}
                        inputRef={imageInputRef as React.RefObject<HTMLInputElement>}
                        disabled={uploading}
                      />
                      <FormMessage className="text-xs text-[#FF3B3B] mt-1 font-semibold" />
                    </FormItem>
                  )}
                />
              </div>

              <FormSection>
                {/* AI SUGGESTION TOOL HIGHLIGHT */}
                <div className="mb-1.5 select-none">
                  <div className="flex items-center gap-2 mb-1 pl-0.5">
                    <MdSmartToy className="text-xl text-[#7d47fa]" aria-label="AI" />
                    <span className="font-bold text-base sm:text-lg text-[var(--primary-dark, #2d325a)] tracking-tight leading-tight">
                      Creative spark: Name your event with AI!
                    </span>
                  </div>
                  <div className="text-xs text-[#6e6aa0] mb-1 ml-8 italic bg-[#f8f6fc] px-3 py-1.5 border border-[#eee7fb] rounded">
                    Describe your event below then tap <b className="text-[#895ee7] font-semibold">AI Suggest</b> for unique titles.
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <span className="text-[16px] font-extrabold text-[var(--primary-darkest, #322d61)] uppercase tracking-wide flex items-center gap-1">
                          <MdEvent />
                          Event Title
                        </span>
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-stretch sm:items-center gap-1 sm:gap-2 border border-[var(--primary-a30,#efe3fe)] bg-white rounded-md overflow-hidden">
                          <Input
                            {...field}
                            placeholder="e.g. Tech Summit 2024"
                            maxLength={80}
                            disabled={uploading}
                            autoFocus
                            className="text-[15px] px-4 py-2 bg-transparent border-0 focus:ring-0 text-[var(--primary-text, #211151)] font-semibold flex-1"
                          />
                          <button
                            type="button"
                            disabled={uploading || suggesting}
                            onClick={handleSuggestClick}
                            className={`
                              inline-flex items-center px-3 py-2 text-xs sm:text-sm font-bold border-l border-[#E6D8FB]
                              bg-[#f6f5fa]
                              text-[#7d47fa] transition
                              disabled:opacity-70 disabled:cursor-not-allowed
                              focus:outline-none
                            `}
                            style={{
                              minWidth: 110,
                            }}
                            title="Suggest titles with AI"
                          >
                            {suggesting ? (
                              <>
                                <span className="animate-spin mr-1">&#8635;</span>
                                Suggesting...
                              </>
                            ) : (
                              <>
                                <MdSmartToy className="mr-1 text-base" aria-label="AI" />
                                <span className="hidden xs:inline">AI Suggest</span>
                                <span className="xs:hidden">AI</span>
                              </>
                            )}
                          </button>
                        </div>
                      </FormControl>
                      {suggestError && (
                        <div className="text-xs text-[#c72732] bg-[#fff4f6] border border-[#fcced7] px-3 py-1.5 mt-2 rounded font-bold flex items-center gap-2">
                          <span role="img" aria-label="warn">⚠️</span>
                          {suggestError}
                        </div>
                      )}
                      {suggestedTitles.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2 bg-[var(--primary-bg-light, #faf9ff)] border border-[var(--primary-a40,#e2dcfb)] rounded px-3 py-2">
                          {suggestedTitles.slice(0, 5).map((title, idx) => (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => handleTitleSuggestion(title)}
                              className="transition border border-transparent bg-[var(--primary-a10,#f4f1fd)] hover:bg-[var(--primary-a20,#f9eafd)] text-[var(--primary-dark, #6244b2)] rounded px-3 py-1 text-xs font-bold"
                            >
                              <span className="truncate">{title}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      <FormMessage className="text-xs mt-1" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <span className="text-[15px] font-bold text-[#5740c0] uppercase tracking-wide flex items-center gap-1">
                          <MdSmartToy /> Description
                        </span>
                      </FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          placeholder="Tell the story, energy, and purpose of the event! (Optional, max 2000 chars)"
                          maxLength={2000}
                          rows={4}
                          disabled={uploading}
                          className="text-[15px] px-5 py-2 rounded-md border border-[var(--primary-a60,#e4e1f7)] focus:border-[var(--primary, #705cfa)] bg-[var(--primary-bg-superlight,#f8f7fd)] transition resize-none font-medium text-[var(--primary-text2,#282850)]"
                        />
                      </FormControl>
                      <FormMessage className="text-xs mt-1" />
                    </FormItem>
                  )}
                />

                <div className="flex gap-6 flex-col md:flex-row">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <span className="text-[15px] font-medium text-[var(--primary-darkest,#322d61)] tracking-wide flex items-center gap-1">
                              <MdEvent /> Date
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="date"
                              min={new Date().toISOString().split("T")[0]}
                              disabled={uploading}
                              className="text-[15px] px-4 py-2 rounded-md border border-[var(--primary-a60,#e4e1f7)] focus:border-[var(--primary,#705cfa)] bg-[var(--primary-bg-superlight,#f8f7fd)] transition text-[var(--primary-dark2,#344178)] font-semibold"
                            />
                          </FormControl>
                          <FormMessage className="text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <span className="text-[15px] font-medium text-[var(--primary-darkest,#322d61)] tracking-wide flex items-center gap-1">
                              <MdLocationOn /> Location
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g. Life Camp, Abuja"
                              maxLength={60}
                              disabled={uploading}
                              className="text-[15px] px-4 py-2 rounded-md border border-[var(--primary-a60,#e4e1f7)] focus:border-[var(--primary,#705cfa)] bg-[var(--primary-bg-superlight,#f8f7fd)] transition text-[var(--primary-dark2,#344178)] font-semibold"
                            />
                          </FormControl>
                          <FormMessage className="text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* PRICE & PAID SECTION */}
                <div className="flex gap-6 flex-col md:flex-row">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <span className="text-[15px] font-medium text-[var(--primary,#6841ec)] tracking-wide flex items-center gap-1">
                              <MdOutlineAttachMoney /> Price
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min={0}
                              step={1}
                              inputMode="numeric"
                              placeholder="0 = Free"
                              disabled={uploading || !form.watch("isPaid")}
                              className="text-[15px] px-4 py-2 rounded-md border border-[var(--primary-a50,#dacdf5)] focus:border-[var(--primary,#6841ec)] bg-[var(--primary-bg-light2,#fafbff)] transition font-bold text-[var(--primary-dark,#583cac)]"
                            />
                          </FormControl>
                          <FormMessage className="text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <span className="text-[15px] font-medium text-[var(--primary,#6841ec)] tracking-wide flex items-center gap-1">
                              <FaRegMoneyBillAlt /> Currency
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Currency (e.g. NGN, USD)"
                              maxLength={8}
                              disabled={uploading || !form.watch("isPaid")}
                              className="text-[15px] px-4 py-2 rounded-md border border-[var(--primary-a50,#dacdf5)] focus:border-[var(--primary,#6841ec)] bg-[var(--primary-bg-light2,#fafbff)] transition font-bold text-[var(--primary-dark,#583cac)]"
                            />
                          </FormControl>
                          <FormMessage className="text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                {/* IS PAID CHECKBOX */}
                <div className="flex items-center gap-2 mt-1">
                  <FormField
                    control={form.control}
                    name="isPaid"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-2">
                        <input
                          id="isPaid"
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          disabled={uploading}
                          className="w-5 h-5 border-[var(--primary-a70,#dfc8ff)] accent-[var(--primary,#8e5efc)] focus:ring-[var(--primary-a80,#d7cbfa)] mr-2"
                        />
                        <FormLabel htmlFor="isPaid" className="mb-0 cursor-pointer text-[15px] text-[var(--primary,#6841ec)] font-bold tracking-tight flex items-center gap-1">
                          <AiOutlineCheckSquare /> Paid Event
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <span className="text-xs text-[#858399]">(Uncheck for free event; if checked, specify price &amp; currency.)</span>
                </div>
              </FormSection>

              <div className="flex flex-col items-stretch px-7 pb-8 gap-2 rounded-b-2xl bg-white">
                <NaapButton
                  type="submit"
                  variant="primary"
                  loading={uploading}
                  disabled={uploading}
                  style={{ backgroundColor: "var(--primary)" }}
                  className="mt-4 px-7 py-3 font-extrabold text-[16px] rounded-full text-white hover:bg-[color-mix(in_srgb,var(--primary),#000_20%)] transition-all uppercase tracking-wider border-none"
                  icon={!uploading ? (
                    <MdAdd className="text-xl mr-2" />
                  ) : undefined}
                  iconPosition="left"
                  loadingText="Creating..."
                >
                  Create Event
                </NaapButton>
              </div>
            </form>
          </Form>
        </AnimatedPanel>
      </div>
      <style jsx global>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg);}
        }
      `}</style>
      <style jsx global>{`
        :root {
          --primary: #563be7; /* or your primary color */
          --primary-light: #f2f3fc;
          --primary-lightest: #efe8ff;
          --primary-a10: #e5eaf4;
          --primary-a20: #dedffe;
          --primary-a30: #efe3fe;
          --primary-a40: #e2dcfb;
          --primary-a50: #dacdf5;
          --primary-a60: #e4e1f7;
          --primary-a70: #dfc8ff;
          --primary-a80: #d7cbfa;
          --primary-bg-light: #faf9ff;
          --primary-bg-light2: #fafbff;
          --primary-bg-superlight: #f8f7fd;
          --primary-dark: #6244b2;
          --primary-dark2: #344178;
          --primary-darkest: #322d61;
          --primary-text: #211151;
          --primary-text2: #282850;
        }
      `}</style>
    </div>
  );
};

export default CreateEvent;
