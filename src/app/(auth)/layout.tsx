import { AuthLayout } from "@/primitives/authLayout";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
