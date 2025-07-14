import { ApplicationWithCategories } from "@/app/api/applications/applicationTypes";
import { ApplicationCard } from "./ApplicationCard";

interface ApplicationsListProps {
  applications: ApplicationWithCategories[];
}

export function ApplicationsList({ applications }: ApplicationsListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {applications.map((app) => (
        <ApplicationCard key={app.id} application={app} />
      ))}
    </div>
  );
}
