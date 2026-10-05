export { cn } from "cn";

import { toast } from "@/components/ui/toast";

/**
 * Copies plain text to user's system clipboard using navigator.clipboard API
 * with optional toast notifications.
 */
export async function copyToClipboard(
  text: string,
  options?: { label?: string; showToast?: boolean }
): Promise<boolean> {
  const { label = "Text", showToast = true } = options || {};
  try {
    await navigator.clipboard.writeText(text);
    if (showToast) {
      toast.add({
        type: "success",
        title: "Copied to clipboard",
        description: `${label} copied successfully.`,
      });
    }
    return true;
  } catch (err) {
    console.error("Failed to copy text to clipboard:", err);
    if (showToast) {
      toast.add({
        type: "error",
        title: "Copy Failed",
        description: `Could not copy ${label.toLowerCase()} to clipboard.`,
        priority: "high",
      });
    }
    return false;
  }
}

/**
 * Returns formatted user full name or fallback identifier
 */
export function getDisplayName(
  person?: {
    first_name?: string | null;
    last_name?: string | null;
    username?: string | null;
    email?: string | null;
  } | null,
  fallback = "Unknown"
): string {
  if (!person) return fallback;
  const fullName = `${person.first_name || ""} ${person.last_name || ""}`.trim();
  return fullName || person.username || person.email || fallback;
}

/**
 * Returns user initial letter (uppercase) for avatars
 */
export function getInitials(name?: string | null, fallback = "?"): string {
  if (!name || !name.trim()) return fallback;
  return name.trim().charAt(0).toUpperCase();
}

/**
 * Formats ISO timestamp to short human-readable 12-hour clock (e.g. 10:45 AM)
 */
export function formatMessageTime(timestamp?: string | number | Date | null): string {
  if (!timestamp) return "";
  try {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}
