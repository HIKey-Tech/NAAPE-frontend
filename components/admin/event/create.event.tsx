"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { uploadToCloudinary } from "@/app/api/cloudinary";

// Validation schema
const eventSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters.")
    .max(80, "Title must be at most 80 characters."),
  date: z
    .string()
    .min(1, "Date is required."),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters.")
    .max(60, "Location must be at most 60 characters."),
  imageUrl: z
    .string()
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .min(2, "Description must be at least 2 characters.")
    .max(2000, "Description must be at most 2000 characters.")
    .optional()
    .or(z.literal("")),
});

type EventFormValues = z.infer<typeof eventSchema>;

const DEFAULT_VALUES: EventFormValues = {
  title: "",
  date: "",
  location: "",
  imageUrl: "",
  description: "",
};

// Visual helper for dropzone
function ImageDropzone({ previewUrl, uploading, onImageSelect }: {
  previewUrl: string;
  uploading: boolean;
  onImageSelect: (file?: File) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // Drag-over styling
  const [dragActive, setDragActive] = React.useState(false);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onImageSelect(e.dataTransfer.files[0]);
    }
  };

  const onLabelClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      className={`
        relative w-full h-40 bg-[#F3F6FA] flex items-center justify-center
        overflow-hidden group border-2
        transition-all duration-200
        ${dragActive ? 'border-blue-400 bg-[#eaf2fd]' : 'border-dashed border-[#D5E3F7]'}
        rounded-xl mb-3
      `}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      aria-label="Event image dropzone"
      tabIndex={0}
    >
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Preview"
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 rounded-xl"
          draggable={false}
          loading="lazy"
        />
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full text-[#A6B3CB] pointer-events-none select-none">
          <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
            <rect width="48" height="48" rx="12" fill="#EAF0FA" />
            <path
              d="M16 26.3l4.6 5.63a2.4 2.4 0 003.397.22l10-9.138"
              stroke="#C4D1EF"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="19" cy="20" r="3" fill="#D5E3F7" />
          </svg>
          <span className="text-sm mt-2">Drag and drop an image here <span className="font-semibold text-[#4267E7]">or click below</span></span>
          <span className="text-xs mt-1 text-[#96A6BF]">(optional, max 2MB)</span>
        </div>
      )}
      <input
        ref={inputRef}
        id="event-image-upload"
        type="file"
        accept="image/*"
        className="hidden"
        disabled={uploading}
        onChange={e => {
          if (e.target.files?.[0]) onImageSelect(e.target.files[0]);
        }}
      />
      <Label
        htmlFor="event-image-upload"
        className={
          "absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#fff] border border-[#D5E3F7] px-3 py-1.5 rounded shadow text-xs text-[#4267E7] font-medium cursor-pointer hover:bg-[#EDF2FF] focus-visible:ring-2 focus-visible:ring-[#B2D7EF]"
          + (uploading ? " opacity-50 cursor-not-allowed" : "")
        }
        style={{ zIndex: 2, pointerEvents: uploading ? "none" : "auto" }}
        tabIndex={0}
        onClick={e => { e.preventDefault(); onLabelClick(); }}
      >
        Upload
      </Label>
      {previewUrl && !uploading &&
        <NaapButton
          type="button"
          color="danger"
          className="absolute top-3 right-3 px-2 py-1"
          onClick={e => { e.stopPropagation(); onImageSelect(undefined); }}
        >
          Remove
        </NaapButton>
      }
      {dragActive && (
        <div className="absolute inset-0 bg-blue-100 bg-opacity-20 pointer-events-none rounded-xl border-2 border-blue-400 border-dashed"></div>
      )}
    </div>
  );
};

