import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPlayerBySlug, getPlayers } from "@/lib/api/players.functions";

export const Route = createFileRoute("/players/$playerId")({
  loader: async ({ params }) => {
    const [player, allPlayers] = await Promise.all([
      getPlayerBySlug({ data: { slug: params.playerId } }),
      getPlayers(),
    ]);
    if (!player) throw notFound();
    return { player, allPlayers };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.player.name} — NinetyMinds` },
          { name: "description", content: `${loaderData.player.name}, ${loaderData.player.pos} from ${loaderData.player.city}. ${loaderData.player.bio.slice(0, 120)}` },
          { property: "og:title", content: `${loaderData.player.name} — NinetyMinds` },
          { property: "og:image", content: loaderData.player.img_url ?? "" },
        ]
      : [{ title: "Player — NinetyMinds" }],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-32 text-center">
      <h1 className="font-display text-5xl mb-4">Player not found</h1>
      <Link to="/featured-players" className="text-ember hover:underline">← Back to all players</Link>
    </div>
  ),
  component: PlayerProfile,
});

const wellnessResources = [
  { t: "Mood pulse", d: "Two-tap daily check-in. Track how the season feels, not just how it scores." },
  { t: "1-to-1 session", d: "Book a confidential session with a Nigerian sports psychologist this week." },
  { t: "Team circle", d: "Closed peer space with your club — anonymous, moderated, in your language." },
  { t: "Resource library", d: "Short reads on pre-match nerves, injury recovery, and life after a missed trial." },
];

function PlayerProfile() {
  const { player, allPlayers } = Route.useLoaderData();
  const stats = player.stats as { label: string; value: string }[];
  const related = allPlayers.filter((p) => p.slug !== player.slug).slice(0, 3);

  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="bg-ink text-cream">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 lg:py-24 grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-5">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden">
              <img
                src={player.img_url ?? "/assets/player-1.jpg"}
                alt={`Portrait of ${player.name}`}
                className="h-full w-full object-cover"
                width={896}
                height={1152}
              />
            </div>
          </div>
          <div className="lg:col-span-7">
            <Link to="/featured-players" className="text-xs uppercase tracking-[0.2em] text-ember hover:underline">
              ← All players
            </Link>
            <div className="mt-4 flex items-center gap-3 text-sm text-cream/70">
              <span className="px-3 py-1 rounded-full bg-cream/10">{player.pos}</span>
              <span>No. {player.number}</span>
              <span>·</span>
              <span>{player.age} years</span>
            </div>
            <h1 className="font-display text-6xl lg:text-8xl leading-[0.9] mt-4">{player.name}</h1>
            <div className="mt-4 text-lg text-cream/80">
              {player.city} · <span className="text-ember">{player.club}</span>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
              {stats.map((s) => (
                <div key={s.label} className="bg-cream/5 rounded-xl p-4 border border-cream/10">
                  <div className="font-display text-3xl">{s.value}</div>
                  <div className="text-[10px] uppercase tracking-widest text-cream/60 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 inline-flex items-center gap-2 bg-ember text-cream rounded-full px-4 py-2 text-sm font-medium">
              Scout rating <span className="font-display text-xl leading-none">{player.rating}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bio + Highlights */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-20 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <div className="text-xs uppercase tracking-[0.2em] text-ember mb-3">Bio</div>
          <h2 className="font-display text-4xl lg:text-5xl leading-tight mb-6">The story so far.</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">{player.bio}</p>
          <div className="mt-12 text-xs uppercase tracking-[0.2em] text-ember mb-3">Highlights</div>
          <h3 className="font-display text-3xl mb-6">Moments that matter.</h3>
          <ul className="space-y-4">
            {player.highlights.map((h, i) => (
              <li key={h} className="flex gap-5 border-b border-border pb-4">
                <span className="font-display text-pitch text-2xl leading-none w-10">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-base">{h}</span>
              </li>
            ))}
          </ul>
        </div>
        <aside className="lg:col-span-5">
          <div className="bg-sand rounded-2xl p-8 sticky top-24">
            <div className="text-xs uppercase tracking-[0.2em] text-pitch mb-2">Current Club</div>
            <div className="font-display text-3xl mb-4">{player.club}</div>
            <p className="text-sm text-muted-foreground mb-6">
              Coached, mentored, and game-tested. Scouts can request footage, training data, and a verified meeting through NinetyMinds.
            </p>
            <Link
              to="/clubs"
              className="inline-flex items-center gap-2 text-sm font-medium px-5 py-3 rounded-full bg-ink text-cream hover:bg-pitch transition-colors"
            >
              Browse partner clubs →
            </Link>
          </div>
        </aside>
      </section>

      {/* Wellness Resources */}
      <section className="bg-ink text-cream">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <div className="text-xs uppercase tracking-[0.2em] text-ember mb-4">Wellness Resources</div>
              <h2 className="font-display text-4xl lg:text-5xl leading-[0.95]">
                Mind first. <em className="text-ember">Always.</em>
              </h2>
              <p className="mt-4 text-cream/70 max-w-sm">
                Every player on NinetyMinds gets access to confidential mental wellness support — built with Nigerian clinicians.
              </p>
              <Link
                to="/wellness-hub"
                className="mt-6 inline-flex text-sm font-medium px-5 py-3 rounded-full bg-ember text-cream hover:opacity-90 transition"
              >
                Explore the Wellness Hub →
              </Link>
            </div>
            <div className="lg:col-span-8 grid sm:grid-cols-2 gap-4">
              {wellnessResources.map((r) => (
                <div key={r.t} className="bg-cream/5 border border-cream/10 rounded-xl p-6 hover:bg-cream/10 transition-colors">
                  <div className="font-display text-2xl mb-2">{r.t}</div>
                  <div className="text-sm text-cream/70">{r.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-20">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-3xl lg:text-4xl">More players</h2>
          <Link to="/featured-players" className="text-sm hover:text-ember">View all →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {related.map((p) => (
            <Link
              key={p.slug}
              to="/players/$playerId"
              params={{ playerId: p.slug }}
              className="group block bg-card rounded-2xl overflow-hidden border border-border"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={p.img_url ?? "/assets/player-1.jpg"}
                  alt={`Portrait of ${p.name}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="font-display text-2xl">{p.name}</div>
                <div className="text-sm text-muted-foreground">{p.pos} · {p.city}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}