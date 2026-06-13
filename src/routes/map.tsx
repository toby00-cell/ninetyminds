import { createFileRoute } from "@tanstack/react-router";
import { getPlayers } from "@/lib/api/players.functions";
import { useMemo } from "react";

export const Route = createFileRoute("/map")({
  loader: () => getPlayers(),
  head: () => ({
    meta: [
      { title: "Player Map — NinetyMinds" },
      { name: "description", content: "See where Nigeria's grassroots football talent is concentrated." },
    ],
  }),
  component: PlayerMap,
});

// Nigerian state coordinates (approximate centres)
const STATE_COORDS: Record<string, { x: number; y: number; label: string }> = {
  "Lagos":         { x: 18, y: 82, label: "Lagos" },
  "Abuja":         { x: 50, y: 52, label: "FCT" },
  "Ibadan":        { x: 25, y: 72, label: "Oyo" },
  "Enugu":         { x: 62, y: 65, label: "Enugu" },
  "Ogun":          { x: 22, y: 78, label: "Ogun" },
  "Aba":           { x: 65, y: 72, label: "Abia" },
  "Kano":          { x: 52, y: 22, label: "Kano" },
  "Onitsha":       { x: 58, y: 68, label: "Anambra" },
  "Port Harcourt": { x: 62, y: 78, label: "Rivers" },
  "Jos":           { x: 55, y: 40, label: "Plateau" },
  "Kaduna":        { x: 48, y: 32, label: "Kaduna" },
  "Benin City":    { x: 45, y: 72, label: "Edo" },
  "Warri":         { x: 40, y: 76, label: "Delta" },
  "Ilorin":        { x: 35, y: 58, label: "Kwara" },
  "Maiduguri":     { x: 75, y: 15, label: "Borno" },
};

function PlayerMap() {
  const players = Route.useLoaderData();

  const cityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    players.forEach((p) => {
      counts[p.city] = (counts[p.city] || 0) + 1;
    });
    return counts;
  }, [players]);

  const maxCount = Math.max(...Object.values(cityCounts), 1);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16 lg:py-24">
        <div className="text-xs uppercase tracking-[0.2em] text-ember mb-4">Player Map</div>
        <h1 className="font-display text-4xl lg:text-6xl leading-[1.0] mb-4">
          Where talent <em className="text-pitch">lives.</em>
        </h1>
        <p className="text-muted-foreground mb-12 max-w-xl">
          Every dot is a verified NinetyMinds player. The bigger the dot, the more players from that region.
        </p>

        <div className="grid lg:grid-cols-3 gap-10 items-start">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="relative bg-sand/40 border border-border rounded-3xl overflow-hidden" style={{ paddingBottom: "120%" }}>
              <svg viewBox="0 0 100 120" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Simple Nigeria outline */}
                <path d="M15,25 L20,15 L35,12 L55,10 L75,12 L85,20 L88,35 L85,50 L80,60 L75,75 L70,85 L60,90 L50,92 L40,90 L30,85 L20,80 L15,70 L12,55 L13,40 Z" fill="oklch(0.94 0.008 230)" stroke="oklch(0.88 0.01 230)" strokeWidth="0.5" />

                {/* Player dots */}
                {Object.entries(cityCounts).map(([city, count]) => {
                  const coords = STATE_COORDS[city];
                  if (!coords) return null;
                  const size = 1.5 + (count / maxCount) * 4;
                  return (
                    <g key={city}>
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r={size + 1}
                        fill="oklch(0.52 0.16 215)"
                        opacity="0.15"
                      />
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r={size}
                        fill="oklch(0.52 0.16 215)"
                        opacity="0.9"
                      />
                      <text
                        x={coords.x}
                        y={coords.y + size + 3}
                        textAnchor="middle"
                        fontSize="3"
                        fill="oklch(0.42 0.02 60)"
                        fontFamily="Inter, sans-serif"
                      >
                        {coords.label}
                      </text>
                    </g>
                  );
                })}

                {/* Empty state dots for states without players */}
                {Object.entries(STATE_COORDS).filter(([city]) => !cityCounts[city]).map(([city, coords]) => (
                  <circle key={city} cx={coords.x} cy={coords.y} r={0.8} fill="oklch(0.88 0.01 230)" />
                ))}
              </svg>
            </div>
          </div>

          {/* City breakdown */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-[0.2em] text-ember mb-4">Players by city</div>
            {Object.entries(cityCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([city, count]) => (
                <div key={city} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{city}</span>
                      <span className="text-sm text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-1.5 bg-sand rounded-full overflow-hidden">
                      <div
                        className="h-full bg-pitch rounded-full transition-all"
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            {Object.keys(cityCounts).length === 0 && (
              <p className="text-sm text-muted-foreground">No player data yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}