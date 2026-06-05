import { createFileRoute, Link } from "@tanstack/react-router";
import { getPlayers } from "@/lib/api/players.functions";

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

function FeaturedPlayers() {
  const players = Route.useLoaderData();

  return (
    <div className="bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20">
        <div className="text-xs uppercase tracking-[0.2em] text-ember mb-4">Scouting</div>
        <h1 className="font-display text-5xl lg:text-7xl leading-[0.95] max-w-2xl mb-6">
          The next eleven, <em className="text-ember">already playing.</em>
        </h1>
        <p className="text-lg text-cream/70 max-w-xl mb-14">
          We scout the boys and girls the academies miss. Every profile is verified, every stat is real, every story matters.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((p) => (
            <article key={p.slug} className="group bg-cream text-ink rounded-2xl overflow-hidden flex flex-col">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={p.img_url ?? "/assets/player-1.jpg"}
                  alt={`Portrait of ${p.name}`}
                  loading="lazy"
                  width={896}
                  height={1152}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-cream/90 backdrop-blur px-3 py-1 rounded-full text-xs uppercase tracking-widest">
                  {p.pos}
                </div>
                <div className="absolute top-4 right-4 bg-ember text-cream rounded-full h-12 w-12 grid place-items-center font-display text-xl">
                  {p.rating}
                </div>
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
              <Link
                to="/players/$playerId"
                params={{ playerId: p.slug }}
                className="border-t border-border px-5 py-4 flex items-center justify-between text-sm font-medium hover:bg-sand transition-colors focus-visible:outline-none focus-visible:bg-sand"
              >
                View profile
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}