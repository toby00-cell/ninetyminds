import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { serverSignUpScout } from "@/lib/api/auth.functions";
import { PasswordInput } from "@/components/PasswordInput";

export const Route = createFileRoute("/register/scout")({
  head: () => ({
    meta: [{ title: "Scout Registration — NinetyMinds" }],
  }),
  component: ScoutRegister,
});

const ROLES = [
  "Head Scout", "Assistant Scout", "Academy Director", "Club Manager",
  "Agent", "Talent Coordinator", "Journalist / Media", "Other",
];

function ScoutRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    organisation: "",
    role: "",
  });

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setError(null);
  }

  async function handleSubmit() {
    if (submittingRef.current) return;

    if (!form.email || !form.password || !form.name || !form.organisation || !form.role) {
      return setError("Please fill in all fields.");
    }
    if (form.password.length < 8) {
      return setError("Password must be at least 8 characters.");
    }

    submittingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      // serverSignUpScout validates, sanitizes, creates the auth user, and
      // inserts the scouts row all server-side with the service role — so
      // there's no race condition with email confirmation, and no way to
      // bypass validation by skipping the client-side checks above.
      const result = await serverSignUpScout({ data: form });

      if (result.needsManualSignIn) {
        navigate({ to: "/login" });
        return;
      }

      const { error: sessionError } = await supabase.auth.setSession({
        access_token: result.access_token,
        refresh_token: result.refresh_token,
      });
      if (sessionError) throw new Error(sessionError.message);

      navigate({ to: "/register/success" });
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 sm:px-6 py-12 lg:py-20">
        <div className="mb-10">
          <Link to="/" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
            ← Back to home
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl mt-4 mb-2">Join as a scout.</h1>
          <p className="text-muted-foreground">Access verified grassroots talent across all 36 states.</p>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1.5">Full name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Emeka Eze"
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-pitch"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1.5">Organisation</label>
              <input
                type="text"
                value={form.organisation}
                onChange={(e) => set("organisation", e.target.value)}
                placeholder="e.g. Enyimba FC, Rangers Int'l"
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-pitch"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1.5">Your role</label>
              <select
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-pitch"
              >
                <option value="">Select role</option>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div className="border-t border-border pt-5 space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@club.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-pitch"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <PasswordInput
                value={form.password}
                onChange={(v) => set("password", v)}
                placeholder="At least 8 characters"
                className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-pitch"
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-ink text-cream font-medium text-sm hover:bg-pitch transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create scout account →"}
          </button>

          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-pitch hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}