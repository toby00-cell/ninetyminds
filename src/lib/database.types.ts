// Auto-generated types for NinetyMinds Supabase schema.
// Re-run `npx supabase gen types typescript --project-id <your-project-id>` to regenerate.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      players: {
        Row: {
          id: number;
          slug: string;
          name: string;
          pos: string;
          age: number;
          city: string;
          club: string;
          rating: number;
          number: number;
          img_url: string | null;
          bio: string;
          highlights: string[];
          stats: { label: string; value: string }[];
          user_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["players"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["players"]["Insert"]>;
      };
      stories: {
        Row: {
          id: number;
          slug: string;
          title: string;
          excerpt: string;
          tag: string;
          read_time: string;
          img_url: string | null;
          published_at: string;
          author_name: string;
          author_role: string;
          author_avatar: string | null;
          content: string[];
          quote_text: string | null;
          quote_attr: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["stories"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["stories"]["Insert"]>;
      };
      scouts: {
        Row: {
          id: number;
          user_id: string;
          name: string;
          organisation: string;
          role: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["scouts"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["scouts"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Convenience row types
export type PlayerRow = Database["public"]["Tables"]["players"]["Row"];
export type StoryRow = Database["public"]["Tables"]["stories"]["Row"];
export type ScoutRow = Database["public"]["Tables"]["scouts"]["Row"];