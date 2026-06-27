import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { sendVerificationEmail } from "@/lib/api/verification.functions";

export const Route = createFileRoute("/dashboard/admin")({
  head: () => ({
    meta: [{ title: "Admin — NinetyMinds" }],
  }),
  component: AdminDashboard,
});

type Tab = "stats" | "players" | "scouts" | "clubs" | "verification" | "stories" | "applications";

function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [tab, setTab] = useState<Tab>("stats");

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate({ to: "/login" }); return; }
      // Real, server-enforced admin check — replaces the old email === ADMIN_EMAIL
      // comparison, which could be spoofed since it only ran in the browser.
      const { data: adminRow } = await (supabase as any).from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
      if (!adminRow) { navigate({ to: "/login" }); return; }
      setAuthorized(true);
      setLoading(false);
    }
    check();
  }, [navigate]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-muted-foreground text-sm">Checking access...</div>
    </div>
  );
  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-ember mb-1">Admin</div>
            <h1 className="font-display text-3xl">NinetyMinds Dashboard</h1>
          </div>
          <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to dashboard</Link>
        </div>

        <div className="flex gap-1 bg-sand rounded-xl p-1 mb-8 w-fit overflow-x-auto">
          {(["stats", "players", "scouts", "clubs", "verification", "stories", "applications"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors whitespace-nowrap ${tab === t ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === "stats" && <StatsTab />}
        {tab === "players" && <PlayersTab />}
        {tab === "scouts" && <ScoutsTab />}
        {tab === "clubs" && <ClubsTab />}
        {tab === "verification" && <VerificationTab />}
        {tab === "stories" && <StoriesTab />}
        {tab === "applications" && <ApplicationsTab />}
      </div>
    </div>
  );
}

function StatsTab() {
  const [stats, setStats] = useState({ players: 0, scouts: 0, clubs: 0, stories: 0, verified: 0, applications: 0, messages: 0, pendingVerification: 0 });

  useEffect(() => {
    async function load() {
      const [{ count: players }, { count: scouts }, { count: clubs }, { count: stories }, { count: verified }, { count: applications }, { count: messages }, { count: pendingVerification }] = await Promise.all([
        (supabase as any).from("players").select("*", { count: "exact", head: true }),
        (supabase as any).from("scouts").select("*", { count: "exact", head: true }),
        (supabase as any).from("clubs").select("*", { count: "exact", head: true }),
        (supabase as any).from("stories").select("*", { count: "exact", head: true }),
        (supabase as any).from("players").select("*", { count: "exact", head: true }).not("img_url", "is", null),
        (supabase as any).from("applications").select("*", { count: "exact", head: true }),
        (supabase as any).from("messages").select("*", { count: "exact", head: true }),
        (supabase as any).from("scouts").select("*", { count: "exact", head: true }).eq("verification_status", "pending"),
      ]);
      const { count: pendingClubVerification } = await (supabase as any).from("clubs").select("*", { count: "exact", head: true }).eq("verification_status", "pending");
      setStats({
        players: players ?? 0, scouts: scouts ?? 0, clubs: clubs ?? 0, stories: stories ?? 0,
        verified: verified ?? 0, applications: applications ?? 0, messages: messages ?? 0,
        pendingVerification: (pendingVerification ?? 0) + (pendingClubVerification ?? 0),
      });
    }
    load();
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: "Total Players", value: stats.players, color: "text-pitch" },
        { label: "Total Scouts", value: stats.scouts, color: "text-ember" },
        { label: "Total Clubs", value: stats.clubs, color: "text-ember" },
        { label: "Pending Verifications", value: stats.pendingVerification, color: stats.pendingVerification > 0 ? "text-destructive" : "text-muted-foreground" },
        { label: "Stories Published", value: stats.stories, color: "text-pitch" },
        { label: "Players with Photos", value: stats.verified, color: "text-green-600" },
        { label: "Trial Applications", value: stats.applications, color: "text-ember" },
        { label: "Scout Messages", value: stats.messages, color: "text-pitch" },
      ].map((s) => (
        <div key={s.label} className="bg-card border border-border rounded-2xl p-6">
          <div className={`font-display text-5xl ${s.color}`}>{s.value}</div>
          <div className="text-sm text-muted-foreground mt-2">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function PlayersTab() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editRating, setEditRating] = useState("");
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await (supabase as any).from("players").select("*").order("created_at", { ascending: false });
      setPlayers(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function saveRating(id: number) {
    setSaving(true);
    await (supabase as any).from("players").update({ rating: parseInt(editRating) }).eq("id", id);
    setPlayers((prev) => prev.map((p) => p.id === id ? { ...p, rating: parseInt(editRating) } : p));
    setEditingId(null);
    setSaving(false);
  }

  async function deletePlayer(id: number) {
    if (!confirm("Delete this player profile? This cannot be undone.")) return;
    await (supabase as any).from("players").delete().eq("id", id);
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  }

  if (loading) return <div className="text-sm text-muted-foreground">Loading players...</div>;

  const unrated = players.filter((p) => !p.rating || p.rating === 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-sm text-muted-foreground">{players.length} players registered</div>
        {unrated.length > 0 && (
          <div className="text-xs font-medium bg-ember/10 text-ember px-2.5 py-1 rounded-full">
            {unrated.length} unrated
          </div>
        )}
      </div>
      {players.map((p) => {
        const isNew = !p.rating || p.rating === 0;
        const isExpanded = expandedId === p.id;
        return (
          <div key={p.id} className={`bg-card border rounded-2xl overflow-hidden transition-all ${isNew ? "border-ember/40" : "border-border"}`}>
            <div className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sand border border-border overflow-hidden shrink-0">
                {p.img_url
                  ? <img src={p.img_url} alt={p.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No img</div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-medium">{p.name}</div>
                  {isNew && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-ember text-cream px-2 py-0.5 rounded-full">New</span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">{p.pos} · {p.city} · {p.club}</div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {editingId === p.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={editRating}
                      onChange={(e) => setEditRating(e.target.value)}
                      min="1" max="99"
                      className="w-16 px-2 py-1 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-pitch"
                    />
                    <button onClick={() => saveRating(p.id)} disabled={saving} className="text-xs font-medium text-pitch hover:underline">{saving ? "..." : "Save"}</button>
                    <button onClick={() => setEditingId(null)} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditingId(p.id); setEditRating(String(p.rating ?? "")); }}
                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full hover:opacity-80 transition ${isNew ? "bg-ember/10 text-ember" : "bg-pitch/10 text-pitch"}`}
                  >
                    {isNew ? "Rate player" : `Rating: ${p.rating}`}
                  </button>
                )}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : p.id)}
                  className="text-xs text-muted-foreground hover:text-pitch transition"
                >
                  {isExpanded ? "Collapse" : "Details"}
                </button>
                <Link to="/players/$playerId" params={{ playerId: p.slug }} className="text-xs text-muted-foreground hover:text-pitch transition">View</Link>
                <button onClick={() => deletePlayer(p.id)} className="text-xs text-destructive hover:underline">Delete</button>
              </div>
            </div>

            {isExpanded && (
              <div className="border-t border-border px-5 py-4 bg-sand/40">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  {(p.stats as { label: string; value: string }[] ?? []).map((s: any) => (
                    <div key={s.label} className="text-center bg-card rounded-xl p-3 border border-border">
                      <div className="font-display text-2xl">{s.value}</div>
                      <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{s.label}</div>
                    </div>
                  ))}
                  <div className="text-center bg-card rounded-xl p-3 border border-border">
                    <div className="font-display text-2xl">{p.age}</div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Age</div>
                  </div>
                  <div className="text-center bg-card rounded-xl p-3 border border-border">
                    <div className="font-display text-2xl">#{p.number}</div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Jersey</div>
                  </div>
                </div>
                {p.bio && (
                  <p className="text-sm text-muted-foreground mb-3">{p.bio}</p>
                )}
                {(p.video_urls ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(p.video_urls as string[]).map((url: string, i: number) => (
                      <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-pitch hover:underline">
                        Video {i + 1} →
                      </a>
                    ))}
                  </div>
                )}
                {(p.highlights ?? []).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(p.highlights as string[]).map((h: string) => (
                      <span key={h} className="text-xs bg-card border border-border px-2 py-1 rounded-full">{h}</span>
                    ))}
                  </div>
                )}
                <div className="text-xs text-muted-foreground mt-3">
                  Joined {new Date(p.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ScoutsTab() {
  const [scouts, setScouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await (supabase as any).from("scouts").select("*").order("created_at", { ascending: false });
      setScouts(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function deleteScout(id: number) {
    if (!confirm("Delete this scout account?")) return;
    await (supabase as any).from("scouts").delete().eq("id", id);
    setScouts((prev) => prev.filter((s) => s.id !== id));
  }

  if (loading) return <div className="text-sm text-muted-foreground">Loading scouts...</div>;

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground mb-4">{scouts.length} scouts registered</div>
      {scouts.map((s) => (
        <div key={s.id} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-ember/10 text-ember flex items-center justify-center font-display text-lg shrink-0">{s.name.charAt(0)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="font-medium">{s.name}</div>
              {s.verified && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-pitch text-cream">✓ Verified</span>}
            </div>
            <div className="text-sm text-muted-foreground">{s.role} · {s.organisation}</div>
          </div>
          <button onClick={() => deleteScout(s.id)} className="text-xs text-destructive hover:underline shrink-0">Delete</button>
        </div>
      ))}
      {scouts.length === 0 && <div className="text-sm text-muted-foreground">No scouts registered yet.</div>}
    </div>
  );
}

function ClubsTab() {
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await (supabase as any).from("clubs").select("*").order("created_at", { ascending: false });
      setClubs(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function deleteClub(id: number) {
    if (!confirm("Delete this club account? This also clears it from any players' verified roster.")) return;
    await (supabase as any).from("clubs").delete().eq("id", id);
    setClubs((prev) => prev.filter((c) => c.id !== id));
  }

  if (loading) return <div className="text-sm text-muted-foreground">Loading clubs...</div>;

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground mb-4">{clubs.length} clubs registered</div>
      {clubs.map((c) => (
        <div key={c.id} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-pitch/10 text-pitch flex items-center justify-center font-display text-lg shrink-0">{c.name.charAt(0)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="font-medium">{c.name}</div>
              {c.verified && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-pitch text-cream">✓ Verified</span>}
            </div>
            <div className="text-sm text-muted-foreground">{c.location}</div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/clubs/$clubId" params={{ clubId: c.slug }} className="text-xs text-muted-foreground hover:text-pitch transition">View</Link>
            <button onClick={() => deleteClub(c.id)} className="text-xs text-destructive hover:underline">Delete</button>
          </div>
        </div>
      ))}
      {clubs.length === 0 && <div className="text-sm text-muted-foreground">No clubs registered yet.</div>}
    </div>
  );
}

function VerificationTab() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectingKey, setRejectingKey] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [updating, setUpdating] = useState<Record<string, boolean>>({});

  async function load() {
    const [{ data: scouts }, { data: clubs }] = await Promise.all([
      (supabase as any).from("scouts")
        .select("id,user_id,name,organisation,role,verification_status,verification_document_url,verification_notes,verification_submitted_at")
        .neq("verification_status", "unverified"),
      (supabase as any).from("clubs")
        .select("id,user_id,name,location,slug,verification_status,verification_document_url,verification_notes,verification_submitted_at")
        .neq("verification_status", "unverified"),
    ]);

    const combined = [
      ...(scouts ?? []).map((s: any) => ({ ...s, type: "scout" as const, subtitle: `${s.role} · ${s.organisation}` })),
      ...(clubs ?? []).map((c: any) => ({ ...c, type: "club" as const, subtitle: c.location })),
    ].sort((a, b) => {
      if (a.verification_status === "pending" && b.verification_status !== "pending") return -1;
      if (b.verification_status === "pending" && a.verification_status !== "pending") return 1;
      return new Date(b.verification_submitted_at ?? 0).getTime() - new Date(a.verification_submitted_at ?? 0).getTime();
    });

    setItems(combined);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function viewDocument(item: any) {
    if (!item.verification_document_url) return;
    const { data, error } = await supabase.storage.from("verification-docs").createSignedUrl(item.verification_document_url, 300);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
    else alert("Couldn't load document.");
  }

  async function approve(item: any) {
    const key = `${item.type}-${item.id}`;
    setUpdating((u) => ({ ...u, [key]: true }));
    const table = item.type === "scout" ? "scouts" : "clubs";
    await (supabase as any).from(table).update({ verification_status: "verified", verification_notes: null }).eq("id", item.id);
    setItems((prev) => prev.map((i) => (i.type === item.type && i.id === item.id) ? { ...i, verification_status: "verified", verification_notes: null } : i));
    sendVerificationEmail({ data: { userId: item.user_id, name: item.name, accountType: item.type, status: "verified" } })
      .catch((err: any) => console.error("Verification email failed to send:", err));
    setUpdating((u) => ({ ...u, [key]: false }));
  }

  async function reject(item: any) {
    if (!rejectNote.trim()) return;
    const key = `${item.type}-${item.id}`;
    setUpdating((u) => ({ ...u, [key]: true }));
    const table = item.type === "scout" ? "scouts" : "clubs";
    const reason = rejectNote.trim();
    await (supabase as any).from(table).update({ verification_status: "rejected", verification_notes: reason }).eq("id", item.id);
    setItems((prev) => prev.map((i) => (i.type === item.type && i.id === item.id) ? { ...i, verification_status: "rejected", verification_notes: reason } : i));
    sendVerificationEmail({ data: { userId: item.user_id, name: item.name, accountType: item.type, status: "rejected", reason } })
      .catch((err: any) => console.error("Verification email failed to send:", err));
    setRejectingKey(null);
    setRejectNote("");
    setUpdating((u) => ({ ...u, [key]: false }));
  }

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700",
    verified: "bg-green-50 text-green-700",
    rejected: "bg-red-50 text-red-700",
  };

  if (loading) return <div className="text-sm text-muted-foreground">Loading verification queue...</div>;

  const pendingCount = items.filter((i) => i.verification_status === "pending").length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-sm text-muted-foreground">{items.length} submissions</div>
        {pendingCount > 0 && <div className="text-xs font-medium bg-ember/10 text-ember px-2.5 py-1 rounded-full">{pendingCount} pending review</div>}
      </div>

      {items.map((item) => {
        const key = `${item.type}-${item.id}`;
        return (
          <div key={key} className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-pitch/10 text-pitch flex items-center justify-center font-display text-lg shrink-0">{item.name.charAt(0)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-medium">{item.name}</div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-sand px-2 py-0.5 rounded-full">{item.type}</span>
                </div>
                <div className="text-sm text-muted-foreground">{item.subtitle}</div>
                {item.verification_submitted_at && (
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Submitted {new Date(item.verification_submitted_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColor[item.verification_status] ?? "bg-sand text-muted-foreground"}`}>{item.verification_status}</span>
                {item.verification_document_url && (
                  <button onClick={() => viewDocument(item)} className="text-xs font-medium text-pitch hover:underline">View doc</button>
                )}
                {item.verification_status === "pending" && (
                  <>
                    <button onClick={() => approve(item)} disabled={updating[key]} className="text-xs font-medium text-pitch hover:underline disabled:opacity-60">Approve</button>
                    <button onClick={() => setRejectingKey(rejectingKey === key ? null : key)} className="text-xs font-medium text-destructive hover:underline">Reject</button>
                  </>
                )}
              </div>
            </div>

            {item.verification_status === "rejected" && item.verification_notes && (
              <div className="mt-3 text-xs text-muted-foreground bg-sand/50 rounded-lg px-3 py-2">Reason given: {item.verification_notes}</div>
            )}

            {rejectingKey === key && (
              <div className="mt-3 flex gap-2">
                <input
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  placeholder="Reason for rejection (shown to them)"
                  className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch"
                />
                <button onClick={() => reject(item)} disabled={updating[key] || !rejectNote.trim()} className="px-4 py-2 rounded-xl bg-destructive text-cream text-sm font-medium disabled:opacity-60">Confirm</button>
              </div>
            )}
          </div>
        );
      })}
      {items.length === 0 && <div className="text-sm text-muted-foreground">No verification submissions yet.</div>}
    </div>
  );
}

function StoriesTab() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emptyForm = { slug: "", title: "", excerpt: "", tag: "", read_time: "", author_name: "", author_role: "", published_at: "", content: "", quote_text: "", quote_attr: "" };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { loadStories(); }, []);

  async function loadStories() {
    const { data } = await (supabase as any).from("stories").select("*").order("published_at", { ascending: false });
    setStories(data ?? []);
    setLoading(false);
  }

  function setField(field: string, value: string) { setForm((f) => ({ ...f, [field]: value })); setError(null); }
  function slugify(title: string) { return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

  async function saveStory() {
    if (!form.title || !form.excerpt || !form.tag || !form.author_name || !form.content) return setError("Please fill in all required fields.");
    setSaving(true);
    const { error: insertError } = await (supabase as any).from("stories").insert({
      slug: form.slug || slugify(form.title),
      title: form.title, excerpt: form.excerpt, tag: form.tag,
      read_time: form.read_time || "5 min", author_name: form.author_name,
      author_role: form.author_role,
      published_at: form.published_at || new Date().toISOString().split("T")[0],
      content: form.content.split("\n\n").filter(Boolean),
      quote_text: form.quote_text || null, quote_attr: form.quote_attr || null, img_url: null,
    });
    if (insertError) setError(insertError.message);
    else { setForm(emptyForm); setShowForm(false); loadStories(); }
    setSaving(false);
  }

  async function deleteStory(id: number) {
    if (!confirm("Delete this story?")) return;
    await (supabase as any).from("stories").delete().eq("id", id);
    setStories((prev) => prev.filter((s) => s.id !== id));
  }

  if (loading) return <div className="text-sm text-muted-foreground">Loading stories...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{stories.length} stories published</div>
        <button onClick={() => setShowForm((v) => !v)} className="px-4 py-2 rounded-xl bg-ink text-cream text-sm font-medium hover:bg-pitch transition-colors">{showForm ? "Cancel" : "+ New story"}</button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h3 className="font-display text-xl">New Story</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2"><label className="block text-xs font-medium mb-1">Title *</label><input value={form.title} onChange={(e) => setField("title", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch" /></div>
            <div className="sm:col-span-2"><label className="block text-xs font-medium mb-1">Excerpt *</label><textarea value={form.excerpt} onChange={(e) => setField("excerpt", e.target.value)} rows={2} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch resize-none" /></div>
            <div><label className="block text-xs font-medium mb-1">Tag *</label><select value={form.tag} onChange={(e) => setField("tag", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch"><option value="">Select tag</option>{["Discovery","Wellness","Community","Scouting"].map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
            <div><label className="block text-xs font-medium mb-1">Read time</label><input value={form.read_time} onChange={(e) => setField("read_time", e.target.value)} placeholder="5 min" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch" /></div>
            <div><label className="block text-xs font-medium mb-1">Author name *</label><input value={form.author_name} onChange={(e) => setField("author_name", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch" /></div>
            <div><label className="block text-xs font-medium mb-1">Author role</label><input value={form.author_role} onChange={(e) => setField("author_role", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch" /></div>
            <div><label className="block text-xs font-medium mb-1">Published date</label><input type="date" value={form.published_at} onChange={(e) => setField("published_at", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch" /></div>
            <div><label className="block text-xs font-medium mb-1">Slug</label><input value={form.slug} onChange={(e) => setField("slug", e.target.value)} placeholder="auto-generated" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch" /></div>
            <div className="sm:col-span-2"><label className="block text-xs font-medium mb-1">Content * <span className="font-normal text-muted-foreground">(blank line between paragraphs)</span></label><textarea value={form.content} onChange={(e) => setField("content", e.target.value)} rows={10} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch resize-none font-mono" /></div>
            <div><label className="block text-xs font-medium mb-1">Pull quote</label><input value={form.quote_text} onChange={(e) => setField("quote_text", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch" /></div>
            <div><label className="block text-xs font-medium mb-1">Quote attribution</label><input value={form.quote_attr} onChange={(e) => setField("quote_attr", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch" /></div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button onClick={saveStory} disabled={saving} className="px-6 py-3 rounded-xl bg-pitch text-cream text-sm font-medium hover:bg-ink transition-colors disabled:opacity-60">{saving ? "Publishing..." : "Publish story"}</button>
        </div>
      )}

      {stories.map((s) => (
        <div key={s.id} className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1"><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-sand">{s.tag}</span><span className="text-xs text-muted-foreground">{s.read_time} · {s.published_at}</span></div>
            <div className="font-medium">{s.title}</div>
            <div className="text-sm text-muted-foreground mt-0.5">{s.author_name}</div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/stories/$storyId" params={{ storyId: s.slug }} className="text-xs text-muted-foreground hover:text-pitch transition">View</Link>
            <button onClick={() => deleteStory(s.id)} className="text-xs text-destructive hover:underline">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ApplicationsTab() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await (supabase as any).from("applications").select("*").order("created_at", { ascending: false });
      setApplications(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function updateStatus(id: number, status: string) {
    await (supabase as any).from("applications").update({ status }).eq("id", id);
    setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
  }

  async function deleteApplication(id: number) {
    if (!confirm("Delete this application?")) return;
    await (supabase as any).from("applications").delete().eq("id", id);
    setApplications((prev) => prev.filter((a) => a.id !== id));
  }

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700",
    accepted: "bg-green-50 text-green-700",
    rejected: "bg-red-50 text-red-700",
  };

  if (loading) return <div className="text-sm text-muted-foreground">Loading applications...</div>;

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground mb-4">{applications.length} trial applications</div>
      {applications.map((a) => (
        <div key={a.id} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="font-medium">{a.player_name}</div>
            <div className="text-sm text-muted-foreground">Applied to: {a.club_name}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{new Date(a.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={a.status}
              onChange={(e) => updateStatus(a.id, e.target.value)}
              className={`text-xs font-medium px-2.5 py-1.5 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-pitch ${statusColor[a.status] ?? "bg-sand text-muted-foreground"}`}
            >
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            <button onClick={() => deleteApplication(a.id)} className="text-xs text-destructive hover:underline">Delete</button>
          </div>
        </div>
      ))}
      {applications.length === 0 && <div className="text-sm text-muted-foreground">No applications yet.</div>}
    </div>
  );
}