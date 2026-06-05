import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/register/success")({
  head: () => ({
    meta: [{ title: "You're in — NinetyMinds" }],
  }),
  component: RegisterSuccess,
});

function RegisterSuccess() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-pitch/10 flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-pitch">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl mb-3">You're in.</h1>
        <p className="text-muted-foreground mb-3">
          Your profile has been created. Check your email to verify your account — then sign in to access your dashboard.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Didn't get an email? Check your spam folder.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to="/login"
            className="px-6 py-3 rounded-full bg-ink text-cream text-sm font-medium hover:bg-pitch transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/"
            className="px-6 py-3 rounded-full border border-border text-sm font-medium hover:bg-sand transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}