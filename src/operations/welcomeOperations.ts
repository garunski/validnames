import WelcomeEmailTemplate from "@/components/emails/WelcomeEmailTemplate";
import { resend } from "@/email/resendClient";

export async function sendWelcomeEmail(email: string, userName: string) {
  const loginLink = `${process.env.NEXT_PUBLIC_APP_URL}/login`;

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: "Welcome to Valid Names!",
    react: WelcomeEmailTemplate({
      userName,
      loginLink,
    }),
  });

  if (error) {
    throw new Error(`Welcome email failed: ${error.message}`);
  }

  return data;
}
