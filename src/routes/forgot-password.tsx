import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { requestPasswordReset } from "@/lib/api/auth.functions";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [{ title: "Reset Password — NinetyMinds" }],
  }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!email.trim()) return setError("Please enter your email address.");
    setLoading(true);
    setError(null);
    try {
      // Always shows the same success state regardless of whether the email
      // is actually registered — this stops the form being used to check
      // which emails exist on the platform.
      await requestPasswordReset({ data: { email } });
      setSent(true);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
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
          <h1 className="font-display text-3xl mb-2">Reset your password.</h1>
          <p className="text-muted-foreground text-sm">We'll email you a link to choose a new one.</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 space-y-5">
          {sent ? (
            <div className="text-center space-y-3">
              <div className="text-sm text-foreground">
                If an account exists for <span className="font-medium">{email}</span>, you'll get an email shortly with a link to reset your password.
              </div>
              <Link to="/login" className="inline-block text-sm text-pitch hover:underline">← Back to sign in</Link>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-ink text-cream font-medium text-sm hover:bg-pitch transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send reset link →"}
              </button>
              <p className="text-sm text-center text-muted-foreground">
                <Link to="/login" className="text-pitch hover:underline">← Back to sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}