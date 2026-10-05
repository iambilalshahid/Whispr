import { makeAutoObservable, runInAction } from "mobx";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { disconnectSocket } from "@/lib/socket";

export class AuthStore {
  session: Session | null = null;
  isInitialized = false;
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  setSession(session: Session | null) {
    this.session = session;
  }

  setInitialized(initialized: boolean) {
    this.isInitialized = initialized;
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  get isAuthenticated(): boolean {
    return Boolean(this.session);
  }

  async initSession() {
    this.setLoading(true);
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Failed to retrieve session:", error.message);
      } else {
        runInAction(() => {
          this.session = data.session;
        });
      }
    } catch (err) {
      console.error("Unexpected error during session initialization:", err);
    } finally {
      runInAction(() => {
        this.isInitialized = true;
        this.isLoading = false;
      });
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      runInAction(() => {
        this.session = session;
      });
      if (!session) {
        disconnectSocket();
      }
    });
  }

  async refreshSession() {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      runInAction(() => {
        this.session = data.session;
      });
    }
  }

  async signOut() {
    await supabase.auth.signOut();
    runInAction(() => {
      this.session = null;
    });
    disconnectSocket();
  }
}

export const authStore = new AuthStore();
