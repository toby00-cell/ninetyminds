import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [{ title: "Dashboard — NinetyMinds" }],
  }),
  component: Dashboard,
});

const ADMIN_EMAIL = "brightjoel196@gmail.com";

function ProfileCompletion({ profile }: { profile: any }) {
  const checks = [
    { label: "Profile photo", done: !!profile.img_url },
    { label: "Bio written", done: !!profile.bio && profile.bio.length > 20 },
    { label: "Stats added", done: (profile.stats as any[]).some((s) => parseInt(s.value) > 0) },
    { label: "Video highlight", done: (profile.video_urls ?? []).length > 0 },
    { label: "Highlights listed", done: (profile.highlights ?? []).length > 0 },
  ];
  const score = Math.round((checks.filter((c) => c.done).length / checks.length) * 100);
  const color = score === 100 ? "bg-green-500" : score >= 60 ? "bg-pitch" : "bg-ember";

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs uppercase tracking-[0.2em] text-ember">Profile Completion</div>
        <div className="font-display text-3xl text-pitch">{score}%</div>
      </div>
      <div className="h-2 bg-sand rounded-full overflow-hidden mb-4">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${score}%` }} />
      </div>
      <div className="space-y-2">
        {checks.map((c) => (
          <div key={c.label} className="flex items-center gap-3 text-sm">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${c.done ? "bg-pitch text-cream" : "bg-sand border border-border"}`}>
              {c.done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
            </div>
            <span className={c.done ? "text-foreground" : "text-muted-foreground"}>{c.label}</span>
          </div>
        ))}
      </div>
      {score === 100 && <div className="mt-3 text-xs text-pitch font-medium">✓ Profile complete. Scouts can see everything they need.</div>}
    </div>
  );
}

const POSITIONS = ["Goalkeeper","Defender","Right Back","Left Back","Centre Back","Defensive Mid","Midfielder","Attacking Mid","Winger","Forward","Striker"];

