import { Button, Section, Text } from "@react-email/components";
import { StyledEmailLayout, emailStyles } from "./EmailStyles";

interface EmailVerificationTemplateProps {
  userName: string;
  verificationLink: string;
}

export default function EmailVerificationTemplate({
  userName,
  verificationLink,
}: EmailVerificationTemplateProps) {
  return (
    <StyledEmailLayout title="Verify Your Email">
      <Text style={emailStyles.heading}>Hi {userName},</Text>

      <Text style={emailStyles.text}>
        Thanks for signing up for Valid Names! To complete your registration,
        please verify your email address by clicking the button below.
      </Text>

      <Section style={{ textAlign: "center" }}>
        <Button href={verificationLink} style={emailStyles.button}>
          Verify Email Address
        </Button>
      </Section>

      <Text style={emailStyles.text}>
        This verification link will expire in 24 hours. If you didn&apos;t create an
        account with Valid Names, you can safely ignore this email.
      </Text>

      <Text style={emailStyles.footer}>
        If the button doesn&apos;t work, copy and paste this link into your browser:
        <br />
        <a href={verificationLink} style={{ color: "#3b82f6" }}>
          {verificationLink}
        </a>
      </Text>
    </StyledEmailLayout>
  );
}
