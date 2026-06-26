import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { validateNewPassword } from "@/lib/api/auth.functions";
import { PasswordInput } from "@/components/PasswordInput";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Choose New Password — NinetyMinds" }],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Clicking the reset link in the email lands here with a recovery
    // session already established by the Supabase client (it reads the
    // token out of the URL automatically). We just need to confirm it's there.
    async function check() {
      const { data: { session } } = await supabase.auth.getSession();
      setHasSession(!!session);
      setCheckingSession(false);
    }
    check();
  }, []);

  async function handleSubmit() {
    if (!password || !confirmPassword) return setError("Please fill in both fields.");
    if (password !== confirmPassword) return setError("Passwords don't match.");

    setLoading(true);
    setError(null);
    try {
      // Server-side format check first (defense in depth), then the actual
      // update happens client-side using the recovery session from the link.
      await validateNewPassword({ data: { password } });

      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw new Error(updateError.message);

      setDone(true);
      setTimeout(() => navigate({ to: "/dashboard" }), 1500);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <h1 className="font-display text-3xl mb-3">Link expired or invalid.</h1>
          <p className="text-muted-foreground text-sm mb-6">Please request a new password reset link.</p>
          <Link to="/forgot-password" className="text-pitch hover:underline text-sm">Request a new link →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl mb-2">Choose a new password.</h1>
          <p className="text-muted-foreground text-sm">At least 8 characters.</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 space-y-5">
          {done ? (
            <div className="text-center text-sm text-pitch font-medium">✓ Password updated. Redirecting to your dashboard...</div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-1.5">New password</label>
                <PasswordInput value={password} onChange={setPassword} placeholder="At least 8 characters" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Confirm new password</label>
                <PasswordInput
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Re-enter your password"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-ink text-cream font-medium text-sm hover:bg-pitch transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update password →"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}