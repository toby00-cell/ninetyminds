import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getSupabase } from "../supabase.server";
import type { StoryRow } from "../database.types";

// ─── getStories ───────────────────────────────────────────────────────────────
// Returns all stories ordered by published date descending.
// Usage: const stories = await getStories()
export const getStories = createServerFn({ method: "GET" }).handler(
  async (): Promise<StoryRow[]> => {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .order("published_at", { ascending: false });

    if (error) throw new Error(`Failed to fetch stories: ${error.message}`);
    return data;
  },
);

// ─── getStoryBySlug ───────────────────────────────────────────────────────────
// Returns a single story by slug, or null if not found.
// Usage: const story = await getStoryBySlug({ data: { slug: "surulere-to-premier" } })
export const getStoryBySlug = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string().min(1) }))
  .handler(async ({ data }): Promise<StoryRow | null> => {
    const supabase = getSupabase();

    const { data: story, error } = await supabase
      .from("stories")
      .select("*")
      .eq("slug", data.slug)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error(`Failed to fetch story: ${error.message}`);
    }

    return story;
  });

// ─── getStoriesByTag ──────────────────────────────────────────────────────────
// Filter stories by tag (e.g. "Wellness", "Discovery", "Community", "Scouting").
// Usage: const wellness = await getStoriesByTag({ data: { tag: "Wellness" } })
export const getStoriesByTag = createServerFn({ method: "GET" })
  .inputValidator(z.object({ tag: z.string().min(1) }))
  .handler(async ({ data }): Promise<StoryRow[]> => {
    const supabase = getSupabase();

    const { data: stories, error } = await supabase
      .from("stories")
      .select("*")
      .eq("tag", data.tag)
      .order("published_at", { ascending: false });

    if (error) throw new Error(`Failed to fetch stories by tag: ${error.message}`);
    return stories;
  });