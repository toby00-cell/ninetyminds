import { createFileRoute, Link } from "@tanstack/react-router";
import { getPlayers } from "@/lib/api/players.functions";
import { useState } from "react";

export const Route = createFileRoute("/leaderboard")({
  loader: () => getPlayers(),
  head: () => ({
    meta: [
      { title: "Leaderboard — NinetyMinds" },
      { name: "description", content: "Top-rated grassroots footballers in Nigeria by position." },
    ],
  }),
  component: Leaderboard,
});

const POSITIONS = ["All", "Goalkeeper", "Defender", "Right Back", "Left Back", "Centre Back", "Defensive Mid", "Midfielder", "Attacking Mid", "Winger", "Forward", "Striker"];

function Leaderboard() {
  const players = Route.useLoaderData();
  const [position, setPosition] = useState("All");

  const filtered = position === "All"
    ? [...players].sort((a, b) => b.rating - a.rating)
    : [...players].filter((p) => p.pos === position).sort((a, b) => b.rating - a.rating);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-10 py-16 lg:py-24">
        <div className="text-xs uppercase tracking-[0.2em] text-ember mb-4">Leaderboard</div>
        <h1 className="font-display text-4xl lg:text-6xl leading-[1.0] mb-4">
          Top rated <em className="text-pitch">players.</em>
        </h1>
        <p className="text-muted-foreground mb-10">Ranked by scout rating across all positions.</p>

        {/* Position filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {POSITIONS.map((p) => (
            <button
              key={p}
              onClick={() => setPosition(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                position === p ? "bg-ink text-cream" : "bg-sand text-muted-foreground hover:bg-border"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Rankings */}
        <div className="space-y-3">
          {filtered.map((p, i) => (
            <Link
              key={p.slug}
              to="/players/$playerId"
              params={{ playerId: p.slug }}
              className="group flex items-center gap-5 bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display text-lg shrink-0 ${
                i === 0 ? "bg-yellow-400 text-yellow-900" :
                i === 1 ? "bg-gray-300 text-gray-700" :
                i === 2 ? "bg-amber-600 text-amber-100" :
                "bg-sand text-muted-foreground"
              }`}>
                {i + 1}
              </div>
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                <img src={p.img_url ?? "/assets/player-1.jpg"} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-xl group-hover:text-pitch transition-colors">{p.name}</div>
                <div className="text-sm text-muted-foreground">{p.pos} · {p.city} · {p.club}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="font-display text-3xl text-pitch">{p.rating}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest">Rating</div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">No players found for this position.</div>
        )}
      </div>
    </div>
  );
}