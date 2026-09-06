import { useCallback, useEffect, useState } from "react";
import { getCurrentSession, onAuthChange, signIn as signInService, signOut as signOutService } from "@/services/auth.service";

export function useAuth() {
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

  const refresh = useCallback(async () => {
    const session = await getCurrentSession();
    setIsAuthed(Boolean(session));
  }, []);

  useEffect(() => {
    refresh();
    const unsubscribe = onAuthChange(() => refresh());
    return unsubscribe;
  }, [refresh]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } = await signInService(email, password);
      if (!error) await refresh();
      return { error };
    },
    [refresh]
  );

  const signOut = useCallback(async () => {
    await signOutService();
    await refresh();
  }, [refresh]);

  return { isAuthed, signIn, signOut };
}
