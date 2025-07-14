import { Button } from "@/primitives/button";

interface ApplicationErrorStateProps {
  error: string;
}

export function ApplicationErrorState({ error }: ApplicationErrorStateProps) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="text-lg font-medium text-red-600">{error}</div>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4"
          color="zinc"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
