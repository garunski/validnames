import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Text,
} from "@react-email/components";

interface PasswordResetTemplateProps {
  userName: string;
  resetLink: string;
}

export default function PasswordResetTemplate({
  userName,
  resetLink,
}: PasswordResetTemplateProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Text>Hi {userName},</Text>
          <Text>Reset your password:</Text>
          <Button href={resetLink}>Reset Password</Button>
          <Text>Link expires in 24 hours.</Text>
          <Text>Ignore if you didn&apos;t request this.</Text>
        </Container>
      </Body>
    </Html>
  );
}
