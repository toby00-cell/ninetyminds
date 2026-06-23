import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

export const Route = createFileRoute("/register/club")({
  head: () => ({
    meta: [{ title: "Club Registration — NinetyMinds" }],
  }),
  component: ClubRegister,
});

function slugify(name: string) {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

function ClubRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    location: "",
    description: "",
  });

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setError(null);
  }

  async function handleSubmit() {
    if (submittingRef.current) return;

    if (!form.email || !form.password || !form.name || !form.location) {
      return setError("Please fill in all required fields.");
    }
    if (form.password.length < 8) {
      return setError("Password must be at least 8 characters.");
    }

    submittingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { role: "club", name: form.name },
        },
      });

      if (authError) throw new Error(authError.message);

      const user = authData.user;
      if (!user) throw new Error("Signup failed — no user returned.");

      // Same guard as scout/athlete signup: Supabase returns the existing
      // user silently (no error) when the email is already registered.
      if (user.identities && user.identities.length === 0) {
        throw new Error("An account with this email already exists. Please sign in instead.");
      }

      const slug = slugify(form.name);

      const { error: insertError } = await (supabase as any).from("clubs").insert({
        user_id: user.id,
        name: form.name,
        slug,
        location: form.location,
        description: form.description || null,
      });

      if (insertError) {
        if (insertError.code === "23505") {
          throw new Error("A club with a very similar name already exists. Try a more specific name.");
        }
        throw new Error(`Club profile creation failed: ${insertError.message}`);
      }

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
          <h1 className="font-display text-3xl sm:text-4xl mt-4 mb-2">Register your club.</h1>
          <p className="text-muted-foreground">Build a roster, run trials, and message players directly.</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">Club name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Lagos Island FC Academy"
              className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-pitch"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="e.g. Lagos, Nigeria"
              className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-pitch"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">About your club <span className="text-muted-foreground">(optional)</span></label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              placeholder="What's your club about? Age groups, achievements, philosophy..."
              className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-pitch resize-none"
            />
          </div>

          <div className="border-t border-border pt-5 space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="club@example.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-pitch"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-pitch"
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-ink text-cream font-medium text-sm hover:bg-pitch transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create club account →"}
          </button>

          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link to="/" className="text-pitch hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}