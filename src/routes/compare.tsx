import { createFileRoute, Link } from "@tanstack/react-router";
import { getPlayers } from "@/lib/api/players.functions";
import { useState } from "react";

export const Route = createFileRoute("/compare")({
  loader: () => getPlayers(),
  head: () => ({
    meta: [{ title: "Compare Players — NinetyMinds" }],
  }),
  component: ComparePage,
});

function ComparePage() {
  const players = Route.useLoaderData();
  const [leftSlug, setLeftSlug] = useState("");
  const [rightSlug, setRightSlug] = useState("");

  const left = players.find((p) => p.slug === leftSlug);
  const right = players.find((p) => p.slug === rightSlug);

  function StatRow({ label, leftVal, rightVal }: { label: string; leftVal: number; rightVal: number }) {
    const max = Math.max(leftVal, rightVal, 1);
    const leftWins = leftVal > rightVal;
    const rightWins = rightVal > leftVal;
    return (
      <div className="py-4 border-b border-border last:border-0">
        <div className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-3">{label}</div>
        <div className="flex items-center gap-4">
          <div className={`text-right font-display text-2xl w-16 ${leftWins ? "text-pitch" : ""}`}>{leftVal}</div>
          <div className="flex-1 flex gap-1 h-2">
            <div className="flex-1 flex justify-end">
              <div className={`h-2 rounded-full transition-all ${leftWins ? "bg-pitch" : "bg-border"}`} style={{ width: `${(leftVal / max) * 100}%` }} />
            </div>
            <div className="flex-1">
              <div className={`h-2 rounded-full transition-all ${rightWins ? "bg-ember" : "bg-border"}`} style={{ width: `${(rightVal / max) * 100}%` }} />
            </div>
          </div>
          <div className={`font-display text-2xl w-16 ${rightWins ? "text-ember" : ""}`}>{rightVal}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-10 py-16 lg:py-24">
        <div className="text-xs uppercase tracking-[0.2em] text-ember mb-4">Compare</div>
        <h1 className="font-display text-4xl lg:text-5xl mb-8">Compare players.</h1>

        {/* Player selectors */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div>
            <label className="block text-xs font-medium mb-2 text-muted-foreground">Player 1</label>
            <select value={leftSlug} onChange={(e) => setLeftSlug(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-pitch">
              <option value="">Select player...</option>
              {players.filter((p) => p.slug !== rightSlug).map((p) => (
                <option key={p.slug} value={p.slug}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-2 text-muted-foreground">Player 2</label>
            <select value={rightSlug} onChange={(e) => setRightSlug(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-pitch">
              <option value="">Select player...</option>
              {players.filter((p) => p.slug !== leftSlug).map((p) => (
                <option key={p.slug} value={p.slug}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {left && right ? (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {/* Player headers */}
            <div className="grid grid-cols-2 divide-x divide-border">
              {[left, right].map((p, i) => (
                <div key={p.slug} className={`p-6 text-center ${i === 1 ? "" : ""}`}>
                  <div className="w-20 h-20 rounded-xl overflow-hidden mx-auto mb-3">
                    <img src={p.img_url ?? "/assets/player-1.jpg"} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="font-display text-xl">{p.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">{p.pos} · {p.city}</div>
                  <div className={`mt-2 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${i === 0 ? "bg-pitch/10 text-pitch" : "bg-ember/10 text-ember"}`}>
                    Rating: {p.rating}
                  </div>
                </div>
              ))}
            </div>

            {/* Stats comparison */}
            <div className="p-6 border-t border-border">
              <StatRow label="Scout Rating" leftVal={left.rating} rightVal={right.rating} />
              <StatRow label="Age" leftVal={left.age} rightVal={right.age} />
              {(left.stats as { label: string; value: string }[]).map((s, i) => {
                const rightStat = (right.stats as { label: string; value: string }[])[i];
                return (
                  <StatRow
                    key={s.label}
                    label={s.label}
                    leftVal={parseInt(s.value) || 0}
                    rightVal={parseInt(rightStat?.value) || 0}
                  />
                );
              })}
            </div>

            {/* Bio comparison */}
            <div className="grid grid-cols-2 divide-x divide-border border-t border-border">
              {[left, right].map((p) => (
                <div key={p.slug} className="p-6">
                  <div className="text-xs uppercase tracking-[0.2em] text-ember mb-2">Bio</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.bio}</p>
                  <Link to="/players/$playerId" params={{ playerId: p.slug }}
                    className="mt-4 inline-flex text-xs font-medium text-pitch hover:underline">
                    Full profile →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            Select two players above to compare their stats side by side.
          </div>
        )}
      </div>
    </div>
  );
}