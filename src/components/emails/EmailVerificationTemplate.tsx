import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Text,
} from "@react-email/components";

interface EmailVerificationTemplateProps {
  userName: string;
  verificationLink: string;
}

export default function EmailVerificationTemplate({
  userName,
  verificationLink,
}: EmailVerificationTemplateProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Text>Hi {userName},</Text>
          <Text>Please verify your email address:</Text>
          <Button href={verificationLink}>Verify Email</Button>
          <Text>Link expires in 24 hours.</Text>
        </Container>
      </Body>
    </Html>
  );
}