const AnimatedPanel: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <div
    className={
      "bg-white border border-[#e5eaf2] rounded-2xl shadow transition-shadow hover:shadow-md flex flex-col min-h-[500px] w-full overflow-hidden " +
      (className ?? "")
    }
    style={{
      animation: "fadein-up .7s cubic-bezier(0.18,0.8,0.27,1) both"
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

const FormSection: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <div className={`flex flex-col flex-1 px-7 py-6 gap-6 ${className ?? ""}`}>
    {children}
  </div>
);

const CreateEvent: React.FC = () => {
  const [previewUrl, setPreviewUrl] = React.useState<string>("");
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imageLoading, setImageLoading] = React.useState(false);
  const router = useRouter();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onTouched",
  });

  const createEventMutation = useCreateEvent();

  // Either .isPending (react-query 5+) or .isLoading
  const uploading = createEventMutation.isPending || imageLoading;

  React.useEffect(() => {
    const subscription = form.watch(() => {
      setErrorMsg(null);
      setSuccessMsg(null);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Handle Image preview (client url, does not upload yet)
  const handleImageChange = React.useCallback((file?: File) => {
    if (!file) {
      setPreviewUrl("");
      setImageFile(null);
      form.setValue("imageUrl", "");
      form.trigger("imageUrl");
      return;
    }
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg("Image must be under 2MB.");
      return;
    }
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setImageFile(file);
    // Show preview but imageUrl is still empty until upload
    form.setValue("imageUrl", localUrl); // for required field logic
    form.trigger("imageUrl");
  }, [form]);

  // Use cloudinary utils for image upload
  async function uploadImageIfNeeded(file?: File): Promise<string | undefined> {
    if (!file) return undefined;
    try {
      setImageLoading(true);
        const url: any = await uploadToCloudinary(file);
      return url;
    } catch (err) {
      setErrorMsg("Failed to upload image.");
      return undefined;
    } finally {
      setImageLoading(false);
    }
  }

  const onSubmit = async (values: EventFormValues) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    let payload: any = { ...values };

    // If imageFile exists, upload and use the returned URL, using cloudinary helper
    if (imageFile) {
      const remoteUrl = await uploadImageIfNeeded(imageFile);
      if (!remoteUrl) {
        setErrorMsg("Could not upload the image.");
        return;
      }
      payload.imageUrl = remoteUrl;
    } else {
      if (!payload.imageUrl) delete payload.imageUrl;
    }

    if (!payload.description) {
      delete payload.description;
    }

    createEventMutation.mutate(payload, {
      onSuccess: () => {
        setSuccessMsg("🎉 Event created!");
        form.reset(DEFAULT_VALUES);
        setPreviewUrl("");
        setImageFile(null);
        setTimeout(() => {
          router.push("/admin/events");
        }, 900);
      },
      onError: (err: any) => {
        setErrorMsg(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to create event."
        );
      },
    });
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-2 py-10 md:py-20 lg:px-0 bg-[#F8FBFF]">
      <div className="w-full max-w-lg mx-auto">
        <AnimatedPanel>
          <div className="flex justify-between items-center px-7 pt-7 pb-2 border-b border-[#edf2fa]">
            <h2 className="text-2xl font-bold text-[#274fb7] tracking-tight">Create Event</h2>
            <span className="text-xs text-[#96A6BF] font-semibold uppercase">Admin</span>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              autoComplete="off"
              className="flex flex-col flex-1 gap-0"
            >
              {/* Banner / Dropzone */}
              <div className="px-7 pt-7">
                <ImageDropzone
                  previewUrl={previewUrl}
                  uploading={Boolean(uploading)}
                  onImageSelect={handleImageChange}
                />
              </div>

              <FormSection>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <span className="text-[15px] font-medium text-[#294e8c]">Event Title</span>
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
                        <span className="text-[15px] font-medium text-[#294e8c]">Description</span>
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
                            <span className="text-[15px] font-medium text-[#294e8c]">Date</span>
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
                            <span className="text-[15px] font-medium text-[#294e8c]">Location</span>
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
              </FormSection>

              <div className="flex flex-col items-stretch px-7 pb-7 gap-2">
                <NaapButton
                  type="submit"
                  variant="primary"
                  loading={Boolean(uploading)}
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
                {successMsg && (
                  <span className="text-green-700 bg-green-50 border border-green-200 rounded py-1 px-2 text-[14px] text-center mt-2 shadow-sm transition-all">
                    {successMsg}
                  </span>
                )}
                {errorMsg && (
                  <span className="text-[#D14343] bg-[#f6dad9] border border-[#ffc5c2] rounded py-1 px-2 text-[14px] text-center mt-2 shadow transition-all">
                    {errorMsg}
                  </span>
                )}
              </div>
            </form>
          </Form>
        </AnimatedPanel>
      </div>
    </div>
  );
};

export default CreateEvent;
