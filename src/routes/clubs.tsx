import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

export const Route = createFileRoute("/clubs")({
  head: () => ({
    meta: [
      { title: "Clubs — NinetyMinds" },
      { name: "description", content: "Discover football clubs and academies across Nigeria. Connect with verified grassroots talent." },
    ],
  }),
  component: ClubsPage,
});

function ApplyForTrialButton({ clubId, clubName }: { clubId: number; clubName: string }) {
  const [state, setState] = useState<"idle" | "checking" | "ready" | "no-profile" | "signed-out" | "done">("checking");
  const [player, setPlayer] = useState<{ slug: string; name: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setState("signed-out"); return; }
      const { data } = await (supabase as any).from("players").select("slug,name").eq("user_id", user.id).single();
      if (!data) { setState("no-profile"); return; }
      setPlayer(data);
      setState("ready");
    }
    check();
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
    if (insertError) setError("Failed to apply. Please try again.");
    else setState("done");
    setSending(false);
  }

  if (state === "checking") return null;

  if (state === "done") {
    return <div className="text-sm text-pitch font-medium">✓ Application submitted! Track its status from your dashboard.</div>;
  }

  if (state === "signed-out") {
    return (
      <p className="text-sm text-muted-foreground">
        <Link to="/login" className="text-pitch hover:underline">Sign in as an athlete</Link> to apply for a trial.
      </p>
    );
  }

  if (state === "no-profile") {
    return (
      <p className="text-sm text-muted-foreground">
        <Link to="/register/athlete" className="text-pitch hover:underline">Create an athlete profile</Link> to apply for trials.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-xs text-destructive">{error}</p>}
      <button onClick={apply} disabled={sending} className="w-full py-2.5 rounded-xl bg-pitch text-cream text-sm font-medium hover:bg-ink transition-colors disabled:opacity-60">
        {sending ? "Submitting..." : `Apply for trial at ${clubName} →`}
      </button>
    </div>
  );
}

