import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-browser";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [{ title: "Search — NinetyMinds" }],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [query, setQuery] = useState("");
  const [players, setPlayers] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const CLUBS = [
    "Lagos Island FC Academy", "Abuja Queens FC", "Shooting Stars Youth",
    "Rangers Int'l Feeder", "Abia Warriors Academy", "Kano Pillarettes",
    "Rivers Angels U-17", "Plateau United Reserves",
  ];

  async function search() {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);

    const q = query.toLowerCase();

    const [{ data: playerData }, { data: storyData }] = await Promise.all([
      (supabase as any).from("players").select("slug,name,pos,city,club,rating,img_url")
        .or(`name.ilike.%${q}%,pos.ilike.%${q}%,city.ilike.%${q}%,club.ilike.%${q}%`),
      (supabase as any).from("stories").select("slug,title,excerpt,tag,read_time,author_name")
        .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%,tag.ilike.%${q}%`),
    ]);

    setPlayers(playerData ?? []);
    setStories(storyData ?? []);
    setClubs(CLUBS.filter((c) => c.toLowerCase().includes(q)));
    setLoading(false);
  }

  const total = players.length + stories.length + clubs.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-10 py-16 lg:py-24">
        <div className="text-xs uppercase tracking-[0.2em] text-ember mb-4">Search</div>
        <h1 className="font-display text-4xl lg:text-5xl mb-8">Find anything.</h1>

        {/* Search input */}
        <div className="flex gap-3 mb-10">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="Search players, stories, clubs..."
            className="flex-1 px-5 py-4 rounded-2xl border border-border bg-card text-base focus:outline-none focus:ring-2 focus:ring-pitch"
            autoFocus
          />
          <button
            onClick={search}
            disabled={loading}
            className="px-6 py-4 rounded-2xl bg-ink text-cream font-medium hover:bg-pitch transition-colors disabled:opacity-60"
          >
            {loading ? "..." : "Search"}
          </button>
        </div>

        {searched && !loading && (
          <div className="text-sm text-muted-foreground mb-8">
            {total} result{total !== 1 ? "s" : ""} for <span className="font-medium text-foreground">"{query}"</span>
          </div>
        )}

        {/* Players */}
        {players.length > 0 && (
          <section className="mb-10">
            <div className="text-xs uppercase tracking-[0.2em] text-ember mb-4">Players ({players.length})</div>
            <div className="space-y-3">
              {players.map((p) => (
                <Link key={p.slug} to="/players/$playerId" params={{ playerId: p.slug }}
                  className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-shadow group">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-sand">
                    <img src={p.img_url ?? "/assets/player-1.jpg"} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-lg group-hover:text-pitch transition-colors">{p.name}</div>
                    <div className="text-sm text-muted-foreground">{p.pos} · {p.city} · {p.club}</div>
                  </div>
                  <div className="shrink-0 font-display text-2xl text-pitch">{p.rating}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Stories */}
        {stories.length > 0 && (
          <section className="mb-10">
            <div className="text-xs uppercase tracking-[0.2em] text-ember mb-4">Stories ({stories.length})</div>
            <div className="space-y-3">
              {stories.map((s) => (
                <Link key={s.slug} to="/stories/$storyId" params={{ storyId: s.slug }}
                  className="block bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow group">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-sand">{s.tag}</span>
                    <span className="text-xs text-muted-foreground">{s.read_time}</span>
                  </div>
                  <div className="font-display text-lg group-hover:text-pitch transition-colors">{s.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{s.excerpt}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Clubs */}
        {clubs.length > 0 && (
          <section className="mb-10">
            <div className="text-xs uppercase tracking-[0.2em] text-ember mb-4">Clubs ({clubs.length})</div>
            <div className="space-y-3">
              {clubs.map((c) => (
                <Link key={c} to="/clubs"
                  className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-shadow group">
                  <div className="w-10 h-10 rounded-xl bg-pitch text-cream grid place-items-center font-display text-lg shrink-0">{c.charAt(0)}</div>
                  <div className="font-display text-lg group-hover:text-pitch transition-colors">{c}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {searched && !loading && total === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-2">No results for "{query}".</p>
            <p className="text-sm text-muted-foreground">Try a player name, position, city, or club.</p>
          </div>
        )}

        {!searched && (
          <div className="grid sm:grid-cols-3 gap-4 mt-4">
            {[["Players", "Search by name, position, or city", "/featured-players"],
              ["Stories", "Find articles on wellness and scouting", "/stories"],
              ["Clubs", "Discover partner academies and clubs", "/clubs"]].map(([t, d, href]) => (
              <Link key={t} to={href as any} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow">
                <div className="font-display text-lg mb-1">{t}</div>
                <div className="text-sm text-muted-foreground">{d}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}