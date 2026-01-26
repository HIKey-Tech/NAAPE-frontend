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