function EditProfileSection({ profile, userId, onUpdate }: { profile: any; userId: string; onUpdate: (updated: any) => void }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    pos: profile.pos,
    city: profile.city,
    club: profile.club,
    age: String(profile.age),
    number: String(profile.number),
    caps: String((profile.stats as any[]).find((s: any) => s.label === "Caps")?.value ?? "0"),
    goals: String((profile.stats as any[]).find((s: any) => s.label === "Goals")?.value ?? "0"),
    assists: String((profile.stats as any[]).find((s: any) => s.label === "Assists")?.value ?? "0"),
  });

  function set(field: string, value: string) { setForm((f) => ({ ...f, [field]: value })); setError(null); }

  async function save() {
    setSaving(true);
    setError(null);
    const { error: updateError } = await (supabase as any).from("players").update({
      pos: form.pos,
      city: form.city,
      club: form.club,
      age: parseInt(form.age),
      number: parseInt(form.number),
      stats: [
        { label: "Caps", value: form.caps },
        { label: "Goals", value: form.goals },
        { label: "Assists", value: form.assists },
      ],
    }).eq("user_id", userId);
    if (updateError) { setError("Failed to save. Please try again."); }
    else {
      onUpdate({
        ...profile,
        pos: form.pos, city: form.city, club: form.club,
        age: parseInt(form.age), number: parseInt(form.number),
        stats: [
          { label: "Caps", value: form.caps },
          { label: "Goals", value: form.goals },
          { label: "Assists", value: form.assists },
        ],
      });
      setEditing(false);
    }
    setSaving(false);
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs uppercase tracking-[0.2em] text-ember">Edit Profile</div>
        {!editing && <button onClick={() => setEditing(true)} className="text-xs font-medium text-pitch hover:underline">Edit details</button>}
      </div>
      {!editing ? (
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[["Position", profile.pos], ["City", profile.city], ["Club", profile.club], ["Age", profile.age], ["Jersey No.", profile.number]].map(([l, v]) => (
            <div key={l as string}>
              <div className="text-xs text-muted-foreground mb-0.5">{l}</div>
              <div className="font-medium">{v}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Position</label>
              <select value={form.pos} onChange={(e) => set("pos", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch">
                {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Age</label>
              <input type="number" value={form.age} onChange={(e) => set("age", e.target.value)} min="14" max="40" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">City</label>
              <input value={form.city} onChange={(e) => set("city", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Jersey No.</label>
              <input type="number" value={form.number} onChange={(e) => set("number", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1">Club / Academy</label>
              <input value={form.club} onChange={(e) => set("club", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-2">Stats</label>
            <div className="grid grid-cols-3 gap-3">
              {[["caps","Caps"],["goals","Goals"],["assists","Assists"]].map(([field, label]) => (
                <div key={field}>
                  <label className="block text-xs text-muted-foreground mb-1">{label}</label>
                  <input type="number" value={form[field as keyof typeof form]} onChange={(e) => set(field, e.target.value)} min="0" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch" />
                </div>
              ))}
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-3">
            <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-sand transition-colors">Cancel</button>
            <button onClick={save} disabled={saving} className="flex-1 py-2 rounded-xl bg-ink text-cream text-sm font-medium hover:bg-pitch transition-colors disabled:opacity-60">{saving ? "Saving..." : "Save changes"}</button>
          </div>
        </div>
      )}
    </div>
  );
}

function TrialTracker({ playerName }: { playerName: string }) {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await (supabase as any)
        .from("applications")
        .select("*")
        .eq("player_name", playerName)
        .order("created_at", { ascending: false });
      setApplications(data ?? []);
      setLoading(false);
    }
    load();
  }, [playerName]);

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700",
    accepted: "bg-green-50 text-green-700",
    rejected: "bg-red-50 text-red-700",
  };

  if (loading) return null;
  if (applications.length === 0) return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="text-xs uppercase tracking-[0.2em] text-ember mb-3">Trial Applications</div>
      <p className="text-sm text-muted-foreground">You haven't applied to any trials yet. <Link to="/clubs" className="text-pitch hover:underline">Browse clubs →</Link></p>
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="text-xs uppercase tracking-[0.2em] text-ember mb-4">Trial Applications</div>
      <div className="space-y-3">
        {applications.map((a) => (
          <div key={a.id} className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0">
            <div>
              <div className="font-medium text-sm">{a.club_name}</div>
              <div className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</div>
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColor[a.status] ?? "bg-sand text-muted-foreground"}`}>
              {a.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Groups messages into per-scout threads (keyed by scout_user_id) and lets the
// player reply directly within each thread. Messages sent before the two-way
// schema migration have no scout_user_id, so each is shown as its own
// non-replyable "legacy" thread rather than being merged together.
function MessageThreads({ playerSlug, playerName, playerClub }: { playerSlug: string; playerName: string; playerClub: string }) {
  const [threads, setThreads] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [sending, setSending] = useState<Record<string, boolean>>({});
  const [replyError, setReplyError] = useState<Record<string, string>>({});

  useEffect(() => {
    async function load() {
      const { data } = await (supabase as any)
        .from("messages")
        .select("*")
        .eq("to_player_slug", playerSlug)
        .order("created_at", { ascending: true });

      const grouped: Record<string, any[]> = {};
      (data ?? []).forEach((m: any) => {
        const key = m.scout_user_id ?? `legacy-${m.id}`;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(m);
      });
      setThreads(grouped);
      setLoading(false);
    }
    load();
  }, [playerSlug]);

  async function sendReply(threadKey: string, originalSubject: string) {
    const text = (replyText[threadKey] ?? "").trim();
    if (!text) return;
    setSending((s) => ({ ...s, [threadKey]: true }));
    setReplyError((e) => ({ ...e, [threadKey]: "" }));

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSending((s) => ({ ...s, [threadKey]: false })); return; }

    const subject = originalSubject?.startsWith("Re: ") ? originalSubject : `Re: ${originalSubject}`;

    const { data: inserted, error } = await (supabase as any).from("messages").insert({
      from_user_id: user.id,
      scout_user_id: threadKey,
      to_player_slug: playerSlug,
      from_name: playerName,
      from_org: playerClub,
      subject,
      body: text,
      sender_type: "player",
    }).select().single();

    if (error || !inserted) {
      setReplyError((e) => ({ ...e, [threadKey]: "Failed to send reply. Please try again." }));
    } else {
      setThreads((prev) => ({ ...prev, [threadKey]: [...(prev[threadKey] ?? []), inserted] }));
      setReplyText((r) => ({ ...r, [threadKey]: "" }));
    }
    setSending((s) => ({ ...s, [threadKey]: false }));
  }

  if (loading) return null;
  const threadKeys = Object.keys(threads);
  if (threadKeys.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="text-xs uppercase tracking-[0.2em] text-ember mb-4">Messages from Scouts ({threadKeys.length})</div>
      <div className="space-y-6">
        {threadKeys.map((threadKey) => {
          const msgs = threads[threadKey];
          const first = msgs[0];
          const isLegacy = threadKey.startsWith("legacy-");

          return (
            <div key={threadKey} className="border border-border rounded-xl p-4 space-y-4">
              {msgs.map((m) => (
                <div key={m.id} className={m.sender_type === "player" ? "ml-6" : ""}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <div className="font-medium text-sm">{m.sender_type === "player" ? "You" : m.from_name}</div>
                      {m.sender_type !== "player" && <div className="text-xs text-muted-foreground">{m.from_org}</div>}
                    </div>
                    <div className="text-xs text-muted-foreground shrink-0">{new Date(m.created_at).toLocaleDateString("en-NG")}</div>
                  </div>
                  {m.sender_type !== "player" && <div className="text-sm font-medium mb-1">{m.subject}</div>}
                  <p className={m.sender_type === "player" ? "text-sm bg-sand rounded-xl px-3 py-2" : "text-sm text-muted-foreground"}>{m.body}</p>
                </div>
              ))}

              {isLegacy ? (
                <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                  This message was sent before replies were supported, so it can't be replied to here.
                </p>
              ) : (
                <div className="pt-2 border-t border-border space-y-2">
                  {replyError[threadKey] && <p className="text-xs text-destructive">{replyError[threadKey]}</p>}
                  <div className="flex gap-2">
                    <input
                      value={replyText[threadKey] ?? ""}
                      onChange={(e) => setReplyText((r) => ({ ...r, [threadKey]: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && sendReply(threadKey, first.subject)}
                      placeholder={`Reply to ${first.from_name}...`}
                      className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch"
                    />
                    <button
                      onClick={() => sendReply(threadKey, first.subject)}
                      disabled={sending[threadKey] || !(replyText[threadKey] ?? "").trim()}
                      className="px-4 py-2 rounded-xl bg-ink text-cream text-sm font-medium hover:bg-pitch transition-colors disabled:opacity-60"
                    >
                      {sending[threadKey] ? "..." : "Reply"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SavedPlayersSection({ userId }: { userId: string }) {
  const [saved, setSaved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: savedData } = await (supabase as any)
        .from("saved_players")
        .select("player_slug, created_at")
        .eq("scout_user_id", userId)
        .order("created_at", { ascending: false });

      if (!savedData || savedData.length === 0) { setLoading(false); return; }

      const slugs = savedData.map((s: any) => s.player_slug);
      const { data: players } = await (supabase as any)
        .from("players")
        .select("slug,name,pos,city,club,rating,img_url")
        .in("slug", slugs);

      setSaved(players ?? []);
      setLoading(false);
    }
    load();
  }, [userId]);

  async function unsave(slug: string) {
    await (supabase as any).from("saved_players").delete().eq("scout_user_id", userId).eq("player_slug", slug);
    setSaved((prev) => prev.filter((p) => p.slug !== slug));
  }

  if (loading) return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="text-xs uppercase tracking-[0.2em] text-ember mb-4">Saved Players</div>
      {saved.length === 0 ? (
        <p className="text-sm text-muted-foreground">No saved players yet. <Link to="/featured-players" className="text-pitch hover:underline">Browse players →</Link></p>
      ) : (
        <div className="space-y-3">
          {saved.map((p) => (
            <div key={p.slug} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-sand">
                <img src={p.img_url ?? "/assets/player-1.jpg"} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <Link to="/players/$playerId" params={{ playerId: p.slug }} className="font-medium text-sm hover:text-pitch transition-colors">{p.name}</Link>
                <div className="text-xs text-muted-foreground">{p.pos} · {p.city}</div>
              </div>
              <div className="font-display text-xl text-pitch shrink-0">{p.rating}</div>
              <button onClick={() => unsave(p.slug)} className="text-xs text-muted-foreground hover:text-destructive transition-colors shrink-0">Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingBio, setEditingBio] = useState(false);
  const [bioValue, setBioValue] = useState("");
  const [savingBio, setSavingBio] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [savingVideo, setSavingVideo] = useState(false);
  const [newVideo, setNewVideo] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate({ to: "/login" }); return; }
      setUser(user);

      const { data: playerData } = await (supabase as any)
        .from("players").select("*").eq("user_id", user.id).single();

      if (playerData) {
        setProfile({ type: "athlete", ...playerData });
        setBioValue(playerData.bio || "");
      } else {
        const { data: scoutData } = await (supabase as any)
          .from("scouts").select("*").eq("user_id", user.id).single();
        if (scoutData) setProfile({ type: "scout", ...scoutData });
      }
      setLoading(false);
    }
    load();
  }, [navigate]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  async function saveBio() {
    if (!profile || !user) return;
    setSavingBio(true);
    const { error } = await (supabase as any).from("players").update({ bio: bioValue }).eq("user_id", user.id);
    if (error) setSaveError("Failed to save bio.");
    else { setProfile((p: any) => ({ ...p, bio: bioValue })); setEditingBio(false); }
    setSavingBio(false);
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingPhoto(true);
    setSaveError(null);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("players").upload(path, file, { upsert: true });
      if (uploadError) throw new Error(uploadError.message);
      const { data: urlData } = supabase.storage.from("players").getPublicUrl(path);
      const { error: updateError } = await (supabase as any).from("players").update({ img_url: urlData.publicUrl }).eq("user_id", user.id);
      if (updateError) throw new Error(updateError.message);
      setProfile((p: any) => ({ ...p, img_url: urlData.publicUrl }));
    } catch (err: any) { setSaveError(err.message); }
    finally { setUploadingPhoto(false); }
  }

  async function addVideoUrl() {
    if (!newVideo.trim() || !user) return;
    setSavingVideo(true);
    const current = profile.video_urls ?? [];
    const updated = [...current, newVideo.trim()];
    const { error } = await (supabase as any).from("players").update({ video_urls: updated }).eq("user_id", user.id);
    if (!error) { setProfile((p: any) => ({ ...p, video_urls: updated })); setNewVideo(""); }
    setSavingVideo(false);
  }

  async function removeVideoUrl(url: string) {
    const updated = (profile.video_urls ?? []).filter((v: string) => v !== url);
    await (supabase as any).from("players").update({ video_urls: updated }).eq("user_id", user.id);
    setProfile((p: any) => ({ ...p, video_urls: updated }));
  }

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-muted-foreground text-sm">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 lg:py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-ember mb-1">Dashboard</div>
            <h1 className="font-display text-3xl">Welcome{profile?.name ? `, ${profile.name.split(" ")[0]}` : ""}.</h1>
          </div>
          <div className="flex items-center gap-4">
            {user?.email === ADMIN_EMAIL && <Link to="/dashboard/admin" className="text-sm font-medium text-ember hover:underline">Admin →</Link>}
            <button onClick={handleSignOut} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign out</button>
          </div>
        </div>

        {saveError && <div className="mb-6 bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-xl">{saveError}</div>}

        {/* ATHLETE */}
        {profile?.type === "athlete" && (
          <div className="space-y-6">
            {/* Profile completion */}
            <ProfileCompletion profile={profile} />

            {/* Profile card */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
              <div className="flex items-start gap-6">
                <div className="relative shrink-0">
                  <div className="w-24 h-24 rounded-xl bg-sand border border-border overflow-hidden">
                    {profile.img_url ? <img src={profile.img_url} alt={profile.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs text-center px-2">No photo</div>}
                  </div>
                  <label className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-ink text-cream flex items-center justify-center cursor-pointer hover:bg-pitch transition-colors ${uploadingPhoto ? "opacity-50 cursor-not-allowed" : ""}`}>
                    {uploadingPhoto ? <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>}
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploadingPhoto} />
                  </label>
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-2xl">{profile.name}</h2>
                  <div className="text-sm text-muted-foreground mt-1">{profile.pos} · {profile.city} · {profile.club}</div>
                  <div className="mt-3 inline-flex items-center gap-2 bg-pitch/10 text-pitch text-xs font-medium px-3 py-1 rounded-full">Scout rating: {profile.rating}</div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-6">
                {(profile.stats as { label: string; value: string }[]).map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="font-display text-3xl">{s.value}</div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Edit profile details */}
            {user && <EditProfileSection profile={profile} userId={user.id} onUpdate={setProfile} />}

            {/* Bio */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs uppercase tracking-[0.2em] text-ember">Bio</div>
                {!editingBio && <button onClick={() => setEditingBio(true)} className="text-xs font-medium text-pitch hover:underline">Edit</button>}
              </div>
              {editingBio ? (
                <div className="space-y-3">
                  <textarea value={bioValue} onChange={(e) => setBioValue(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch resize-none" />
                  <div className="flex gap-3">
                    <button onClick={() => { setEditingBio(false); setBioValue(profile.bio || ""); }} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-sand transition-colors">Cancel</button>
                    <button onClick={saveBio} disabled={savingBio} className="px-4 py-2 rounded-xl bg-ink text-cream text-sm font-medium hover:bg-pitch transition-colors disabled:opacity-60">{savingBio ? "Saving..." : "Save bio"}</button>
                  </div>
                </div>
              ) : <p className="text-muted-foreground">{profile.bio || "No bio yet. Click Edit to add one."}</p>}
            </div>

            {/* Video highlights */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-ember mb-3">Video Highlights</div>
              <div className="flex gap-2 mb-4">
                <input type="url" value={newVideo} onChange={(e) => setNewVideo(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch" />
                <button onClick={addVideoUrl} disabled={savingVideo || !newVideo.trim()} className="px-4 py-2.5 rounded-xl bg-ink text-cream text-sm font-medium hover:bg-pitch transition-colors disabled:opacity-60">{savingVideo ? "..." : "Add"}</button>
              </div>
              {(profile.video_urls ?? []).length > 0 ? (
                <div className="space-y-2">
                  {(profile.video_urls as string[]).map((url: string) => (
                    <div key={url} className="flex items-center gap-3 p-3 rounded-xl bg-sand border border-border">
                      <a href={url} target="_blank" rel="noopener noreferrer" className="flex-1 text-sm text-pitch hover:underline truncate">{url}</a>
                      <button onClick={() => removeVideoUrl(url)} className="text-xs text-destructive hover:underline shrink-0">Remove</button>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-muted-foreground">No videos added yet.</p>}
            </div>

            {/* Trial tracker */}
            <TrialTracker playerName={profile.name} />

            {/* Messages — now threaded, with reply support */}
            <MessageThreads playerSlug={profile.slug} playerName={profile.name} playerClub={profile.club} />

            <Link to="/players/$playerId" params={{ playerId: profile.slug }} className="inline-flex items-center gap-2 text-sm font-medium text-pitch hover:underline">
              View your public profile →
            </Link>
          </div>
        )}

        {/* SCOUT */}
        {profile?.type === "scout" && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
              <h2 className="font-display text-2xl mb-1">{profile.name}</h2>
              <div className="text-sm text-muted-foreground mb-6">{profile.role} · {profile.organisation}</div>
              <div className="flex flex-wrap gap-3">
                <Link to="/featured-players" className="px-5 py-3 rounded-full bg-ink text-cream text-sm font-medium hover:bg-pitch transition-colors">Browse players →</Link>
                <Link to="/compare" className="px-5 py-3 rounded-full border border-border text-sm font-medium hover:bg-sand transition-colors">Compare players</Link>
                <Link to="/leaderboard" className="px-5 py-3 rounded-full border border-border text-sm font-medium hover:bg-sand transition-colors">Leaderboard</Link>
              </div>
            </div>
            {user && <SavedPlayersSection userId={user.id} />}
          </div>
        )}

        {!profile && (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">No profile found for this account.</p>
            <Link to="/register/athlete" className="text-pitch hover:underline text-sm">Create an athlete profile</Link>
          </div>
        )}
      </div>
    </div>
  );
}