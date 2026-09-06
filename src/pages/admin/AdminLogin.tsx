import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { BrandMark } from "@/components/ui/BrandMark";
import { isSupabaseConfigured } from "@/lib/supabase";
import { isDemoAuthAvailable } from "@/services/auth.service";

export function AdminLogin() {
  const { isAuthed, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (isAuthed) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      navigate("/admin");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-void px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <BrandMark size={48} />
          </div>
          <h1 className="font-display text-2xl font-bold text-ink">Admin sign in</h1>
          <p className="mt-1 text-sm text-haze">Manage wallpapers and collections.</p>
        </div>

        {!isSupabaseConfigured && (
          <div className="glass mb-5 rounded-control px-4 py-3 text-xs text-purple-300">
            {isDemoAuthAvailable
              ? "Demo mode: sign in with any email and the VITE_ADMIN_DEMO_PASSWORD from your .env file."
              : "Supabase isn't configured yet. Add credentials to .env, or set VITE_ADMIN_DEMO_PASSWORD to preview the admin dashboard locally."}
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass space-y-4 rounded-card p-6">
          {error && (
            <div className="rounded-control border border-white/20 bg-white/[0.06] px-4 py-3 text-sm font-medium text-ink">
              {error}
            </div>
          )}
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-haze">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="you@moonpaper.com"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-haze">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
          </label>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
