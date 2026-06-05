import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase-browser";

export const Route = createFileRoute("/register/athlete")({
  head: () => ({
    meta: [{ title: "Create Athlete Profile — NinetyMinds" }],
  }),
  component: AthleteRegister,
});

const POSITIONS = [
  "Goalkeeper", "Defender", "Right Back", "Left Back", "Centre Back",
  "Defensive Mid", "Midfielder", "Attacking Mid", "Winger", "Forward", "Striker",
];

function AthleteRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    pos: "",
    age: "",
    city: "",
    club: "",
    bio: "",
    caps: "",
    goals: "",
    assists: "",
  });

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setError(null);
  }

  function slugify(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { role: "athlete", name: form.name },
        },
      });

      if (authError) throw new Error(authError.message);
      const userId = authData.user?.id;
      if (!userId) throw new Error("Signup failed — no user returned.");

      // 2. Insert player profile (no photo — added after email confirmation)
      const slug = slugify(form.name);
      const { error: insertError } = await (supabase as any).from("players").insert({
        slug,
        name: form.name,
        pos: form.pos,
        age: parseInt(form.age),
        city: form.city,
        club: form.club,
        bio: form.bio,
        rating: 75,
        number: 0,
        highlights: [],
        stats: [
          { label: "Caps", value: form.caps || "0" },
          { label: "Goals", value: form.goals || "0" },
          { label: "Assists", value: form.assists || "0" },
        ],
        img_url: null,
        user_id: userId,
      });

      if (insertError) throw new Error(`Profile creation failed: ${insertError.message}`);

      navigate({ to: "/register/success" });
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12 lg:py-20">
        <div className="mb-10">
          <Link to="/" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
            ← Back to home
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl mt-4 mb-2">Create your athlete profile.</h1>
          <p className="text-muted-foreground">Get verified and get seen by scouts across Nigeria.</p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-3 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                step === s ? "bg-ink text-cream" : step > s ? "bg-pitch text-cream" : "bg-sand text-muted-foreground"
              }`}>
                {step > s ? "✓" : s}
              </div>
              <span className={`text-sm ${step === s ? "font-medium" : "text-muted-foreground"}`}>
                {s === 1 ? "Account" : s === 2 ? "Profile" : "Stats"}
              </span>
              {s < 3 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        {/* Step 1: Account */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email address</label>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-pitch" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="At least 8 characters" className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-pitch" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              onClick={() => {
                if (!form.email || !form.password) return setError("Please fill in all fields.");
                if (form.password.length < 8) return setError("Password must be at least 8 characters.");
                setStep(2);
              }}
              className="w-full py-3.5 rounded-xl bg-ink text-cream font-medium text-sm hover:bg-pitch transition-colors"
            >
              Continue →
            </button>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link to="/" className="text-pitch hover:underline">Sign in</Link>
            </p>
          </div>
        )}

        {/* Step 2: Profile */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Full name</label>
              <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Chidera Okonkwo" className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-pitch" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Position</label>
                <select value={form.pos} onChange={(e) => set("pos", e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-pitch">
                  <option value="">Select position</option>
                  {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Age</label>
                <input type="number" value={form.age} onChange={(e) => set("age", e.target.value)} placeholder="e.g. 19" min="14" max="40" className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-pitch" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">City</label>
                <input type="text" value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g. Lagos" className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-pitch" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Current club / Academy</label>
                <input type="text" value={form.club} onChange={(e) => set("club", e.target.value)} placeholder="e.g. Lagos Island FC" className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-pitch" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Bio</label>
              <textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Tell scouts who you are and what makes you stand out..." rows={4} className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-pitch resize-none" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-6 py-3.5 rounded-xl border border-border text-sm font-medium hover:bg-sand transition-colors">← Back</button>
              <button
                onClick={() => {
                  if (!form.name || !form.pos || !form.age || !form.city || !form.club) return setError("Please fill in all fields.");
                  setStep(3);
                }}
                className="flex-1 py-3.5 rounded-xl bg-ink text-cream font-medium text-sm hover:bg-pitch transition-colors"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Stats */}
        {step === 3 && (
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground">
              Enter your current stats. You can update these anytime from your profile after confirming your email.
            </p>
            <div>
              <label className="block text-sm font-medium mb-1.5">Stats</label>
              <div className="grid grid-cols-3 gap-4">
                {[["caps", "Caps"], ["goals", "Goals"], ["assists", "Assists"]].map(([field, label]) => (
                  <div key={field}>
                    <label className="block text-xs text-muted-foreground mb-1">{label}</label>
                    <input type="number" value={form[field as keyof typeof form]} onChange={(e) => set(field, e.target.value)} placeholder="0" min="0" className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-pitch" />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-sand/60 rounded-xl p-4 text-sm text-muted-foreground">
              📷 You'll be able to upload your profile photo after confirming your email.
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-6 py-3.5 rounded-xl border border-border text-sm font-medium hover:bg-sand transition-colors">← Back</button>
              <button onClick={handleSubmit} disabled={loading} className="flex-1 py-3.5 rounded-xl bg-ink text-cream font-medium text-sm hover:bg-pitch transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? "Creating profile..." : "Create my profile →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}