import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Section,
  Text,
} from "@react-email/components";

interface StyledEmailProps {
  children: React.ReactNode;
  title: string;
}

export function StyledEmailLayout({ children, title }: StyledEmailProps) {
  return (
    <Html>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Body
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          backgroundColor: "#f6f9fc",
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Section
            style={{
              backgroundColor: "#3b82f6",
              padding: "32px 24px",
              textAlign: "center",
            }}
          >
            <Text
              style={{
                color: "#ffffff",
                fontSize: "24px",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              Valid Names
            </Text>
          </Section>

          <Section style={{ padding: "32px 24px" }}>{children}</Section>

          <Hr style={{ margin: "32px 0", borderColor: "#e5e7eb" }} />

          <Section
            style={{
              padding: "0 24px 32px",
              textAlign: "center",
            }}
          >
            <Text
              style={{
                color: "#6b7280",
                fontSize: "14px",
                margin: 0,
              }}
            >
              © {new Date().getFullYear()} Garunski. All rights reserved.
            </Text>
            <Text
              style={{
                color: "#9ca3af",
                fontSize: "12px",
                margin: "8px 0 0 0",
              }}
            >
              This email was sent to you because you have an account with Valid
              Names.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export const emailStyles = {
  heading: {
    color: "#1f2937",
    fontSize: "20px",
    fontWeight: "bold",
    margin: "0 0 16px 0",
  },
  text: {
    color: "#374151",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "0 0 16px 0",
  },
  button: {
    backgroundColor: "#3b82f6",
    borderRadius: "6px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "12px 24px",
    margin: "16px 0",
  },
  footer: {
    color: "#6b7280",
    fontSize: "14px",
    margin: "24px 0 0 0",
  },
};
