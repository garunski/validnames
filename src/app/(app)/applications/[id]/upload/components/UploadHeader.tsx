import { BaseHeader } from "@/components/layout/BaseHeader";
import { CalendarIcon, CloudArrowUpIcon } from "@heroicons/react/20/solid";

interface UploadHeaderProps {
  application: {
    name: string;
    description?: string | null;
    createdAt: string | Date;
  };
}

export function UploadHeader({ application }: UploadHeaderProps) {
  return (
    <BaseHeader
      icon={<CloudArrowUpIcon className="size-5" />}
      title={application.name}
      description={application.description || undefined}
      metadata={{
        icon: <CalendarIcon className="size-3" />,
        text: `Created ${new Date(application.createdAt).toLocaleDateString()}`,
      }}
    />
  );
}
