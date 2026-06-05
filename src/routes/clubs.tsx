import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/clubs")({
  head: () => ({
    meta: [
      { title: "Clubs — NinetyMinds" },
      { name: "description", content: "Discover football clubs and academies across Nigeria. Connect with verified grassroots talent." },
      { property: "og:title", content: "Clubs — NinetyMinds" },
      { property: "og:description", content: "Discover football clubs and academies across Nigeria. Connect with verified grassroots talent." },
    ],
  }),
  component: ClubsPage,
});

const clubs = [
  { name: "Lagos Island FC Academy", city: "Lagos", tier: "Tier 1 Academy", scouted: 14, openSpots: 3 },
  { name: "Abuja Queens FC", city: "Abuja", tier: "Premier Women", scouted: 9, openSpots: 2 },
  { name: "Shooting Stars Youth", city: "Ibadan", tier: "Youth Development", scouted: 21, openSpots: 5 },
  { name: "Rangers Int'l Feeder", city: "Enugu", tier: "Feeder Club", scouted: 7, openSpots: 1 },
  { name: "Abia Warriors Academy", city: "Aba", tier: "Tier 2 Academy", scouted: 12, openSpots: 4 },
  { name: "Kano Pillarettes", city: "Kano", tier: "Premier Women", scouted: 6, openSpots: 2 },
  { name: "Rivers Angels U-17", city: "Port Harcourt", tier: "Youth Development", scouted: 18, openSpots: 6 },
  { name: "Plateau United Reserves", city: "Jos", tier: "Reserve Squad", scouted: 11, openSpots: 3 },
];

function ClubsPage() {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 lg:py-24">
        <div className="text-xs uppercase tracking-[0.2em] text-ember mb-4">Partner Clubs</div>
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.95] max-w-3xl">
          Clubs scouting on <span className="text-pitch">NinetyMinds.</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl">
          Academies, feeder clubs and senior sides across Nigeria use NinetyMinds to find verified talent — and to give that talent real mental wellness support.
        </p>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[["86","Partner clubs"],["1,284","Players scouted"],["36","States covered"],["94%","Profiles verified"]].map(([v, l]) => (
            <div key={l} className="bg-card border border-border rounded-2xl p-5">
              <div className="font-display text-4xl text-pitch">{v}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{l}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {clubs.map((c) => (
            <article key={c.name} className="group bg-card border border-border rounded-2xl p-6 hover:bg-sand transition-colors">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-ember mb-1">{c.tier}</div>
                  <h2 className="font-display text-2xl leading-tight">{c.name}</h2>
                  <div className="text-sm text-muted-foreground mt-1">{c.city}, Nigeria</div>
                </div>
                <div className="shrink-0 h-12 w-12 rounded-full bg-pitch text-cream grid place-items-center font-display text-xl">
                  {c.name.charAt(0)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border text-sm">
                <div>
                  <div className="font-display text-2xl">{c.scouted}</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Players signed</div>
                </div>
                <div>
                  <div className="font-display text-2xl text-ember">{c.openSpots}</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Open trials</div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 bg-ink text-cream rounded-3xl p-10 lg:p-14 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-display text-3xl lg:text-4xl leading-tight">
              Are you a club? <em className="text-ember">Scout with us.</em>
            </h2>
            <p className="mt-3 text-cream/70 max-w-md">
              Get verified profiles, video, and stats from grassroots talent across all 36 states. Free for accredited Nigerian clubs in 2026.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link to="/how-it-works" className="px-6 py-3 rounded-full bg-ember text-cream font-medium hover:opacity-90 transition">How it works</Link>
            <Link to="/featured-players" className="px-6 py-3 rounded-full border border-cream/30 text-cream hover:bg-cream/10 transition">Browse players</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
