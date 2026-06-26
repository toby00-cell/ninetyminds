import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { serverLogin } from "@/lib/api/auth.functions";
import { PasswordInput } from "@/components/PasswordInput";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Sign In — NinetyMinds" }],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", password: "" });

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setError(null);
  }

  async function handleSubmit() {
    if (!form.email || !form.password) return setError("Please fill in all fields.");
    setLoading(true);
    setError(null);
    try {
      // All format/length validation, sanitization, and the actual auth
      // check now happen server-side in serverLogin — this call can't be
      // bypassed by disabling JS or hitting the API directly with bad input.
      const result = await serverLogin({ data: { email: form.email, password: form.password } });

      const { error: sessionError } = await supabase.auth.setSession({
        access_token: result.access_token,
        refresh_token: result.refresh_token,
      });
      if (sessionError) throw new Error(sessionError.message);

      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 font-display text-2xl mb-6">
            <span className="inline-block h-2 w-2 rounded-full bg-ember" />
            ninety<span className="text-pitch">minds</span>
          </Link>
          <h1 className="font-display text-3xl mb-2">Welcome back.</h1>
          <p className="text-muted-foreground text-sm">Sign in to your account.</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">Email address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium">Password</label>
              <Link to="/forgot-password" className="text-xs text-pitch hover:underline">Forgot password?</Link>
            </div>
            <PasswordInput
              value={form.password}
              onChange={(v) => set("password", v)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Your password"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-ink text-cream font-medium text-sm hover:bg-pitch transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in →"}
          </button>
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-1">
            <Link to="/register/athlete" className="text-pitch hover:underline">
              Create athlete profile
            </Link>
            <Link to="/register/scout" className="text-pitch hover:underline">
              Join as a scout
            </Link>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <Link to="/register/club" className="text-pitch hover:underline">
              Register your club
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}