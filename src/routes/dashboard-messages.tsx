import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";

export const Route = createFileRoute("/dashboard-messages")({
  head: () => ({
    meta: [{ title: "Messages — NinetyMinds" }],
  }),
  component: MessagesPage,
});

function MessagesPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [threads, setThreads] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [sending, setSending] = useState<Record<string, boolean>>({});
  const [replyError, setReplyError] = useState<Record<string, string>>({});
  const [activeThread, setActiveThread] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate({ to: "/login" }); return; }

      const { data: playerData } = await (supabase as any)
        .from("players").select("slug,name,club").eq("user_id", user.id).single();

      if (playerData) {
        setProfile({ type: "athlete", userId: user.id, ...playerData });
        const { data } = await (supabase as any)
          .from("messages").select("*")
          .eq("to_player_slug", playerData.slug)
          .order("created_at", { ascending: true });
        groupThreads(data ?? [], "athlete");
        setLoading(false);
        return;
      }

      const { data: scoutData } = await (supabase as any)
        .from("scouts").select("name,organisation,verification_status").eq("user_id", user.id).single();
      if (scoutData) {
        setProfile({ type: "scout", userId: user.id, ...scoutData });
        const { data } = await (supabase as any)
          .from("messages").select("*")
          .eq("scout_user_id", user.id)
          .order("created_at", { ascending: true });
        groupThreads(data ?? [], "scout");
        setLoading(false);
        return;
      }

      const { data: clubData } = await (supabase as any)
        .from("clubs").select("name,location,slug,verification_status").eq("user_id", user.id).single();
      if (clubData) {
        setProfile({ type: "club", userId: user.id, ...clubData });
        const { data } = await (supabase as any)
          .from("messages").select("*")
          .eq("club_user_id", user.id)
          .order("created_at", { ascending: true });
        groupThreads(data ?? [], "club");
      }
      setLoading(false);
    }
    load();
  }, [navigate]);

  function groupThreads(msgs: any[], viewAs: "athlete" | "scout" | "club") {
    const grouped: Record<string, any[]> = {};
    msgs.forEach((m: any) => {
      // Athletes: thread key = whichever counterparty sent the first message
      //   (scout_user_id or club_user_id), since a player can talk to both.
      // Scouts / clubs: thread key = the player they're talking to.
      const key = viewAs === "scout" || viewAs === "club"
        ? m.to_player_slug
        : (m.scout_user_id ?? m.club_user_id ?? `legacy-${m.id}`);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(m);
    });
    setThreads(grouped);
    const keys = Object.keys(grouped);
    if (keys.length > 0) setActiveThread(keys[0]);
  }

  async function sendReply(threadKey: string) {
    const text = (replyText[threadKey] ?? "").trim();
    if (!text || !profile) return;
    setSending((s) => ({ ...s, [threadKey]: true }));
    setReplyError((e) => ({ ...e, [threadKey]: "" }));

    const msgs = threads[threadKey];
    const first = msgs[0];
    const subject = first.subject?.startsWith("Re: ") ? first.subject : `Re: ${first.subject}`;

    let insertPayload: any;
    if (profile.type === "athlete") {
      // Reply into whichever side (scout or club) this thread belongs to.
      const isClubThread = !!first.club_user_id;
      insertPayload = {
        from_user_id: profile.userId,
        scout_user_id: isClubThread ? null : threadKey,
        club_user_id: isClubThread ? threadKey : null,
        to_player_slug: profile.slug,
        from_name: profile.name,
        from_org: profile.club,
        subject,
        body: text,
        sender_type: "player",
      };
    } else if (profile.type === "scout") {
      insertPayload = {
        from_user_id: profile.userId,
        scout_user_id: profile.userId,
        to_player_slug: threadKey,
        from_name: profile.name,
        from_org: profile.organisation,
        subject,
        body: text,
        sender_type: "scout",
      };
    } else {
      insertPayload = {
        from_user_id: profile.userId,
        club_user_id: profile.userId,
        to_player_slug: threadKey,
        from_name: profile.name,
        from_org: profile.location,
        subject,
        body: text,
        sender_type: "club",
      };
    }

    const { data: inserted, error } = await (supabase as any)
      .from("messages").insert(insertPayload).select().single();

    if (error || !inserted) {
      setReplyError((e) => ({ ...e, [threadKey]: "Failed to send. Please try again." }));
    } else {
      setThreads((prev) => ({ ...prev, [threadKey]: [...(prev[threadKey] ?? []), inserted] }));
      setReplyText((r) => ({ ...r, [threadKey]: "" }));
    }
    setSending((s) => ({ ...s, [threadKey]: false }));
  }

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-muted-foreground text-sm">Loading...</div>
    </div>
  );

  const threadKeys = Object.keys(threads);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 lg:py-20">

        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
            ← Dashboard
          </Link>
        </div>
        <div className="text-xs uppercase tracking-[0.2em] text-ember mb-2">Inbox</div>
        <h1 className="font-display text-3xl mb-8">Messages</h1>

        {threadKeys.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-sand flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <p className="text-muted-foreground text-sm">No messages yet.</p>
            {(profile?.type === "scout" || profile?.type === "club") && (
              <Link to="/featured-players" className="mt-3 inline-block text-sm text-pitch hover:underline">Browse players to get started →</Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6 h-[600px]">

            <div className="col-span-4 border border-border rounded-2xl overflow-hidden flex flex-col">
              <div className="p-4 border-b border-border">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{threadKeys.length} conversation{threadKeys.length !== 1 ? "s" : ""}</div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {threadKeys.map((key) => {
                  const msgs = threads[key];
                  const last = msgs[msgs.length - 1];
                  const unread = msgs.some((m) => !m.read && m.sender_type !== profile?.type);

                  const isScoutOrClub = profile?.type === "scout" || profile?.type === "club";
                  const label = isScoutOrClub
                    ? key.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
                    : (msgs[0]?.from_name ?? "Unknown");
                  const sublabel = isScoutOrClub
                    ? msgs[0]?.subject
                    : (msgs[0]?.from_org ?? "");

                  return (
                    <button
                      key={key}
                      onClick={() => setActiveThread(key)}
                      className={`w-full text-left px-4 py-4 border-b border-border hover:bg-sand transition-colors ${activeThread === key ? "bg-sand" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-pitch text-cream grid place-items-center font-display text-sm shrink-0">
                          {label.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className={`text-sm truncate ${unread ? "font-semibold" : "font-medium"}`}>{label}</div>
                            {unread && <div className="w-2 h-2 rounded-full bg-ember shrink-0" />}
                          </div>
                          <div className="text-xs text-muted-foreground truncate mt-0.5">{sublabel}</div>
                          <div className="text-xs text-muted-foreground truncate mt-1 opacity-70">{last.body}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="col-span-8 border border-border rounded-2xl flex flex-col overflow-hidden">
              {activeThread && threads[activeThread] ? (() => {
                const msgs = threads[activeThread];
                const first = msgs[0];
                const isLegacy = activeThread.startsWith("legacy-");
                const isScoutOrClub = profile?.type === "scout" || profile?.type === "club";
                const threadLabel = isScoutOrClub
                  ? activeThread.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
                  : (first?.from_name ?? "Unknown");

                return (
                  <>
                    <div className="px-6 py-4 border-b border-border shrink-0">
                      <div className="font-medium">{threadLabel}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{first?.subject}</div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                      {msgs.map((m) => {
                        const isOwn = m.sender_type === profile?.type;
                        return (
                          <div key={m.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[75%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
                              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isOwn ? "bg-ink text-cream rounded-br-sm" : "bg-sand border border-border rounded-bl-sm"}`}>
                                {m.body}
                              </div>
                              <div className="text-[10px] text-muted-foreground px-1">
                                {isOwn ? "You" : m.from_name} · {new Date(m.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="px-6 py-4 border-t border-border shrink-0">
                      {isLegacy ? (
                        <p className="text-xs text-muted-foreground text-center py-2">
                          This message was sent before replies were supported.
                        </p>
                      ) : (profile?.type === "scout" || profile?.type === "club") && profile.verification_status !== "verified" ? (
                        <p className="text-xs text-muted-foreground text-center py-2">
                          Your account needs to be verified before you can send messages.{" "}
                          <Link to="/dashboard" className="text-pitch hover:underline">
                            {profile.verification_status === "pending" ? "Check status →" : "Verify now →"}
                          </Link>
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {replyError[activeThread] && <p className="text-xs text-destructive">{replyError[activeThread]}</p>}
                          <div className="flex gap-2">
                            <input
                              value={replyText[activeThread] ?? ""}
                              onChange={(e) => setReplyText((r) => ({ ...r, [activeThread]: e.target.value }))}
                              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendReply(activeThread)}
                              placeholder="Type a reply..."
                              className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-pitch"
                            />
                            <button
                              onClick={() => sendReply(activeThread)}
                              disabled={sending[activeThread] || !(replyText[activeThread] ?? "").trim()}
                              className="px-5 py-2.5 rounded-xl bg-ink text-cream text-sm font-medium hover:bg-pitch transition-colors disabled:opacity-60"
                            >
                              {sending[activeThread] ? "..." : "Send"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                );
              })() : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                  Select a conversation
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}