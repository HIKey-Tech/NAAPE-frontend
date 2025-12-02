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


// --- Validation Schema ---
// Incorporate EventCardProps fields into Zod schema, defaulting optional fields
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

  // Accept File | null | undefined ONLY
  imageFile: z
    .instanceof(File)
    .optional()
    .or(z.null()),

  description: z
    .string()
    .max(2000)
    .optional()
    .or(z.literal("")),

  // ALWAYS treat price as string for the form
  price: z
    .string()
    .regex(/^\d*(\.\d{1,2})?$/, "Invalid amount")
    .optional(),

  // Always string
  currency: z.string().max(8).optional(),

  // Checkbox handled directly (boolean)
  isPaid: z.boolean().default(false),
});

type EventFormValues = z.infer<typeof eventSchema>;



/**
 * Default values:
 * Use the EventCardProps fields, set reasonable defaults for optional fields.
 * price: empty string for free (will convert to 0 later)
 * isPaid: false
 * currency: 'NGN'
 */
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
    className={`bg-white border border-[#e5eaf2] rounded-2xl shadow transition-shadow hover:shadow-md flex flex-col min-h-[500px] w-full overflow-hidden ${className}`}
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
  <div className={`flex flex-col flex-1 px-7 py-6 gap-6 ${className}`}>{children}</div>
);

const CreateEvent: React.FC = () => {
  // State
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageLoading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();

  // Form
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema) as any, // type workaround for isPaid type mismatch
    defaultValues: DEFAULT_VALUES,
    mode: "onTouched",
  });

  // API Mutation
  const createEventMutation = useCreateEvent();
  const uploading = createEventMutation.isPending || imageLoading;

  // Image drop handler
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

  // Handle submit
  const onSubmit = async (values: EventFormValues) => {
    const file = values.imageFile as File | null;
    try {
      const formData = new FormData();
      formData.append("title", values.title.trim());
      formData.append("date", values.date.trim());
      formData.append("location", values.location.trim());
      formData.append("description", values.description?.trim?.() ?? "");
      // Map modern EventCardProps form fields
      if (typeof values.price === "number") {
        formData.append("price", values.price);
      } else if (typeof values.price === "string" && values.price.trim() !== "") {
        formData.append("price", values.price.trim());
      } else {
        formData.append("price", "0"); // free by default
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
    <div className="flex justify-center items-center min-h-[80vh] px-2 py-10 md:py-20 lg:px-0 bg-[#F8FBFF]">
      <div className="w-full max-w-lg mx-auto">
        <AnimatedPanel>
          <div className="flex justify-between items-center px-7 pt-7 pb-2 border-b border-[#edf2fa]">
            <h2 className="text-2xl font-bold text-[#274fb7] tracking-tight">
              Create Event
            </h2>
            <span className="text-xs text-[#96A6BF] font-semibold uppercase">
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
                        disabled={uploading}
                      />
                      <FormMessage className="text-xs text-red-600 mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              <FormSection>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <span className="text-[15px] font-medium text-[#294e8c]">
                          Event Title
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. Tech Summit 2024"
                          maxLength={80}
                          disabled={uploading}
                          autoFocus
                          className="text-[15px] px-4 py-2 rounded-md border border-[#DFE7FA] focus:border-[#4267E7] focus:ring-[#cdd8f7] bg-[#FBFCFF] transition"
                        />
                      </FormControl>
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
                        <span className="text-[15px] font-medium text-[#294e8c]">
                          Description
                        </span>
                      </FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          placeholder="Event description (optional)"
                          maxLength={2000}
                          rows={4}
                          disabled={uploading}
                          className="text-[15px] px-4 py-2 rounded-md border border-[#DFE7FA] focus:border-[#4267E7] focus:ring-[#cdd8f7] bg-[#FBFCFF] transition resize-none"
                        />
                      </FormControl>
                      <FormMessage className="text-xs mt-1" />
                    </FormItem>
                  )}
                />
                <div className="flex gap-4 flex-col md:flex-row">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <span className="text-[15px] font-medium text-[#294e8c]">
                              Date
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="date"
                              min={new Date().toISOString().split("T")[0]}
                              disabled={uploading}
                              className="text-[15px] px-4 py-2 rounded-md border border-[#DFE7FA] focus:border-[#4267E7] focus:ring-[#cdd8f7] bg-[#FBFCFF] transition"
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
                            <span className="text-[15px] font-medium text-[#294e8c]">
                              Location
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g. Life Camp, Abuja"
                              maxLength={60}
                              disabled={uploading}
                              className="text-[15px] px-4 py-2 rounded-md border border-[#DFE7FA] focus:border-[#4267E7] focus:ring-[#cdd8f7] bg-[#FBFCFF] transition"
                            />
                          </FormControl>
                          <FormMessage className="text-xs mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* PRICE & PAID SECTION */}
                <div className="flex gap-4 flex-col md:flex-row">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <span className="text-[15px] font-medium text-[#294e8c]">
                              Price
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
                              className="text-[15px] px-4 py-2 rounded-md border border-[#DFE7FA] focus:border-[#4267E7] focus:ring-[#cdd8f7] bg-[#FBFCFF] transition"
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
                            <span className="text-[15px] font-medium text-[#294e8c]">
                              Currency
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Currency (e.g. NGN, USD)"
                              maxLength={8}
                              disabled={uploading || !form.watch("isPaid")}
                              className="text-[15px] px-4 py-2 rounded-md border border-[#DFE7FA] focus:border-[#4267E7] focus:ring-[#cdd8f7] bg-[#FBFCFF] transition"
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
                          className="w-4 h-4 border-[#DFE7FA] accent-[#4267E7] mr-2"
                        />
                        <FormLabel htmlFor="isPaid" className="mb-0 cursor-pointer text-[15px] text-[#294e8c]">
                          Paid Event
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <span className="text-xs text-[#8CA1B6]">(Uncheck for free event. If checked, specify price and currency.)</span>
                </div>
              </FormSection>

              <div className="flex flex-col items-stretch px-7 pb-7 gap-2">
                <NaapButton
                  type="submit"
                  variant="primary"
                  loading={uploading}
                  disabled={uploading}
                  className="mt-4 px-7 py-2.5 font-semibold text-[15px]"
                  icon={!uploading ? (
                    <span className="text-lg mr-1">+</span>
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
    </div>
  );
};

export default CreateEvent;
