import { Button, Section, Text } from "@react-email/components";
import { StyledEmailLayout, emailStyles } from "./EmailStyles";

interface PasswordResetTemplateProps {
  userName: string;
  resetLink: string;
}

export default function PasswordResetTemplate({
  userName,
  resetLink,
}: PasswordResetTemplateProps) {
  return (
    <StyledEmailLayout title="Reset Your Password">
      <Text style={emailStyles.heading}>Hi {userName},</Text>

      <Text style={emailStyles.text}>
        We received a request to reset your password for your Valid Names
        account. Click the button below to create a new password.
      </Text>

      <Section style={{ textAlign: "center" }}>
        <Button href={resetLink} style={emailStyles.button}>
          Reset Password
        </Button>
      </Section>

      <Text style={emailStyles.text}>
        This reset link will expire in 24 hours. If you didn&apos;t request a
        password reset, you can safely ignore this email.
      </Text>

      <Text style={emailStyles.footer}>
        If the button doesn&apos;t work, copy and paste this link into your
        browser:
        <br />
        <a href={resetLink} style={{ color: "#3b82f6" }}>
          {resetLink}
        </a>
      </Text>
    </StyledEmailLayout>
  );
}
