import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getSupabase } from "../supabase.server";
import type { PlayerRow } from "../database.types";

// ─── getPlayers ───────────────────────────────────────────────────────────────
// Returns all players ordered by rating descending.
// Usage: const players = await getPlayers()
export const getPlayers = createServerFn({ method: "GET" }).handler(
  async (): Promise<PlayerRow[]> => {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("players")
      .select("*")
      .order("rating", { ascending: false });

    if (error) throw new Error(`Failed to fetch players: ${error.message}`);
    return data;
  },
);

// ─── getPlayerBySlug ──────────────────────────────────────────────────────────
// Returns a single player by slug, or null if not found.
// Usage: const player = await getPlayerBySlug({ data: { slug: "chidera-okonkwo" } })
export const getPlayerBySlug = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string().min(1) }))
  .handler(async ({ data }): Promise<PlayerRow | null> => {
    const supabase = getSupabase();

    const { data: player, error } = await supabase
      .from("players")
      .select("*")
      .eq("slug", data.slug)
      .single();

    if (error) {
      // PostgREST returns PGRST116 when no row matches — treat as not found
      if (error.code === "PGRST116") return null;
      throw new Error(`Failed to fetch player: ${error.message}`);
    }

    return player;
  });

// ─── getPlayersByCity ─────────────────────────────────────────────────────────
// Filter players by city — useful for the clubs / regional explore pages.
// Usage: const abuja = await getPlayersByCity({ data: { city: "Abuja" } })
export const getPlayersByCity = createServerFn({ method: "GET" })
  .inputValidator(z.object({ city: z.string().min(1) }))
  .handler(async ({ data }): Promise<PlayerRow[]> => {
    const supabase = getSupabase();

    const { data: players, error } = await supabase
      .from("players")
      .select("*")
      .ilike("city", data.city)
      .order("rating", { ascending: false });

    if (error) throw new Error(`Failed to fetch players by city: ${error.message}`);
    return players;
  });

// ─── getPlayersByPosition ─────────────────────────────────────────────────────
// Filter players by position.
// Usage: const forwards = await getPlayersByPosition({ data: { pos: "Forward" } })
export const getPlayersByPosition = createServerFn({ method: "GET" })
  .inputValidator(z.object({ pos: z.string().min(1) }))
  .handler(async ({ data }): Promise<PlayerRow[]> => {
    const supabase = getSupabase();

    const { data: players, error } = await supabase
      .from("players")
      .select("*")
      .ilike("pos", data.pos)
      .order("rating", { ascending: false });

    if (error) throw new Error(`Failed to fetch players by position: ${error.message}`);
    return players;
  });