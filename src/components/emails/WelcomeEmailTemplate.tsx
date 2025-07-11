import { Button, Section, Text } from "@react-email/components";
import { StyledEmailLayout, emailStyles } from "./EmailStyles";

interface WelcomeEmailTemplateProps {
  userName: string;
  loginLink: string;
}

export default function WelcomeEmailTemplate({
  userName,
  loginLink,
}: WelcomeEmailTemplateProps) {
  return (
    <StyledEmailLayout title="Welcome to Valid Names!">
      <Text style={emailStyles.heading}>Welcome {userName}!</Text>

      <Text style={emailStyles.text}>
        Your email has been successfully verified and your account is now ready
        to use. Welcome to Valid Names!
      </Text>

      <Text style={emailStyles.text}>
        You can now start exploring domain names, checking availability, and
        managing your applications.
      </Text>

      <Section style={{ textAlign: "center" }}>
        <Button href={loginLink} style={emailStyles.button}>
          Get Started
        </Button>
      </Section>

      <Text style={emailStyles.footer}>
        If you have any questions, feel free to reach out to our support team.
      </Text>
    </StyledEmailLayout>
  );
}
