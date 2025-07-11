import EmailVerificationTemplate from "@/components/emails/EmailVerificationTemplate";
import { resend } from "@/email/resendClient";

export async function sendEmailVerification(
  email: string,
  userName: string,
  token: string,
) {
  const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email/success?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: "Verify your email address",
    react: EmailVerificationTemplate({
      userName,
      verificationLink,
    }),
  });

  if (error) {
    throw new Error(`Email verification failed: ${error.message}`);
  }

  return data;
}
