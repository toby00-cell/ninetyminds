import { createFileRoute, Link } from "@tanstack/react-router";
import { getPlayers } from "@/lib/api/players.functions";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/featured-players")({
  loader: () => getPlayers(),
  head: () => ({
    meta: [
      { title: "Featured Players — NinetyMinds" },
      { name: "description", content: "Discover Nigeria's next generation of football talent. Verified stats, real stories, genuine opportunity." },
    ],
  }),
  component: FeaturedPlayers,
});

const POSITIONS = ["All", "Goalkeeper", "Defender", "Right Back", "Left Back", "Centre Back", "Defensive Mid", "Midfielder", "Attacking Mid", "Winger", "Forward", "Striker"];
const CITIES = ["All", "Lagos", "Abuja", "Ibadan", "Enugu", "Ogun", "Aba", "Kano", "Onitsha", "Port Harcourt", "Jos"];

function FeaturedPlayers() {
  const players = Route.useLoaderData();
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState("All");
  const [city, setCity] = useState("All");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");

  const filtered = useMemo(() => {
    return players.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.club.toLowerCase().includes(search.toLowerCase())) return false;
      if (position !== "All" && p.pos !== position) return false;
      if (city !== "All" && p.city !== city) return false;
      if (minAge && p.age < parseInt(minAge)) return false;
      if (maxAge && p.age > parseInt(maxAge)) return false;
      return true;
    });
  }, [players, search, position, city, minAge, maxAge]);

  const hasFilters = search || position !== "All" || city !== "All" || minAge || maxAge;

  return (
    <div className="bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20">
        <div className="text-xs uppercase tracking-[0.2em] text-ember mb-4">Scouting</div>
        <h1 className="font-display text-5xl lg:text-7xl leading-[0.95] max-w-2xl mb-6">
          The next eleven, <em className="text-ember">already playing.</em>
        </h1>
        <p className="text-lg text-cream/70 max-w-xl mb-10">
          We scout the boys and girls the academies miss. Every profile is verified, every stat is real, every story matters.
        </p>

        {/* Filters */}
        <div className="bg-cream/5 border border-cream/10 rounded-2xl p-5 mb-10 space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or club..."
              className="px-4 py-2.5 rounded-xl bg-cream/10 border border-cream/10 text-sm text-cream placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-ember"
            />
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-cream/10 border border-cream/10 text-sm text-cream focus:outline-none focus:ring-2 focus:ring-ember"
            >
              {POSITIONS.map((p) => <option key={p} value={p} className="text-ink">{p === "All" ? "All positions" : p}</option>)}
            </select>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-cream/10 border border-cream/10 text-sm text-cream focus:outline-none focus:ring-2 focus:ring-ember"
            >
              {CITIES.map((c) => <option key={c} value={c} className="text-ink">{c === "All" ? "All cities" : c}</option>)}
            </select>
            <div className="flex gap-2">
              <input type="number" value={minAge} onChange={(e) => setMinAge(e.target.value)} placeholder="Min age" min="14" max="40" className="w-1/2 px-3 py-2.5 rounded-xl bg-cream/10 border border-cream/10 text-sm text-cream placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-ember" />
              <input type="number" value={maxAge} onChange={(e) => setMaxAge(e.target.value)} placeholder="Max age" min="14" max="40" className="w-1/2 px-3 py-2.5 rounded-xl bg-cream/10 border border-cream/10 text-sm text-cream placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-ember" />
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-cream/50">
            <span>{filtered.length} player{filtered.length !== 1 ? "s" : ""} found</span>
            {hasFilters && (
              <button onClick={() => { setSearch(""); setPosition("All"); setCity("All"); setMinAge(""); setMaxAge(""); }} className="text-ember hover:underline text-xs">
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-cream/50">No players match your filters.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <article key={p.slug} className="group bg-cream text-ink rounded-2xl overflow-hidden flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={p.img_url ?? "/assets/player-1.jpg"} alt={`Portrait of ${p.name}`} loading="lazy" width={896} height={1152} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-4 left-4 bg-cream/90 backdrop-blur px-3 py-1 rounded-full text-xs uppercase tracking-widest">{p.pos}</div>
                  <div className="absolute top-4 right-4 bg-ember text-cream rounded-full h-12 w-12 grid place-items-center font-display text-xl">{p.rating}</div>
                  <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-cream via-cream/85 to-transparent">
                    <h3 className="font-display text-3xl leading-tight">{p.name}</h3>
                    <div className="text-sm text-muted-foreground">{p.age} · {p.city} · No. {p.number}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
                  {(p.stats as { label: string; value: string }[]).map((s) => (
                    <div key={s.label} className="p-4 text-center">
                      <div className="font-display text-2xl">{s.value}</div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
                <Link to="/players/$playerId" params={{ playerId: p.slug }} className="border-t border-border px-5 py-4 flex items-center justify-between text-sm font-medium hover:bg-sand transition-colors focus-visible:outline-none focus-visible:bg-sand">
                  View profile
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}