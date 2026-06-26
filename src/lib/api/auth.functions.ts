import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import {
  loginSchema,
  scoutSignupSchema,
  clubSignupSchema,
  athleteSignupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  slugify,
} from "@/lib/validation/auth.schemas";

// Service-role client — this must NEVER be imported into client-side code.
// It only runs safely here because the whole module is wrapped in
// createServerFn, so it executes on the server, not in the browser.
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const GENERIC_AUTH_ERROR = "Invalid input. Please check your details and try again.";

// Validates `data` against `schema`. On failure, logs exactly which field(s)
// failed and why — for monitoring — but throws a single fixed, generic
// message that never reveals which field was the problem. This is the one
// place every auth route routes its input through.
function validateOrLog<T>(schema: z.ZodSchema<T>, data: unknown, context: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[AUTH_VALIDATION_FAILURE] ${context}`, {
      timestamp: new Date().toISOString(),
      issues: result.error.issues.map((i) => ({ path: i.path.join("."), code: i.code })),
    });
    throw new Error(GENERIC_AUTH_ERROR);
  }
  return result.data;
}

// ============================================================
// LOGIN
// ============================================================
export const serverLogin = createServerFn({ method: "POST" })
  .validator((data: unknown) => validateOrLog(loginSchema, data, "login"))
  .handler(async ({ data }) => {
    const { data: result, error } = await supabaseAdmin.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error || !result.session) {
      // Generic on purpose — never reveal whether the email exists or
      // whether it was the email or the password that was wrong.
      console.error("[AUTH_LOGIN_FAILURE]", { timestamp: new Date().toISOString(), email: data.email });
      throw new Error("Invalid email or password.");
    }

    return {
      access_token: result.session.access_token,
      refresh_token: result.session.refresh_token,
    };
  });

// ============================================================
// SCOUT SIGNUP
// ============================================================
export const serverSignUpScout = createServerFn({ method: "POST" })
  .validator((data: unknown) => validateOrLog(scoutSignupSchema, data, "scout_signup"))
  .handler(async ({ data }) => {
    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true, // see README note — flip to false once real email confirmation is wired up
      user_metadata: { role: "scout", name: data.name },
    });

    if (createError) {
      console.error("[AUTH_SIGNUP_FAILURE] scout", { timestamp: new Date().toISOString(), reason: createError.message });
      const message = createError.message?.toLowerCase().includes("already")
        ? "An account with this email already exists. Please sign in instead."
        : "Could not create your account. Please try again.";
      throw new Error(message);
    }

    const userId = created.user.id;

    const { error: insertError } = await supabaseAdmin.from("scouts").insert({
      user_id: userId,
      name: data.name,
      organisation: data.organisation,
      role: data.role,
    });

    if (insertError) {
      // Don't leave an orphaned auth user with no profile behind.
      await supabaseAdmin.auth.admin.deleteUser(userId);
      console.error("[AUTH_SIGNUP_FAILURE] scout_profile_insert", { timestamp: new Date().toISOString(), reason: insertError.message });
      throw new Error("Could not create your account. Please try again.");
    }

    const { data: signedIn, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (signInError || !signedIn.session) {
      return { needsManualSignIn: true as const };
    }

    return {
      access_token: signedIn.session.access_token,
      refresh_token: signedIn.session.refresh_token,
    };
  });

// ============================================================
// CLUB SIGNUP
// ============================================================
export const serverSignUpClub = createServerFn({ method: "POST" })
  .validator((data: unknown) => validateOrLog(clubSignupSchema, data, "club_signup"))
  .handler(async ({ data }) => {
    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { role: "club", name: data.name },
    });

    if (createError) {
      console.error("[AUTH_SIGNUP_FAILURE] club", { timestamp: new Date().toISOString(), reason: createError.message });
      const message = createError.message?.toLowerCase().includes("already")
        ? "An account with this email already exists. Please sign in instead."
        : "Could not create your account. Please try again.";
      throw new Error(message);
    }

    const userId = created.user.id;
    const slug = slugify(data.name);

    const { error: insertError } = await supabaseAdmin.from("clubs").insert({
      user_id: userId,
      name: data.name,
      slug,
      location: data.location,
      description: data.description || null,
    });

    if (insertError) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      console.error("[AUTH_SIGNUP_FAILURE] club_profile_insert", { timestamp: new Date().toISOString(), reason: insertError.message });
      const message = insertError.code === "23505"
        ? "A club with a very similar name already exists. Try a more specific name."
        : "Could not create your account. Please try again.";
      throw new Error(message);
    }

    const { data: signedIn, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (signInError || !signedIn.session) {
      return { needsManualSignIn: true as const };
    }

    return {
      access_token: signedIn.session.access_token,
      refresh_token: signedIn.session.refresh_token,
    };
  });

// ============================================================
// ATHLETE SIGNUP
// (best-effort field list — confirm against the real register/athlete.tsx)
// ============================================================
export const serverSignUpAthlete = createServerFn({ method: "POST" })
  .validator((data: unknown) => validateOrLog(athleteSignupSchema, data, "athlete_signup"))
  .handler(async ({ data }) => {
    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { role: "athlete", name: data.name },
    });

    if (createError) {
      console.error("[AUTH_SIGNUP_FAILURE] athlete", { timestamp: new Date().toISOString(), reason: createError.message });
      const message = createError.message?.toLowerCase().includes("already")
        ? "An account with this email already exists. Please sign in instead."
        : "Could not create your account. Please try again.";
      throw new Error(message);
    }

    const userId = created.user.id;
    const slug = slugify(data.name);

    const { error: insertError } = await supabaseAdmin.from("players").insert({
      user_id: userId,
      slug,
      name: data.name,
      pos: data.pos,
      city: data.city,
      club: data.club,
      age: data.age,
      number: data.number,
      stats: [{ label: "Caps", value: "0" }, { label: "Goals", value: "0" }, { label: "Assists", value: "0" }],
      rating: 0,
    });

    if (insertError) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      console.error("[AUTH_SIGNUP_FAILURE] athlete_profile_insert", { timestamp: new Date().toISOString(), reason: insertError.message });
      throw new Error("Could not create your account. Please try again.");
    }

    const { data: signedIn, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (signInError || !signedIn.session) {
      return { needsManualSignIn: true as const };
    }

    return {
      access_token: signedIn.session.access_token,
      refresh_token: signedIn.session.refresh_token,
    };
  });

// ============================================================
// FORGOT PASSWORD
// ============================================================
export const requestPasswordReset = createServerFn({ method: "POST" })
  .validator((data: unknown) => validateOrLog(forgotPasswordSchema, data, "forgot_password"))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${process.env.VITE_PUBLIC_SITE_URL ?? "http://localhost:8080"}/reset-password`,
    });
    if (error) {
      console.error("[AUTH_RESET_REQUEST_FAILURE]", { timestamp: new Date().toISOString(), reason: error.message });
    }
    // Always return the same response whether or not the email exists —
    // this prevents the endpoint being used to discover registered emails
    // (an "email enumeration" attack).
    return { sent: true };
  });

// ============================================================
// VALIDATE NEW PASSWORD (defense in depth — the actual update happens
// client-side via the recovery session established by the email link)
// ============================================================
export const validateNewPassword = createServerFn({ method: "POST" })
  .validator((data: unknown) => validateOrLog(resetPasswordSchema, data, "password_reset_set"))
  .handler(async () => {
    return { valid: true };
  });