import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Text,
} from "@react-email/components";

interface WelcomeEmailTemplateProps {
  userName: string;
  loginLink: string;
}

export default function WelcomeEmailTemplate({
  userName,
  loginLink,
}: WelcomeEmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Text>Welcome {userName}!</Text>
          <Text>Your email is verified and account is ready.</Text>
          <Button href={loginLink}>Get Started</Button>
        </Container>
      </Body>
    </Html>
  );
}
