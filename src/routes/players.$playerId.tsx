import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPlayerBySlug, getPlayers } from "@/lib/api/players.functions";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-browser";

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
    meta: loaderData ? [
      { title: `${loaderData.player.name} — NinetyMinds` },
      { name: "description", content: `${loaderData.player.name}, ${loaderData.player.pos} from ${loaderData.player.city}.` },
      { property: "og:title", content: `${loaderData.player.name} — NinetyMinds` },
      { property: "og:image", content: loaderData.player.img_url ?? "" },
    ] : [{ title: "Player — NinetyMinds" }],
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

function ShareButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(`${window.location.origin}/players/${slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={copy} className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border border-cream/20 text-cream/70 hover:bg-cream/10 transition-colors">
      {copied ? "✓ Copied!" : "Share profile"}
    </button>
  );
}

function SaveButton({ slug }: { slug: string }) {
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      const { data } = await (supabase as any).from("saved_players")
        .select("id").eq("scout_user_id", user.id).eq("player_slug", slug).single();
      setSaved(!!data);
    }
    check();
  }, [slug]);

  async function toggle() {
    if (!userId) return;
    setLoading(true);
    if (saved) {
      await (supabase as any).from("saved_players").delete().eq("scout_user_id", userId).eq("player_slug", slug);
      setSaved(false);
    } else {
      await (supabase as any).from("saved_players").insert({ scout_user_id: userId, player_slug: slug });
      setSaved(true);
    }
    setLoading(false);
  }

  if (!userId) return null;

  return (
    <button onClick={toggle} disabled={loading} className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${saved ? "bg-ember text-cream border-ember" : "border-cream/20 text-cream/70 hover:bg-cream/10"}`}>
      {loading ? "..." : saved ? "★ Saved" : "☆ Save player"}
    </button>
  );
}

function ScoutContactForm({ playerSlug, playerName }: { playerSlug: string; playerName: string }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ from_name: "", from_org: "", subject: "", body: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(field: string, value: string) { setForm((f) => ({ ...f, [field]: value })); setError(null); }

  async function send() {
    if (!form.from_name || !form.from_org || !form.subject || !form.body) return setError("Please fill in all fields.");
    setSending(true);
    const { error: insertError } = await (supabase as any).from("messages").insert({
      from_name: form.from_name, from_org: form.from_org,
      subject: form.subject, body: form.body, to_player_slug: playerSlug,
    });
    if (insertError) setError("Failed to send. Please try again.");
    else { setSent(true); setOpen(false); }
    setSending(false);
  }

  if (sent) return <div className="bg-pitch/20 text-cream rounded-xl px-4 py-3 text-sm">✓ Message sent to {playerName}'s profile.</div>;

  return (
    <div>
      {!open ? (
        <button onClick={() => setOpen(true)} className="w-full py-3 rounded-xl bg-ember text-cream text-sm font-medium hover:opacity-90 transition">Contact this player →</button>
      ) : (
        <div className="space-y-3">
          <input value={form.from_name} onChange={(e) => set("from_name", e.target.value)} placeholder="Your name" className="w-full px-3 py-2.5 rounded-xl border border-cream/20 bg-cream/5 text-cream text-sm placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-ember" />
          <input value={form.from_org} onChange={(e) => set("from_org", e.target.value)} placeholder="Your club / organisation" className="w-full px-3 py-2.5 rounded-xl border border-cream/20 bg-cream/5 text-cream text-sm placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-ember" />
          <input value={form.subject} onChange={(e) => set("subject", e.target.value)} placeholder="Subject" className="w-full px-3 py-2.5 rounded-xl border border-cream/20 bg-cream/5 text-cream text-sm placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-ember" />
          <textarea value={form.body} onChange={(e) => set("body", e.target.value)} rows={3} placeholder="Your message..." className="w-full px-3 py-2.5 rounded-xl border border-cream/20 bg-cream/5 text-cream text-sm placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-ember resize-none" />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <div className="flex gap-2">
            <button onClick={() => setOpen(false)} className="px-4 py-2 rounded-xl border border-cream/20 text-cream/70 text-sm hover:bg-cream/10 transition">Cancel</button>
            <button onClick={send} disabled={sending} className="flex-1 py-2 rounded-xl bg-ember text-cream text-sm font-medium hover:opacity-90 transition disabled:opacity-60">{sending ? "Sending..." : "Send message"}</button>
          </div>
        </div>
      )}
    </div>
  );
}

