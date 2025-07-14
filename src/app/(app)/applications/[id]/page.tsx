import { ApplicationPageContent } from "@/applications/components/ApplicationPageContent";

interface ApplicationPageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplicationPage({
  params,
}: ApplicationPageProps) {
  const { id } = await params;

  return <ApplicationPageContent id={id} />;
}
