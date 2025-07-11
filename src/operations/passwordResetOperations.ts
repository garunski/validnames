import PasswordResetTemplate from "@/components/emails/PasswordResetTemplate";
import { resend } from "@/lib/resend";

export async function sendPasswordReset(
  email: string,
  userName: string,
  token: string,
) {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: "Reset your password",
    react: PasswordResetTemplate({
      userName,
      resetLink,
    }),
  });

  if (error) {
    throw new Error(`Password reset email failed: ${error.message}`);
  }

  return data;
}
