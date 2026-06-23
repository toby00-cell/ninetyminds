import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

export const Route = createFileRoute("/clubs/$clubId")({
  head: () => ({
    meta: [{ title: "Club — NinetyMinds" }],
  }),
  component: ClubProfile,
});

function ApplyForTrialForm({ clubId, clubName }: { clubId: number; clubName: string }) {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [player, setPlayer] = useState<{ slug: string; name: string } | null>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setCheckingAuth(false); return; }
      const { data } = await (supabase as any).from("players").select("slug,name").eq("user_id", user.id).single();
      if (data) setPlayer(data);
      setCheckingAuth(false);
    }
    load();
  }, []);

  async function apply() {
    if (!player) return;
    setSending(true);
    setError(null);
    const { error: insertError } = await (supabase as any).from("applications").insert({
      player_slug: player.slug,
      player_name: player.name,
      club_name: clubName,
      club_id: clubId,
      status: "pending",
    });
    if (insertError) setError("Failed to submit application. Please try again.");
    else setSent(true);
    setSending(false);
  }

  if (checkingAuth) return null;

  if (sent) return (
    <div className="bg-pitch/20 text-cream rounded-xl px-4 py-3 text-sm">
      ✓ Application sent. Track its status from your dashboard.
    </div>
  );

  if (!player) {
    return (
      <div className="bg-cream/5 border border-cream/10 rounded-xl px-4 py-3 text-sm text-cream/70">
        <Link to="/login" className="text-ember hover:underline">Sign in as an athlete</Link> to apply for a trial here.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-xs text-red-400">{error}</p>}
      <button
        onClick={apply}
        disabled={sending}
        className="w-full py-3 rounded-xl bg-ember text-cream text-sm font-medium hover:opacity-90 transition disabled:opacity-60"
      >
        {sending ? "Submitting..." : `Apply for a trial at ${clubName} →`}
      </button>
    </div>
  );
}

function ClubProfile() {
  const { clubId } = Route.useParams();
  const [club, setClub] = useState<any>(null);
  const [roster, setRoster] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: clubData } = await (supabase as any).from("clubs").select("id,user_id,name,slug,location,description,logo_url,verified,tier,founded_year,coach_name,contact_email,contact_phone,website,positions_needed,age_groups,trial_process,open_trial_spots,created_at").eq("slug", clubId).single();
      if (!clubData) { setNotFoundState(true); setLoading(false); return; }
      setClub(clubData);

      const { data: rosterData } = await (supabase as any)
        .from("players")
        .select("slug,name,pos,city,rating,img_url")
        .eq("club_id", clubData.id);
      setRoster(rosterData ?? []);
      setLoading(false);
    }
    load();
  }, [clubId]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-muted-foreground text-sm">Loading...</div>
    </div>
  );

  if (notFoundState || !club) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-display text-5xl mb-4">Club not found</h1>
        <Link to="/clubs" className="text-ember hover:underline">← Back to all clubs</Link>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="bg-ink text-cream">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 lg:py-24">
          <Link to="/clubs" className="text-xs uppercase tracking-[0.2em] text-ember hover:underline">← All clubs</Link>
          <div className="mt-6 flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-cream/10 overflow-hidden shrink-0 grid place-items-center font-display text-3xl">
              {club.logo_url ? <img src={club.logo_url} alt={club.name} className="w-full h-full object-cover" /> : club.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                {club.tier && <span className="text-xs uppercase tracking-[0.2em] text-ember">{club.tier}</span>}
                {club.verified && <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-pitch text-cream">✓ Verified</span>}
              </div>
              <h1 className="font-display text-5xl lg:text-6xl leading-[0.95]">{club.name}</h1>
              <div className="mt-3 text-cream/70">
                {club.location}{club.founded_year ? ` · Est. ${club.founded_year}` : ""}
              </div>
              <div className="mt-1 text-sm text-cream/50">{roster.length} player{roster.length !== 1 ? "s" : ""} on roster</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-20 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          {club.description && (
            <>
              <div className="text-xs uppercase tracking-[0.2em] text-ember mb-3">About</div>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10">{club.description}</p>
            </>
          )}

          {club.trial_process && (
            <>
              <div className="text-xs uppercase tracking-[0.2em] text-ember mb-3">Trial Process</div>
              <p className="text-base text-muted-foreground leading-relaxed mb-8">{club.trial_process}</p>
            </>
          )}

          {(club.positions_needed?.length > 0 || club.age_groups?.length > 0) && (
            <div className="mb-12 space-y-4">
              {club.positions_needed?.length > 0 && (
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-ember mb-2">Positions Needed</div>
                  <div className="flex flex-wrap gap-1.5">
                    {club.positions_needed.map((p: string) => <span key={p} className="text-xs font-medium px-2.5 py-1 rounded-full bg-pitch/10 text-pitch">{p}</span>)}
                  </div>
                </div>
              )}
              {club.age_groups?.length > 0 && (
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-ember mb-2">Age Groups</div>
                  <div className="flex flex-wrap gap-1.5">
                    {club.age_groups.map((ag: string) => <span key={ag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-sand border border-border">{ag}</span>)}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="text-xs uppercase tracking-[0.2em] text-ember mb-3">Roster</div>
          <h2 className="font-display text-3xl mb-6">Current players.</h2>
          {roster.length === 0 ? (
            <p className="text-muted-foreground">No players on the roster yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {roster.map((p) => (
                <Link key={p.slug} to="/players/$playerId" params={{ playerId: p.slug }}
                  className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-shadow group">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-sand">
                    <img src={p.img_url ?? "/assets/player-1.jpg"} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-lg group-hover:text-pitch transition-colors">{p.name}</div>
                    <div className="text-sm text-muted-foreground">{p.pos} · {p.city}</div>
                  </div>
                  <div className="font-display text-xl text-pitch shrink-0">{p.rating}</div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <aside className="lg:col-span-5">
          <div className="bg-ink text-cream rounded-2xl p-8 sticky top-24 space-y-6">
            {(club.coach_name || club.contact_email || club.contact_phone || club.website) && (
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-ember mb-3">Contact</div>
                <div className="space-y-2 text-sm text-cream/80">
                  {club.coach_name && <div>Coach: {club.coach_name}</div>}
                  {club.contact_email && <a href={`mailto:${club.contact_email}`} className="block hover:underline">{club.contact_email}</a>}
                  {club.contact_phone && <a href={`tel:${club.contact_phone}`} className="block hover:underline">{club.contact_phone}</a>}
                  {club.website && <a href={`https://${club.website.replace(/^https?:\/\//, "")}`} target="_blank" rel="noopener noreferrer" className="block hover:underline">{club.website}</a>}
                </div>
              </div>
            )}
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-ember mb-2">Trials</div>
              <p className="text-sm text-cream/70">
                Submit a trial application directly to {club.name}. They'll review it from their club portal.
                {club.open_trial_spots != null && <span className="block mt-1 text-ember">{club.open_trial_spots} open spot{club.open_trial_spots !== 1 ? "s" : ""} right now.</span>}
              </p>
            </div>
            <ApplyForTrialForm clubId={club.id} clubName={club.name} />
          </div>
        </aside>
      </section>
    </div>
  );
}