function ClubsPage() {
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: clubsData } = await (supabase as any).from("clubs").select("id,user_id,name,slug,location,description,logo_url,verified,tier,founded_year,coach_name,contact_email,contact_phone,website,positions_needed,age_groups,trial_process,open_trial_spots,created_at").order("created_at", { ascending: true });
      const { data: rosterRows } = await (supabase as any).from("players").select("club_id").not("club_id", "is", null);

      const counts: Record<number, number> = {};
      (rosterRows ?? []).forEach((r: any) => { counts[r.club_id] = (counts[r.club_id] ?? 0) + 1; });

      setClubs((clubsData ?? []).map((c: any) => ({ ...c, rosterCount: counts[c.id] ?? 0 })));
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  const totalScouted = clubs.reduce((sum, c) => sum + c.rosterCount, 0);
  const locations = new Set(clubs.map((c) => c.location).filter(Boolean));
  const verifiedPct = clubs.length > 0 ? Math.round((clubs.filter((c) => c.verified).length / clubs.length) * 100) : 0;

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16 lg:py-24">
        <div className="text-xs uppercase tracking-[0.2em] text-ember mb-4">Partner Clubs</div>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.0] max-w-3xl mb-4">
          Clubs scouting on <span className="text-pitch">NinetyMinds.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mb-10">
          Academies, feeder clubs and senior sides across Nigeria use NinetyMinds to find verified talent.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {[
            [String(clubs.length), "Partner clubs"],
            [String(totalScouted), "Players on rosters"],
            [String(locations.size), "Locations"],
            [`${verifiedPct}%`, "Profiles verified"],
          ].map(([v, l]) => (
            <div key={l} className="bg-card border border-border rounded-2xl p-5">
              <div className="font-display text-4xl text-pitch">{v}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{l}</div>
            </div>
          ))}
        </div>

        {clubs.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center">
            <p className="text-muted-foreground">No clubs have registered yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {clubs.map((c) => (
              <article key={c.slug} className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-border">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-5">
                      <div className="shrink-0 h-14 w-14 rounded-xl bg-pitch text-cream grid place-items-center font-display text-2xl overflow-hidden">
                        {c.logo_url ? <img src={c.logo_url} alt={c.name} className="w-full h-full object-cover" /> : c.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {c.tier && <div className="text-xs uppercase tracking-[0.2em] text-ember">{c.tier}</div>}
                          {c.verified && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-pitch text-cream">✓ Verified</span>}
                        </div>
                        <h2 className="font-display text-2xl sm:text-3xl leading-tight">{c.name}</h2>
                        <div className="text-sm text-muted-foreground mt-1">
                          {c.location}{c.founded_year ? ` · Est. ${c.founded_year}` : ""}
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:grid grid-cols-2 gap-6 text-right shrink-0">
                      <div><div className="font-display text-2xl">{c.rosterCount}</div><div className="text-xs uppercase tracking-widest text-muted-foreground">Signed</div></div>
                      {c.open_trial_spots != null && (
                        <div><div className="font-display text-2xl text-ember">{c.open_trial_spots}</div><div className="text-xs uppercase tracking-widest text-muted-foreground">Open trials</div></div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-6 sm:p-8 grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-5">
                    {c.description && (
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-ember mb-2">About</div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{c.description}</p>
                      </div>
                    )}
                    {c.trial_process && (
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-ember mb-2">Trial Process</div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{c.trial_process}</p>
                      </div>
                    )}
                    {c.age_groups?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {c.age_groups.map((ag: string) => <span key={ag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-sand border border-border">{ag}</span>)}
                      </div>
                    )}
                    <Link to="/clubs/$clubId" params={{ clubId: c.slug }} className="inline-flex items-center gap-2 text-sm font-medium text-pitch hover:underline">
                      View full profile & roster →
                    </Link>
                  </div>
                  <div className="space-y-5">
                    {c.positions_needed?.length > 0 && (
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-ember mb-2">Positions Needed</div>
                        <div className="flex flex-wrap gap-1.5">
                          {c.positions_needed.map((p: string) => <span key={p} className="text-xs font-medium px-2.5 py-1 rounded-full bg-pitch/10 text-pitch">{p}</span>)}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-ember mb-2">Contact</div>
                      <div className="space-y-2 text-sm mb-4">
                        {c.coach_name && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            {c.coach_name}
                          </div>
                        )}
                        {c.contact_email && (
                          <a href={`mailto:${c.contact_email}`} className="flex items-center gap-2 text-pitch hover:underline">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                            {c.contact_email}
                          </a>
                        )}
                        {c.contact_phone && (
                          <a href={`tel:${c.contact_phone}`} className="flex items-center gap-2 text-pitch hover:underline">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.64 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.81-.81a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.62v-.7z"/></svg>
                            {c.contact_phone}
                          </a>
                        )}
                        {!c.coach_name && !c.contact_email && !c.contact_phone && (
                          <p className="text-muted-foreground">This club hasn't added contact details yet.</p>
                        )}
                      </div>
                      <ApplyForTrialButton clubId={c.id} clubName={c.name} />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-16 bg-ink text-cream rounded-3xl p-8 lg:p-14 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-display text-3xl lg:text-4xl leading-tight">Are you a club? <em className="text-ember">Scout with us.</em></h2>
            <p className="mt-3 text-cream/70 max-w-md">Get verified profiles, video, and stats from grassroots talent across all 36 states. Free for accredited Nigerian clubs in 2026.</p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link to="/register/club" className="px-6 py-3 rounded-full bg-ember text-cream font-medium hover:opacity-90 transition">Register your club</Link>
            <Link to="/featured-players" className="px-6 py-3 rounded-full border border-cream/30 text-cream hover:bg-cream/10 transition">Browse players</Link>
          </div>
        </div>
      </div>
    </div>
  );
}