import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const DEMO_SESSION_KEY = "moonpaper_demo_admin_session";
const demoPassword = import.meta.env.VITE_ADMIN_DEMO_PASSWORD as string | undefined;

export const isDemoAuthAvailable = Boolean(!isSupabaseConfigured && demoPassword);

export async function getCurrentSession() {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.auth.getSession();
    return data.session;
  }
  return sessionStorage.getItem(DEMO_SESSION_KEY) === "1" ? { demo: true } : null;
}

export async function signIn(email: string, password: string): Promise<{ error: string | null }> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }

  if (!isDemoAuthAvailable) {
    return {
      error:
        "Admin login isn't configured yet. Add Supabase credentials, or set VITE_ADMIN_DEMO_PASSWORD for a local-only demo login.",
    };
  }

  if (password === demoPassword) {
    sessionStorage.setItem(DEMO_SESSION_KEY, "1");
    return { error: null };
  }
  return { error: "Incorrect password." };
}

export async function signOut(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut();
    return;
  }
  sessionStorage.removeItem(DEMO_SESSION_KEY);
}

export function onAuthChange(callback: (isAuthed: boolean) => void): () => void {
  if (isSupabaseConfigured && supabase) {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(Boolean(session));
    });
    return () => data.subscription.unsubscribe();
  }
  // Demo mode has no event stream; consumers re-check via getCurrentSession().
  return () => {};
}
