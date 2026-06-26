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

function VerificationPanel({ tableName, recordId, userId, status, notes, onUpdate }: {
  tableName: "scouts" | "clubs"; recordId: number; userId: string; status: string; notes: string | null;
  onUpdate: (status: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const path = `${userId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from("verification-docs").upload(path, file);
      if (uploadError) throw new Error(uploadError.message);
      const { error: updateError } = await (supabase as any).from(tableName).update({
        verification_document_url: path,
        verification_status: "pending",
        verification_submitted_at: new Date().toISOString(),
      }).eq("id", recordId);
      if (updateError) throw new Error(updateError.message);
      onUpdate("pending");
    } catch (err: any) {
      setError(err.message ?? "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  const statusConfig: Record<string, { label: string; color: string }> = {
    unverified: { label: "Not submitted", color: "bg-sand text-muted-foreground" },
    pending: { label: "Under review", color: "bg-yellow-50 text-yellow-700" },
    verified: { label: "✓ Verified", color: "bg-pitch/10 text-pitch" },
    rejected: { label: "Rejected", color: "bg-red-50 text-red-700" },
  };
  const cfg = statusConfig[status] ?? statusConfig.unverified;

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs uppercase tracking-[0.2em] text-ember">Verification</div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cfg.color}`}>{cfg.label}</span>
      </div>

      {status === "verified" ? (
        <p className="text-sm text-muted-foreground">You're verified. This badge is now visible wherever you appear on the platform.</p>
      ) : (
        <>
          {status === "rejected" && notes && (
            <div className="mb-3 bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-xl">
              <span className="font-medium">Reviewer note: </span>{notes}
            </div>
          )}
          <p className="text-sm text-muted-foreground mb-3">
            {status === "pending"
              ? "Your document is under review. We'll update this once it's checked."
              : "Upload a registration certificate, ID, or official letter confirming who you are. An admin will review it."}
          </p>
          <label className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ink text-cream text-sm font-medium hover:bg-pitch transition-colors cursor-pointer ${uploading ? "opacity-60 cursor-not-allowed" : ""}`}>
            {uploading ? "Uploading..." : status === "pending" ? "Replace document" : "Upload document"}
            <input type="file" accept="image/jpeg,image/png,application/pdf" onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
          {error && <p className="text-xs text-destructive mt-2">{error}</p>}
        </>
      )}
    </div>
  );
}

function MessagesIcon({ userId, playerSlug, scoutMode, clubMode }: { userId: string; playerSlug?: string; scoutMode?: boolean; clubMode?: boolean }) {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    async function count() {
      let query = (supabase as any).from("messages").select("id", { count: "exact", head: true }).eq("read", false);
      if (scoutMode) query = query.eq("scout_user_id", userId).eq("sender_type", "player");
      else if (clubMode) query = query.eq("club_user_id", userId).eq("sender_type", "player");
      else if (playerSlug) query = query.eq("to_player_slug", playerSlug).neq("sender_type", "player");
      const { count: c } = await query;
      setUnread(c ?? 0);
    }
    count();
  }, [userId, playerSlug, scoutMode, clubMode]);

  return (
    <Link to="/dashboard-messages" className="relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-border hover:bg-sand transition-colors">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-ember text-cream text-[9px] font-bold grid place-items-center leading-none">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </Link>
  );
}

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
    pos: profile.pos, city: profile.city, club: profile.club,
    age: String(profile.age), number: String(profile.number),
    caps: String((profile.stats as any[]).find((s: any) => s.label === "Caps")?.value ?? "0"),
    goals: String((profile.stats as any[]).find((s: any) => s.label === "Goals")?.value ?? "0"),
    assists: String((profile.stats as any[]).find((s: any) => s.label === "Assists")?.value ?? "0"),
  });

  function set(field: string, value: string) { setForm((f) => ({ ...f, [field]: value })); setError(null); }

  async function save() {
    setSaving(true); setError(null);
    const { error: updateError } = await (supabase as any).from("players").update({
      pos: form.pos, city: form.city, club: form.club,
      age: parseInt(form.age), number: parseInt(form.number),
      stats: [{ label: "Caps", value: form.caps }, { label: "Goals", value: form.goals }, { label: "Assists", value: form.assists }],
    }).eq("user_id", userId);
    if (updateError) { setError("Failed to save. Please try again."); }
    else {
      onUpdate({ ...profile, pos: form.pos, city: form.city, club: form.club, age: parseInt(form.age), number: parseInt(form.number), stats: [{ label: "Caps", value: form.caps }, { label: "Goals", value: form.goals }, { label: "Assists", value: form.assists }] });
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
            <div key={l as string}><div className="text-xs text-muted-foreground mb-0.5">{l}</div><div className="font-medium">{v}</div></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium mb-1">Position</label><select value={form.pos} onChange={(e) => set("pos", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch">{POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}</select></div>
            <div><label className="block text-xs font-medium mb-1">Age</label><input type="number" value={form.age} onChange={(e) => set("age", e.target.value)} min="14" max="40" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch" /></div>
            <div><label className="block text-xs font-medium mb-1">City</label><input value={form.city} onChange={(e) => set("city", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch" /></div>
            <div><label className="block text-xs font-medium mb-1">Jersey No.</label><input type="number" value={form.number} onChange={(e) => set("number", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch" /></div>
            <div className="col-span-2"><label className="block text-xs font-medium mb-1">Club / Academy</label><input value={form.club} onChange={(e) => set("club", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch" /></div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-2">Stats</label>
            <div className="grid grid-cols-3 gap-3">
              {[["caps","Caps"],["goals","Goals"],["assists","Assists"]].map(([field, label]) => (
                <div key={field}><label className="block text-xs text-muted-foreground mb-1">{label}</label><input type="number" value={form[field as keyof typeof form]} onChange={(e) => set(field, e.target.value)} min="0" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch" /></div>
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
      const { data } = await (supabase as any).from("applications").select("*").eq("player_name", playerName).order("created_at", { ascending: false });
      setApplications(data ?? []);
      setLoading(false);
    }
    load();
  }, [playerName]);

  const statusColor: Record<string, string> = { pending: "bg-yellow-50 text-yellow-700", accepted: "bg-green-50 text-green-700", rejected: "bg-red-50 text-red-700" };

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
            <div><div className="font-medium text-sm">{a.club_name}</div><div className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</div></div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColor[a.status] ?? "bg-sand text-muted-foreground"}`}>{a.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Athlete-side: pending invites from clubs, with accept/decline. Accepting
// sets players.club_id, which is the live "verified roster" pointer clubs
// and the public club page both read from.
function ClubInvitesPanel({ playerSlug, onAccepted }: { playerSlug: string; onAccepted: (clubId: number, clubName: string) => void }) {
  const [invites, setInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<Record<number, boolean>>({});

  useEffect(() => {
    async function load() {
      const { data } = await (supabase as any)
        .from("club_invites")
        .select("id,club_id,status,created_at,clubs(name,slug)")
        .eq("player_slug", playerSlug).eq("status", "pending");
      setInvites(data ?? []);
      setLoading(false);
    }
    load();
  }, [playerSlug]);

  async function respond(invite: any, accept: boolean) {
    setResponding((r) => ({ ...r, [invite.id]: true }));
    const { error } = await (supabase as any)
      .from("club_invites")
      .update({ status: accept ? "accepted" : "declined", responded_at: new Date().toISOString() })
      .eq("id", invite.id);

    if (!error && accept) {
      await (supabase as any).from("players").update({ club_id: invite.club_id }).eq("slug", playerSlug);
      onAccepted(invite.club_id, invite.clubs?.name ?? "your new club");
    }
    if (!error) setInvites((prev) => prev.filter((i) => i.id !== invite.id));
    setResponding((r) => ({ ...r, [invite.id]: false }));
  }

  if (loading || invites.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="text-xs uppercase tracking-[0.2em] text-ember mb-4">Club Invites ({invites.length})</div>
      <div className="space-y-3">
        {invites.map((inv) => (
          <div key={inv.id} className="flex items-center justify-between gap-4 border border-border rounded-xl px-4 py-3">
            <div>
              <div className="font-medium text-sm">{inv.clubs?.name ?? "A club"}</div>
              <div className="text-xs text-muted-foreground">wants to add you to their roster</div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => respond(inv, false)} disabled={responding[inv.id]} className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-sand transition-colors disabled:opacity-60">Decline</button>
              <button onClick={() => respond(inv, true)} disabled={responding[inv.id]} className="px-3 py-1.5 rounded-lg bg-ink text-cream text-xs font-medium hover:bg-pitch transition-colors disabled:opacity-60">Accept</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Athlete-side: read-only feed of announcements from the player's verified club.
function ClubAnnouncementsFeed({ clubId }: { clubId: number }) {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await (supabase as any)
        .from("club_announcements").select("*").eq("club_id", clubId).order("created_at", { ascending: false }).limit(5);
      setAnnouncements(data ?? []);
      setLoading(false);
    }
    load();
  }, [clubId]);

  if (loading || announcements.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="text-xs uppercase tracking-[0.2em] text-ember mb-4">From your club</div>
      <div className="space-y-3">
        {announcements.map((a) => (
          <div key={a.id} className="border border-border rounded-xl p-4">
            <div className="font-medium text-sm mb-1">{a.title}</div>
            <p className="text-sm text-muted-foreground">{a.body}</p>
            <div className="text-xs text-muted-foreground mt-2">{new Date(a.created_at).toLocaleDateString("en-NG")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Club-side: edit the rich profile fields shown on the public clubs directory.
function ClubProfileEditor({ profile, onUpdate }: { profile: any; onUpdate: (updated: any) => void }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    location: profile.location ?? "",
    description: profile.description ?? "",
    tier: profile.tier ?? "",
    founded_year: profile.founded_year ? String(profile.founded_year) : "",
    coach_name: profile.coach_name ?? "",
    contact_email: profile.contact_email ?? "",
    contact_phone: profile.contact_phone ?? "",
    website: profile.website ?? "",
    positions_needed: (profile.positions_needed ?? []).join(", "),
    age_groups: (profile.age_groups ?? []).join(", "),
    trial_process: profile.trial_process ?? "",
    open_trial_spots: profile.open_trial_spots != null ? String(profile.open_trial_spots) : "",
  });

  function set(field: string, value: string) { setForm((f) => ({ ...f, [field]: value })); setError(null); }

  async function save() {
    setSaving(true);
    setError(null);
    const payload = {
      location: form.location,
      description: form.description || null,
      tier: form.tier || null,
      founded_year: form.founded_year ? parseInt(form.founded_year) : null,
      coach_name: form.coach_name || null,
      contact_email: form.contact_email || null,
      contact_phone: form.contact_phone || null,
      website: form.website || null,
      positions_needed: form.positions_needed.split(",").map((s: string) => s.trim()).filter(Boolean),
      age_groups: form.age_groups.split(",").map((s: string) => s.trim()).filter(Boolean),
      trial_process: form.trial_process || null,
      open_trial_spots: form.open_trial_spots ? parseInt(form.open_trial_spots) : null,
    };
    const { error: updateError } = await (supabase as any).from("clubs").update(payload).eq("id", profile.id);
    if (updateError) { setError("Failed to save. Please try again."); }
    else { onUpdate({ ...profile, ...payload }); setEditing(false); }
    setSaving(false);
  }

  if (!editing) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs uppercase tracking-[0.2em] text-ember">Public Profile</div>
          <button onClick={() => setEditing(true)} className="text-xs font-medium text-pitch hover:underline">Edit details</button>
        </div>
        {!profile.tier && !profile.description ? (
          <p className="text-sm text-muted-foreground">Your public club page is missing details like tier, coach, contact info, and trial process. Add them so players and scouts know what you're looking for.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><div className="text-xs text-muted-foreground mb-0.5">Tier</div><div className="font-medium">{profile.tier || "—"}</div></div>
            <div><div className="text-xs text-muted-foreground mb-0.5">Founded</div><div className="font-medium">{profile.founded_year || "—"}</div></div>
            <div><div className="text-xs text-muted-foreground mb-0.5">Coach</div><div className="font-medium">{profile.coach_name || "—"}</div></div>
            <div><div className="text-xs text-muted-foreground mb-0.5">Open trial spots</div><div className="font-medium">{profile.open_trial_spots ?? "—"}</div></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
      <div className="text-xs uppercase tracking-[0.2em] text-ember mb-2">Public Profile</div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-medium mb-1">Location</label><input value={form.location} onChange={(e) => set("location", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch" /></div>
        <div><label className="block text-xs font-medium mb-1">Tier</label><input value={form.tier} onChange={(e) => set("tier", e.target.value)} placeholder="e.g. Tier 1 Academy" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch" /></div>
        <div><label className="block text-xs font-medium mb-1">Founded year</label><input type="number" value={form.founded_year} onChange={(e) => set("founded_year", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch" /></div>
        <div><label className="block text-xs font-medium mb-1">Coach name</label><input value={form.coach_name} onChange={(e) => set("coach_name", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch" /></div>
        <div><label className="block text-xs font-medium mb-1">Contact email</label><input value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch" /></div>
        <div><label className="block text-xs font-medium mb-1">Contact phone</label><input value={form.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch" /></div>
        <div><label className="block text-xs font-medium mb-1">Website</label><input value={form.website} onChange={(e) => set("website", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch" /></div>
        <div><label className="block text-xs font-medium mb-1">Open trial spots</label><input type="number" value={form.open_trial_spots} onChange={(e) => set("open_trial_spots", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch" /></div>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">About</label>
        <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch resize-none" />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Positions needed <span className="text-muted-foreground">(comma separated)</span></label>
        <input value={form.positions_needed} onChange={(e) => set("positions_needed", e.target.value)} placeholder="Goalkeeper, Centre Back, Striker" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch" />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Age groups <span className="text-muted-foreground">(comma separated)</span></label>
        <input value={form.age_groups} onChange={(e) => set("age_groups", e.target.value)} placeholder="U-15, U-17, U-20" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch" />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Trial process</label>
        <textarea value={form.trial_process} onChange={(e) => set("trial_process", e.target.value)} rows={2} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch resize-none" />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-3">
        <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-sand transition-colors">Cancel</button>
        <button onClick={save} disabled={saving} className="flex-1 py-2 rounded-xl bg-ink text-cream text-sm font-medium hover:bg-pitch transition-colors disabled:opacity-60">{saving ? "Saving..." : "Save changes"}</button>
      </div>
    </div>
  );
}

// Club-side: roster + invite search + pending invites.
function RosterManager({ clubId }: { clubId: number }) {
  const [roster, setRoster] = useState<any[]>([]);
  const [pendingInvites, setPendingInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [inviting, setInviting] = useState<Record<string, boolean>>({});
  const [actionError, setActionError] = useState<string | null>(null);

  async function loadRoster() {
    const { data: rosterData } = await (supabase as any)
      .from("players").select("slug,name,pos,city,rating,img_url").eq("club_id", clubId);
    setRoster(rosterData ?? []);

    const { data: invitesData } = await (supabase as any)
      .from("club_invites").select("id,player_slug,status,created_at")
      .eq("club_id", clubId).eq("status", "pending").order("created_at", { ascending: false });
    setPendingInvites(invitesData ?? []);
    setLoading(false);
  }

  useEffect(() => { loadRoster(); }, [clubId]);

  async function search() {
    if (!query.trim()) return;
    setSearching(true);
    const q = query.toLowerCase();
    const { data } = await (supabase as any)
      .from("players").select("slug,name,pos,city,club_id")
      .ilike("name", `%${q}%`).limit(8);
    setSearchResults(data ?? []);
    setSearching(false);
  }

  async function sendInvite(playerSlug: string) {
    setInviting((s) => ({ ...s, [playerSlug]: true }));
    setActionError(null);
    const { error } = await (supabase as any).from("club_invites").insert({ club_id: clubId, player_slug: playerSlug });
    if (error) setActionError("Failed to send invite. They may already have a pending invite from you.");
    else await loadRoster();
    setInviting((s) => ({ ...s, [playerSlug]: false }));
  }

  async function cancelInvite(inviteId: number) {
    await (supabase as any).from("club_invites").delete().eq("id", inviteId);
    await loadRoster();
  }

  async function removeFromRoster(slug: string) {
    await (supabase as any).from("players").update({ club_id: null }).eq("slug", slug);
    await loadRoster();
  }

  if (loading) return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-ember mb-4">Roster ({roster.length})</div>
        {roster.length === 0 ? (
          <p className="text-sm text-muted-foreground">No players yet. Search below to invite your first player.</p>
        ) : (
          <div className="space-y-3">
            {roster.map((p) => (
              <div key={p.slug} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-sand">
                  <img src={p.img_url ?? "/assets/player-1.jpg"} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link to="/players/$playerId" params={{ playerId: p.slug }} className="font-medium text-sm hover:text-pitch transition-colors">{p.name}</Link>
                  <div className="text-xs text-muted-foreground">{p.pos} · {p.city}</div>
                </div>
                <button onClick={() => removeFromRoster(p.slug)} className="text-xs text-muted-foreground hover:text-destructive transition-colors shrink-0">Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {pendingInvites.length > 0 && (
        <div className="border-t border-border pt-5">
          <div className="text-xs uppercase tracking-[0.2em] text-ember mb-3">Pending invites ({pendingInvites.length})</div>
          <div className="space-y-2">
            {pendingInvites.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between gap-3 text-sm bg-sand rounded-xl px-4 py-2.5">
                <span className="font-medium">{inv.player_slug}</span>
                <button onClick={() => cancelInvite(inv.id)} className="text-xs text-muted-foreground hover:text-destructive transition-colors">Cancel</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-border pt-5">
        <div className="text-xs uppercase tracking-[0.2em] text-ember mb-3">Invite a player</div>
        <div className="flex gap-2 mb-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="Search players by name..."
            className="flex-1 px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch"
          />
          <button onClick={search} disabled={searching} className="px-4 py-2.5 rounded-xl bg-ink text-cream text-sm font-medium hover:bg-pitch transition-colors disabled:opacity-60">
            {searching ? "..." : "Search"}
          </button>
        </div>
        {actionError && <p className="text-xs text-destructive mb-2">{actionError}</p>}
        {searchResults.length > 0 && (
          <div className="space-y-2">
            {searchResults.map((p) => {
              const alreadyOnRoster = p.club_id === clubId;
              const alreadyInvited = pendingInvites.some((inv) => inv.player_slug === p.slug);
              return (
                <div key={p.slug} className="flex items-center justify-between gap-3 text-sm border border-border rounded-xl px-4 py-2.5">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.pos} · {p.city}</div>
                  </div>
                  {alreadyOnRoster ? (
                    <span className="text-xs text-muted-foreground">Already on roster</span>
                  ) : alreadyInvited ? (
                    <span className="text-xs text-muted-foreground">Invite pending</span>
                  ) : (
                    <button
                      onClick={() => sendInvite(p.slug)}
                      disabled={inviting[p.slug]}
                      className="text-xs font-medium text-pitch hover:underline disabled:opacity-60"
                    >
                      {inviting[p.slug] ? "Sending..." : "Invite"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Club-side: review trial applications submitted to this club.
function ApplicationsReviewPanel({ clubId }: { clubId: number }) {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Record<number, boolean>>({});

  useEffect(() => {
    async function load() {
      const { data } = await (supabase as any)
        .from("applications").select("*").eq("club_id", clubId).order("created_at", { ascending: false });
      setApps(data ?? []);
      setLoading(false);
    }
    load();
  }, [clubId]);

  async function setStatus(id: number, status: string) {
    setUpdating((u) => ({ ...u, [id]: true }));
    const { error } = await (supabase as any).from("applications").update({ status }).eq("id", id);
    if (!error) setApps((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
    setUpdating((u) => ({ ...u, [id]: false }));
  }

  if (loading) return null;

  const statusColor: Record<string, string> = { pending: "bg-yellow-50 text-yellow-700", accepted: "bg-green-50 text-green-700", rejected: "bg-red-50 text-red-700" };

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="text-xs uppercase tracking-[0.2em] text-ember mb-4">Trial Applications ({apps.length})</div>
      {apps.length === 0 ? (
        <p className="text-sm text-muted-foreground">No applications yet.</p>
      ) : (
        <div className="space-y-3">
          {apps.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0">
              <div>
                <div className="font-medium text-sm">{a.player_name}</div>
                <div className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColor[a.status] ?? "bg-sand text-muted-foreground"}`}>{a.status}</span>
                {a.status === "pending" && (
                  <>
                    <button onClick={() => setStatus(a.id, "accepted")} disabled={updating[a.id]} className="text-xs font-medium text-pitch hover:underline disabled:opacity-60">Accept</button>
                    <button onClick={() => setStatus(a.id, "rejected")} disabled={updating[a.id]} className="text-xs font-medium text-destructive hover:underline disabled:opacity-60">Reject</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Club-side: post/manage announcements visible to the roster.
function AnnouncementsManager({ clubId }: { clubId: number }) {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", body: "" });
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const { data } = await (supabase as any)
      .from("club_announcements").select("*").eq("club_id", clubId).order("created_at", { ascending: false });
    setAnnouncements(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [clubId]);

  async function post() {
    if (!form.title.trim() || !form.body.trim()) return setError("Please fill in both fields.");
    setPosting(true);
    setError(null);
    const { error: insertError } = await (supabase as any)
      .from("club_announcements").insert({ club_id: clubId, title: form.title, body: form.body });
    if (insertError) setError("Failed to post. Please try again.");
    else { setForm({ title: "", body: "" }); await load(); }
    setPosting(false);
  }

  async function remove(id: number) {
    await (supabase as any).from("club_announcements").delete().eq("id", id);
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  }

  if (loading) return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-ember mb-3">Post an announcement</div>
        <div className="space-y-2">
          <input
            value={form.title}
            onChange={(e) => { setForm((f) => ({ ...f, title: e.target.value })); setError(null); }}
            placeholder="Title"
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch"
          />
          <textarea
            value={form.body}
            onChange={(e) => { setForm((f) => ({ ...f, body: e.target.value })); setError(null); }}
            rows={3}
            placeholder="What do you want your roster to know?"
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch resize-none"
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
          <button onClick={post} disabled={posting} className="px-4 py-2.5 rounded-xl bg-ink text-cream text-sm font-medium hover:bg-pitch transition-colors disabled:opacity-60">
            {posting ? "Posting..." : "Post to roster"}
          </button>
        </div>
      </div>

      {announcements.length > 0 && (
        <div className="border-t border-border pt-5">
          <div className="text-xs uppercase tracking-[0.2em] text-ember mb-3">Past announcements</div>
          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="border border-border rounded-xl p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="font-medium text-sm">{a.title}</div>
                  <button onClick={() => remove(a.id)} className="text-xs text-muted-foreground hover:text-destructive transition-colors shrink-0">Delete</button>
                </div>
                <p className="text-sm text-muted-foreground">{a.body}</p>
                <div className="text-xs text-muted-foreground mt-2">{new Date(a.created_at).toLocaleDateString("en-NG")}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SavedPlayersSection({ userId }: { userId: string }) {
  const [saved, setSaved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: savedData } = await (supabase as any).from("saved_players").select("player_slug, created_at").eq("scout_user_id", userId).order("created_at", { ascending: false });
      if (!savedData || savedData.length === 0) { setLoading(false); return; }
      const slugs = savedData.map((s: any) => s.player_slug);
      const { data: players } = await (supabase as any).from("players").select("slug,name,pos,city,club,rating,img_url").in("slug", slugs);
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
  const [isAdmin, setIsAdmin] = useState(false);
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

      const { data: adminRow } = await (supabase as any).from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
      setIsAdmin(!!adminRow);

      const { data: playerData } = await (supabase as any).from("players").select("*").eq("user_id", user.id).single();

      if (playerData) {
        let clubInfo = null;
        if (playerData.club_id) {
          const { data: clubData } = await (supabase as any).from("clubs").select("id,name,slug").eq("id", playerData.club_id).single();
          clubInfo = clubData;
        }
        setProfile({ type: "athlete", clubInfo, ...playerData });
        setBioValue(playerData.bio || "");
        return setLoading(false);
      }

      const { data: scoutData } = await (supabase as any).from("scouts").select("*").eq("user_id", user.id).single();
      if (scoutData) { setProfile({ type: "scout", ...scoutData }); return setLoading(false); }

      const { data: clubData } = await (supabase as any).from("clubs").select("*").eq("user_id", user.id).single();
      if (clubData) { setProfile({ type: "club", ...clubData }); return setLoading(false); }

      setLoading(false);
    }
    load();
  }, [navigate]);

  async function handleSignOut() { await supabase.auth.signOut(); navigate({ to: "/" }); }

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
    setUploadingPhoto(true); setSaveError(null);
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
    const updated = [...(profile.video_urls ?? []), newVideo.trim()];
    const { error } = await (supabase as any).from("players").update({ video_urls: updated }).eq("user_id", user.id);
    if (!error) { setProfile((p: any) => ({ ...p, video_urls: updated })); setNewVideo(""); }
    setSavingVideo(false);
  }

  async function removeVideoUrl(url: string) {
    if (!user) return;
    const updated = (profile.video_urls ?? []).filter((v: string) => v !== url);
    await (supabase as any).from("players").update({ video_urls: updated }).eq("user_id", user.id);
    setProfile((p: any) => ({ ...p, video_urls: updated }));
  }

  function handleInviteAccepted(clubId: number, clubName: string) {
    setProfile((p: any) => ({ ...p, club: clubName, club_id: clubId, clubInfo: { id: clubId, name: clubName } }));
  }

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-muted-foreground text-sm">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 lg:py-20">

        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-ember mb-1">Dashboard</div>
            <h1 className="font-display text-3xl">Welcome{profile?.name ? `, ${profile.name.split(" ")[0]}` : ""}.</h1>
          </div>
          <div className="flex items-center gap-3">
            {user && profile?.type === "athlete" && <MessagesIcon userId={user.id} playerSlug={profile.slug} />}
            {user && profile?.type === "scout" && <MessagesIcon userId={user.id} scoutMode />}
            {user && profile?.type === "club" && <MessagesIcon userId={user.id} clubMode />}
            {isAdmin && <Link to="/dashboard/admin" className="text-sm font-medium text-ember hover:underline">Admin →</Link>}
            <button onClick={handleSignOut} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign out</button>
          </div>
        </div>

        {saveError && <div className="mb-6 bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-xl">{saveError}</div>}

        {/* ATHLETE */}
        {profile?.type === "athlete" && (
          <div className="space-y-6">
            <ClubInvitesPanel playerSlug={profile.slug} onAccepted={handleInviteAccepted} />
            <ProfileCompletion profile={profile} />
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
                  <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                    {profile.pos} · {profile.city} · {profile.club}
                    {profile.clubInfo && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-pitch/10 text-pitch">✓ Verified by {profile.clubInfo.name}</span>}
                  </div>
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
            {user && <EditProfileSection profile={profile} userId={user.id} onUpdate={setProfile} />}
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
            <TrialTracker playerName={profile.name} />
            {profile.clubInfo && <ClubAnnouncementsFeed clubId={profile.clubInfo.id} />}
            <Link to="/players/$playerId" params={{ playerId: profile.slug }} className="inline-flex items-center gap-2 text-sm font-medium text-pitch hover:underline">
              View your public profile →
            </Link>
          </div>
        )}

        {/* SCOUT */}
        {profile?.type === "scout" && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-display text-2xl">{profile.name}</h2>
                {profile.verified && <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-pitch text-cream">✓ Verified</span>}
              </div>
              <div className="text-sm text-muted-foreground mb-6">{profile.role} · {profile.organisation}</div>
              <div className="flex flex-wrap gap-3">
                <Link to="/featured-players" className="px-5 py-3 rounded-full bg-ink text-cream text-sm font-medium hover:bg-pitch transition-colors">Browse players →</Link>
                <Link to="/compare" className="px-5 py-3 rounded-full border border-border text-sm font-medium hover:bg-sand transition-colors">Compare players</Link>
                <Link to="/leaderboard" className="px-5 py-3 rounded-full border border-border text-sm font-medium hover:bg-sand transition-colors">Leaderboard</Link>
              </div>
            </div>
            {user && <SavedPlayersSection userId={user.id} />}
            {user && (
              <VerificationPanel
                tableName="scouts"
                recordId={profile.id}
                userId={user.id}
                status={profile.verification_status}
                notes={profile.verification_notes}
                onUpdate={(status) => setProfile((p: any) => ({ ...p, verification_status: status }))}
              />
            )}
          </div>
        )}

        {/* CLUB */}
        {profile?.type === "club" && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-2xl">{profile.name}</h2>
                {profile.verified && <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-pitch text-cream">✓ Verified</span>}
              </div>
              <div className="text-sm text-muted-foreground mb-6">{profile.location}</div>
              <Link to="/clubs/$clubId" params={{ clubId: profile.slug }} className="inline-flex items-center gap-2 text-sm font-medium text-pitch hover:underline">
                View your public club page →
              </Link>
            </div>
            <ClubProfileEditor profile={profile} onUpdate={setProfile} />
            <RosterManager clubId={profile.id} />
            <ApplicationsReviewPanel clubId={profile.id} />
            <AnnouncementsManager clubId={profile.id} />
            {user && (
              <VerificationPanel
                tableName="clubs"
                recordId={profile.id}
                userId={user.id}
                status={profile.verification_status}
                notes={profile.verification_notes}
                onUpdate={(status) => setProfile((p: any) => ({ ...p, verification_status: status, verified: status === "verified" }))}
              />
            )}
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