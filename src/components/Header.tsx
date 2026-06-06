import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Featured Players", to: "/featured-players" },
  { label: "Wellness Hub", to: "/wellness-hub" },
  { label: "How it Works", to: "/how-it-works" },
  { label: "Stories", to: "/stories" },
  { label: "Clubs", to: "/clubs" },
] as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => firstLinkRef.current?.focus(), 80);
    return () => {
      document.body.style.overflow = original;
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-2xl leading-none">
          <span className="inline-block h-2 w-2 rounded-full bg-ember" />
          ninety<span className="text-pitch">minds</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-8 text-sm">
          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-ember" }}
              activeOptions={{ exact: item.to === "/" }}
              className="hover:text-ember transition-colors focus-visible:outline-none focus-visible:text-ember"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="text-sm font-medium px-4 py-2 rounded-full bg-ink text-cream hover:bg-pitch transition-colors"
            >
              Dashboard →
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register/athlete"
                className="text-sm font-medium px-4 py-2 rounded-full bg-ink text-cream hover:bg-pitch transition-colors"
              >
                Join the trial →
              </Link>
            </>
          )}
        </div>

        <button
          ref={toggleRef}
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden inline-flex items-center justify-center min-h-11 min-w-11 rounded-md hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Overlay */}
      <div
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
        className={`md:hidden fixed inset-0 top-16 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer panel */}
      <div
        ref={panelRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={`md:hidden fixed inset-x-0 top-16 bg-background border-b border-border shadow-xl origin-top transition-all duration-300 ease-out ${
          mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
      >
        <nav aria-label="Mobile" className="mx-auto max-w-7xl px-6 py-6 flex flex-col gap-1">
          {navLinks.map((item, i) => (
            <Link
              key={item.to}
              ref={i === 0 ? firstLinkRef : undefined}
              to={item.to}
              activeProps={{ className: "text-ember bg-sand" }}
              activeOptions={{ exact: item.to === "/" }}
              className="px-4 py-3 rounded-lg text-base font-medium hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <Link
              to="/dashboard"
              className="mt-4 inline-flex items-center justify-center min-h-11 text-sm font-medium px-4 py-3 rounded-full bg-ink text-cream hover:bg-pitch focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            >
              Dashboard →
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="mt-4 px-4 py-3 rounded-lg text-base font-medium hover:bg-sand transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register/athlete"
                className="inline-flex items-center justify-center min-h-11 text-sm font-medium px-4 py-3 rounded-full bg-ink text-cream hover:bg-pitch focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
              >
                Join the trial →
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}