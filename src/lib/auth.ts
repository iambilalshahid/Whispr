import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/toast";
import { authStore } from "@/stores/authStore";
import { chatStore } from "@/stores/chatStore";

/**
 * Reusable sign-out handler that signs out of Supabase,
 * resets MobX stores, and triggers a toast alert.
 */
export async function handleSignOut(callback?: () => void): Promise<void> {
  try {
    await supabase.auth.signOut();
    chatStore.reset();
    authStore.setSession(null);
    toast.add({
      type: "info",
      title: "Signed Out",
      description: "You have been signed out.",
    });
  } catch (error: any) {
    console.error("Sign out error:", error);
    toast.add({
      type: "error",
      title: "Error",
      description: error?.message || "Failed to sign out.",
    });
  } finally {
    if (callback) {
      callback();
    }
  }
}
