import { z } from "zod";

// Strips HTML tags (including script tags and their contents) and control
// characters from free-text fields. Never run this on passwords — passwords
// must be accepted byte-for-byte, exactly as typed.
export function sanitizeText(input: string): string {
  return input
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/[\x00-\x1F\x7F]/g, "")
    .trim()
    .slice(0, 500);
}

export function slugify(name: string): string {
  const base = sanitizeText(name)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

// Generic "invalid" messages everywhere on purpose — these are read by the
// server-side validator, never shown to the user directly. The client only
// ever sees one fixed, generic message regardless of which field failed.
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(5, "invalid")
  .max(254, "invalid")
  .email("invalid");

export const passwordSchema = z
  .string()
  .min(8, "invalid")
  .max(128, "invalid");

export const nameSchema = z
  .string()
  .min(2, "invalid")
  .max(100, "invalid")
  .transform(sanitizeText)
  .refine((v) => v.length >= 2, "invalid");

export function shortTextSchema(max = 200) {
  return z.string().max(max, "invalid").transform(sanitizeText);
}

export function optionalTextSchema(max = 500) {
  return z.string().max(max, "invalid").transform(sanitizeText).optional().or(z.literal(""));
}

export const loginSchema = z.object({
  email: emailSchema,
  // Deliberately not enforcing min-8 here — a user's existing real password
  // might be shorter than today's minimum. We only bound the max length
  // (defends against absurdly long input) and let Supabase's own check
  // decide if the password itself is correct.
  password: z.string().min(1, "invalid").max(128, "invalid"),
});

export const scoutSignupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  organisation: nameSchema,
  role: shortTextSchema(50),
});

export const clubSignupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  location: nameSchema,
  description: optionalTextSchema(1000),
});

// Best-effort schema based on the fields used elsewhere in the dashboard
// (EditProfileSection). Update this once you share register/athlete.tsx so
// the field list matches exactly.
export const athleteSignupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  pos: shortTextSchema(50),
  city: shortTextSchema(100),
  club: shortTextSchema(100),
  age: z.coerce.number().int().min(10, "invalid").max(45, "invalid"),
  number: z.coerce.number().int().min(0, "invalid").max(99, "invalid"),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
});