function PlayerProfile() {
  const { player, allPlayers } = Route.useLoaderData();
  const stats = player.stats as { label: string; value: string }[];
  const related = allPlayers.filter((p) => p.slug !== player.slug).slice(0, 3);
  const videoUrls = (player as any).video_urls as string[] ?? [];

  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="bg-ink text-cream">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 lg:py-24 grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-5">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden">
              <img src={player.img_url ?? "/assets/player-1.jpg"} alt={`Portrait of ${player.name}`} className="h-full w-full object-cover" width={896} height={1152} />
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-4">
              <Link to="/featured-players" className="text-xs uppercase tracking-[0.2em] text-ember hover:underline">← All players</Link>
              <div className="flex items-center gap-2">
                <SaveButton slug={player.slug} />
                <ShareButton slug={player.slug} />
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-cream/70">
              <span className="px-3 py-1 rounded-full bg-cream/10">{player.pos}</span>
              <span>No. {player.number}</span>
              <span>·</span>
              <span>{player.age} years</span>
            </div>
            <h1 className="font-display text-6xl lg:text-8xl leading-[0.9] mt-4">{player.name}</h1>
            <div className="mt-4 text-lg text-cream/80">{player.city} · <span className="text-ember">{player.club}</span></div>
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
                <span className="font-display text-pitch text-2xl leading-none w-10">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-base">{h}</span>
              </li>
            ))}
          </ul>
          {videoUrls.length > 0 && (
            <div className="mt-12">
              <div className="text-xs uppercase tracking-[0.2em] text-ember mb-3">Video Highlights</div>
              <div className="space-y-3">
                {videoUrls.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-sand transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-pitch/10 text-pitch flex items-center justify-center shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </div>
                    <span className="text-sm font-medium group-hover:text-pitch transition-colors truncate">{url}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        <aside className="lg:col-span-5">
          <div className="bg-ink text-cream rounded-2xl p-8 sticky top-24 space-y-6">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-ember mb-2">Current Club</div>
              <div className="font-display text-3xl mb-3">{player.club}</div>
              <p className="text-sm text-cream/70">Scouts can request footage, training data, and a verified meeting through NinetyMinds.</p>
            </div>
            <ScoutContactForm playerSlug={player.slug} playerName={player.name} />
            <Link to="/clubs" className="inline-flex items-center gap-2 text-sm font-medium text-cream/60 hover:text-cream transition-colors">Browse partner clubs →</Link>
          </div>
        </aside>
      </section>

      {/* Wellness */}
      <section className="bg-ink text-cream">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <div className="text-xs uppercase tracking-[0.2em] text-ember mb-4">Wellness Resources</div>
              <h2 className="font-display text-4xl lg:text-5xl leading-[0.95]">Mind first. <em className="text-ember">Always.</em></h2>
              <p className="mt-4 text-cream/70 max-w-sm">Every player on NinetyMinds gets access to confidential mental wellness support.</p>
              <Link to="/wellness-hub" className="mt-6 inline-flex text-sm font-medium px-5 py-3 rounded-full bg-ember text-cream hover:opacity-90 transition">Explore the Wellness Hub →</Link>
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
            <Link key={p.slug} to="/players/$playerId" params={{ playerId: p.slug }} className="group block bg-card rounded-2xl overflow-hidden border border-border">
              <div className="aspect-[4/5] overflow-hidden">
                <img src={p.img_url ?? "/assets/player-1.jpg"} alt={`Portrait of ${p.name}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
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