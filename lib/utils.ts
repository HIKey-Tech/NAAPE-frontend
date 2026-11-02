import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function normalizeArray(input?: string | string[]) {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  return input
    .split(/[,;]+/)
    .map((v) => v.trim())
    .filter(Boolean);
}

export function getAuthorLabel(author: any) {
  if (!author) return "Unknown";
  return author?.name || author?.email || author?._id || "Unknown";
}

export function isOwner(user: any, author: any) {
  if (!user || !author) return false;
  return (
    String(user?._id) === String(author?._id) ||
    String(user?.email).toLowerCase() ===
    String(author?.email).toLowerCase()
  );
}

/**
 * Optimizes Cloudinary image URLs on the fly by injecting auto-format,
 * auto-quality compression, and responsive max-width constraints.
 * Non-Cloudinary or local paths are returned unchanged.
 */
export function optimizeCloudinaryUrl(url?: string, width = 800): string {
  if (!url) return "/images/plane.jpg";
  if (typeof url !== "string") return url;
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    if (url.includes("/upload/f_auto") || url.includes("/upload/q_auto")) {
      return url;
    }
    return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width},c_limit/`);
  }
  return url;
}
