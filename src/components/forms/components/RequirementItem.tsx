interface RequirementItemProps {
  met: boolean;
  text: string;
}

export function RequirementItem({ met, text }: RequirementItemProps) {
  return (
    <div className="flex items-center">
      <div
        className={`mr-2 flex h-4 w-4 items-center justify-center rounded-full ${
          met ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        {met && (
          <svg
            className="h-3 w-3 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      <span className={`text-sm ${met ? "text-green-600" : "text-gray-500"}`}>
        {text}
      </span>
    </div>
  );
}
