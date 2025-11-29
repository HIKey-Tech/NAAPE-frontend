"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const ACCEPT_IMAGE = "image/jpeg,image/png,image/gif,image/webp,image/jpg";
const MAX_IMAGE_SIZE_MB = 10;

const COLORS = {
  background: "#fff",
  border: "#b9cdf1",
  borderHighlight: "#7591e6",
  iconBg: "#FFF5E0",
  iconRect: "#FFE7B2",
  iconRectStroke: "#FFD580",
  iconCircle: "#FFA602",
  iconDetail: "#FFCE73",
  text: "#585858",
  subText: "#757575",
};

function isImageFile(file: File): boolean {
  const validTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/jpg",
  ];
  if (validTypes.includes(file.type)) return true;

  const name = file.name.toLowerCase();
  return [".jpg", ".jpeg", ".png", ".gif", ".webp"].some((ext) =>
    name.endsWith(ext)
  );
}

const defaultIcon = (
  <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
    <rect width="54" height="54" rx="12" fill={COLORS.iconBg} />
    <g filter="url(#icon_dropshadow)">
      <rect x="12" y="14" width="30" height="26" rx="4" fill={COLORS.iconRect} />
      <rect
        x="12.5"
        y="14.5"
        width="29"
        height="25"
        rx="3.5"
        stroke={COLORS.iconRectStroke}
      />
    </g>
    <circle cx="19.5" cy="21.5" r="2.5" fill={COLORS.iconCircle} />
    <path
      d="M14 36l6.881-8.13c1.572-1.855 4.409-1.855 5.981 0l8.607 10.163c1.384 1.634 4.08 1.015 4.08-1.037V18a4 4 0 00-4-4H16a4 4 0 00-4 4v20a2 2 0 003.246 1.617z"
      fill={COLORS.iconDetail}
      fillOpacity=".4"
    />
    <defs>
      <filter
        id="icon_dropshadow"
        x="10"
        y="12"
        width="34"
        height="30"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur" />
      </filter>
    </defs>
  </svg>
);

type DropImageProps = {
  value: File | undefined;
  onDrop: (file: File | undefined) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  disabled?: boolean;
};

export default function DropImageDual({
  value,
  onDrop,
  inputRef,
  disabled = false,
}: DropImageProps) {
  const localInputRef = useRef<HTMLInputElement>(null);
  const actualRef = inputRef || localInputRef;

  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (value instanceof File && isImageFile(value)) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);

      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [value]);

  const handleBrowse = () => {
    if (!disabled) actualRef.current?.click();
  };

  const handleFileSelection = useCallback(
    (files: FileList | null) => {
      if (!files?.length) {
        onDrop(undefined);
        return;
      }

      const file = Array.from(files).find(isImageFile);
      if (!file) {
        window.alert(
          "Only image files are allowed. Supported: JPG, JPEG, PNG, GIF, WEBP."
        );
        onDrop(undefined);
        return;
      }

      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        window.alert(`File too large. Max size is ${MAX_IMAGE_SIZE_MB}MB.`);
        onDrop(undefined);
        return;
      }

      onDrop(file);
    },
    [onDrop]
  );

  const dragEvents = {
    onDragEnter: (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragActive(true);
    },
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    },
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragActive(false);
    },
    onDrop: (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragActive(false);
      if (!disabled) handleFileSelection(e.dataTransfer.files);
    },
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelection(e.target.files);
    e.target.value = ""; // allow reselection of same file
  };

  return (
    <div>
      <div className="flex flex-col items-center select-none">
        <div
          role="button"
          tabIndex={0}
          aria-disabled={disabled}
          onClick={handleBrowse}
          {...dragEvents}
          className={cn(
            "w-full flex flex-col items-center px-3 py-7 transition-all rounded-[14px] min-h-[210px] shadow-sm cursor-pointer",
            dragActive
              ? "border-2 border-blue-400 bg-blue-50"
              : "border-2 border-dashed border-[#b9cdf1] bg-white hover:bg-blue-50"
          )}
        >
          <input
            ref={actualRef}
            type="file"
            className="hidden"
            accept={ACCEPT_IMAGE}
            disabled={disabled}
            onChange={handleInputChange}
            aria-label="Choose an image"
          />

          <div className="mb-4">{defaultIcon}</div>

          <div className="font-semibold text-base text-[#585858] mb-1 text-center">
            Upload Image
          </div>

          <p className="text-xs text-center text-[#757575] leading-relaxed mb-2 w-11/12">
            <strong>Image:</strong> Minimum recommended width 800px.<br />
            Max 10MB • JPG, JPEG, PNG, GIF, WEBP
          </p>

          {previewUrl && (
            <div className="w-full flex justify-center mb-3">
              <Image
                src={previewUrl}
                alt="Preview"
                width={120}
                height={100}
                // unoptimized
                className="rounded-md border object-contain shadow"
              />
            </div>
          )}

          {value && (
            <div className="text-xs text-center text-[#585858] mt-1">
              <strong>Selected:</strong> {value.name}
            </div>
          )}

          {dragActive && (
            <div className="mt-3 bg-[#F0F8FF] text-xs text-[#585858] rounded px-2 py-0.5">
              Drop to upload
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
