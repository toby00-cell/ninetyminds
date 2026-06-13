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
  const [messages, setMessages] = useState<any[]>([]);

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
        // Load messages
        const { data: msgs } = await (supabase as any)
          .from("messages").select("*").eq("to_player_slug", playerData.slug).order("created_at", { ascending: false });
        setMessages(msgs ?? []);
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
    setSaveError(null);
    const { error } = await (supabase as any)
      .from("players").update({ bio: bioValue }).eq("user_id", user.id);
    if (error) { setSaveError("Failed to save bio."); }
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
      const imgUrl = urlData.publicUrl;
      const { error: updateError } = await (supabase as any).from("players").update({ img_url: imgUrl }).eq("user_id", user.id);
      if (updateError) throw new Error(updateError.message);
      setProfile((p: any) => ({ ...p, img_url: imgUrl }));
    } catch (err: any) { setSaveError(err.message ?? "Photo upload failed."); }
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
    if (!user) return;
    const updated = (profile.video_urls ?? []).filter((v: string) => v !== url);
    await (supabase as any).from("players").update({ video_urls: updated }).eq("user_id", user.id);
    setProfile((p: any) => ({ ...p, video_urls: updated }));
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading your profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 lg:py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-ember mb-1">Dashboard</div>
            <h1 className="font-display text-3xl">Welcome{profile?.name ? `, ${profile.name.split(" ")[0]}` : ""}.</h1>
          </div>
          <div className="flex items-center gap-4">
            {user?.email === ADMIN_EMAIL && (
              <Link to="/dashboard/admin" className="text-sm font-medium text-ember hover:underline">Admin →</Link>
            )}
            <button onClick={handleSignOut} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign out</button>
          </div>
        </div>

        {saveError && <div className="mb-6 bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-xl">{saveError}</div>}

        {profile?.type === "athlete" && (
          <div className="space-y-6">
            {/* Profile card */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
              <div className="flex items-start gap-6">
                <div className="relative shrink-0">
                  <div className="w-24 h-24 rounded-xl bg-sand border border-border overflow-hidden">
                    {profile.img_url
                      ? <img src={profile.img_url} alt={profile.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs text-center px-2">No photo</div>
                    }
                  </div>
                  <label className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-ink text-cream flex items-center justify-center cursor-pointer hover:bg-pitch transition-colors ${uploadingPhoto ? "opacity-50 cursor-not-allowed" : ""}`}>
                    {uploadingPhoto
                      ? <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                      : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    }
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

            {/* Bio */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
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
              ) : (
                <p className="text-muted-foreground">{profile.bio || "No bio yet. Click Edit to add one."}</p>
              )}
            </div>

            {/* Video highlights */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
              <div className="text-xs uppercase tracking-[0.2em] text-ember mb-3">Video Highlights</div>
              <p className="text-sm text-muted-foreground mb-4">Add YouTube or other video links so scouts can watch you play.</p>
              <div className="flex gap-2 mb-4">
                <input
                  type="url"
                  value={newVideo}
                  onChange={(e) => setNewVideo(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch"
                />
                <button onClick={addVideoUrl} disabled={savingVideo || !newVideo.trim()} className="px-4 py-2.5 rounded-xl bg-ink text-cream text-sm font-medium hover:bg-pitch transition-colors disabled:opacity-60">
                  {savingVideo ? "..." : "Add"}
                </button>
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
              ) : (
                <p className="text-sm text-muted-foreground">No videos added yet.</p>
              )}
            </div>

            {/* Messages */}
            {messages.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
                <div className="text-xs uppercase tracking-[0.2em] text-ember mb-4">Messages from Scouts</div>
                <div className="space-y-4">
                  {messages.map((m) => (
                    <div key={m.id} className="border border-border rounded-xl p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="font-medium text-sm">{m.from_name}</div>
                          <div className="text-xs text-muted-foreground">{m.from_org}</div>
                        </div>
                        <div className="text-xs text-muted-foreground shrink-0">{new Date(m.created_at).toLocaleDateString("en-NG")}</div>
                      </div>
                      <div className="text-sm font-medium mb-1">{m.subject}</div>
                      <p className="text-sm text-muted-foreground">{m.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Link to="/players/$playerId" params={{ playerId: profile.slug }} className="inline-flex items-center gap-2 text-sm font-medium text-pitch hover:underline">
              View your public profile →
            </Link>
          </div>
        )}

        {profile?.type === "scout" && (
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="font-display text-2xl mb-1">{profile.name}</h2>
            <div className="text-sm text-muted-foreground mb-6">{profile.role} · {profile.organisation}</div>
            <Link to="/featured-players" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-ink text-cream text-sm font-medium hover:bg-pitch transition-colors">Browse players →</Link>
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