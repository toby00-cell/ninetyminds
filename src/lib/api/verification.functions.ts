import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// Service-role client — this must NEVER be imported into client-side code.
// It only runs safely here because the whole module is wrapped in
// createServerFn, so it executes on the server, not in the browser.
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

type VerificationEmailInput = {
  userId: string;
  name: string;
  accountType: "scout" | "club";
  status: "verified" | "rejected";
  reason?: string;
};

export const sendVerificationEmail = createServerFn({ method: "POST" }).handler(
  async (ctx: any) => {
    const data = ctx.data as VerificationEmailInput;
    // scouts/clubs tables don't store email — it lives in Supabase Auth.
    // Only the service role can look up another user's email like this.
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(data.userId);
    if (userError || !userData?.user?.email) {
      console.error("Could not look up user email for verification notice:", userError);
      return { sent: false };
    }

    const to = userData.user.email;
    const accountLabel = data.accountType === "club" ? "club" : "scout";

    const subject = data.status === "verified"
      ? "You're verified on NinetyMinds ✓"
      : "Update on your NinetyMinds verification";

    const html = data.status === "verified"
      ? `
        <p>Hi ${data.name},</p>
        <p>Good news — your ${accountLabel} account on NinetyMinds has been reviewed and verified.</p>
        <p>A verified badge will now show wherever your profile appears, including search results and messages.</p>
        <p>— The NinetyMinds team</p>
      `
      : `
        <p>Hi ${data.name},</p>
        <p>We reviewed the document you submitted for ${accountLabel} verification and weren't able to approve it this time.</p>
        ${data.reason ? `<p><strong>Reason:</strong> ${data.reason}</p>` : ""}
        <p>You can upload a new document from your dashboard at any time and we'll review it again.</p>
        <p>— The NinetyMinds team</p>
      `;

    try {
      await resend.emails.send({
        from: "NinetyMinds <verification@ninetyminds.ng>",
        to,
        subject,
        html,
      });
      return { sent: true };
    } catch (err) {
      console.error("Failed to send verification email:", err);
      return { sent: false };
    }
  });