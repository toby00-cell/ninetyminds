import { createFileRoute, Link } from "@tanstack/react-router";
import wellness from "@/assets/wellness.jpg";
import { articles } from "@/routes/wellness-hub.$articleSlug";

export const Route = createFileRoute("/wellness-hub/")({
  head: () => ({
    meta: [
      { title: "Wellness Hub — NinetyMinds" },
      { name: "description", content: "Mental health support for Nigerian athletes. Anonymous check-ins, therapy sessions, and peer circles." },
    ],
  }),
  component: WellnessHub,
});

const services = [
  ["Daily mood pulse", "Two taps. Honest data, only for you."],
  ["1-to-1 sessions", "Vetted therapists who understand the game."],
  ["Team circles", "Closed spaces for clubs and academies."],
];

const tagColors: Record<string, string> = {
  Anxiety: "bg-blue-50 text-blue-700",
  Burnout: "bg-orange-50 text-orange-700",
  Identity: "bg-purple-50 text-purple-700",
  Recovery: "bg-green-50 text-green-700",
  Sleep: "bg-indigo-50 text-indigo-700",
  Pressure: "bg-red-50 text-red-700",
};

function WellnessHub() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Hero */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16 lg:py-24 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 relative">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden grain">
            <img src={wellness} alt="Young athlete in a moment of reflection" loading="lazy" width={1200} height={1400} className="h-full w-full object-cover" />
          </div>
          <div className="absolute -top-4 -right-4 bg-pitch text-cream rounded-xl p-4 w-48 rotate-[3deg] shadow-xl">
            <div className="text-xs uppercase tracking-widest opacity-80">Wellness check-in</div>
            <div className="font-display text-2xl mt-1">3 mins, daily.</div>
          </div>
        </div>
        <div className="lg:col-span-6">
          <div className="text-xs uppercase tracking-[0.2em] text-ember mb-4">The Wellness Hub</div>
          <h1 className="font-display text-4xl lg:text-5xl leading-[1.05] mb-6">
            A career is long.<br /> A mind is <em className="text-pitch">longer</em>.
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mb-8">
            Anonymous check-ins, on-call sports psychologists, peer circles in Pidgin, Yoruba, Igbo and Hausa. Built with Nigerian clinicians, for Nigerian athletes.
          </p>
          <ul className="space-y-4">
            {services.map(([t, d]) => (
              <li key={t} className="flex gap-5 border-b border-border pb-4">
                <span className="font-display text-pitch text-2xl leading-none">→</span>
                <div>
                  <div className="font-medium text-sm">{t}</div>
                  <div className="text-sm text-muted-foreground">{d}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Resource Library */}
      <section className="bg-sand/40 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="mb-12">
            <div className="text-xs uppercase tracking-[0.2em] text-ember mb-3">Resource Library</div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.05] max-w-xl">
                Guides written for <em className="text-pitch">your game.</em>
              </h2>
              <p className="text-sm text-muted-foreground max-w-xs">
                Short reads on the mental side of football — by Nigerian clinicians and sports writers who know the context.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((r) => (
              <Link
                key={r.slug}
                to="/wellness-hub/$articleSlug"
                params={{ articleSlug: r.slug }}
                className="group bg-card border border-border rounded-2xl p-6 flex flex-col hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${tagColors[r.tag] ?? "bg-sand text-ink"}`}>
                    {r.tag}
                  </span>
                  <span className="text-xs text-muted-foreground">{r.read} read</span>
                </div>
                <h3 className="font-display text-xl leading-tight mb-3">{r.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{r.excerpt}</p>
                <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{r.author}</span>
                  <span className="text-xs font-semibold text-pitch group-hover:underline">Read →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-cream py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-ember mb-3">Need to talk?</div>
            <h2 className="font-display text-3xl sm:text-4xl leading-[1.05]">
              You don't have to carry it alone.
            </h2>
            <p className="mt-4 text-cream/70 max-w-md">
              Every athlete on NinetyMinds has access to confidential support. No judgement, no pressure, no records shared with your club.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/register/athlete"
              className="px-6 py-3.5 rounded-full bg-ember text-cream text-sm font-medium hover:opacity-90 transition text-center"
            >
              Create your profile
            </Link>
            <a
              href="https://findahelpline.com/countries/ng"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-full border border-cream/20 text-sm font-medium hover:bg-cream/10 transition text-center"
            >
              Find crisis support →
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}