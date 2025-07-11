export const formatAvailabilityStatus = (isAvailable: boolean | null) => {
  if (isAvailable === true) {
    return {
      border: "border-green-200 dark:border-green-800",
      bg: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      indicator: "bg-green-500",
      icon: "✅",
      iconColor: "text-green-600 dark:text-green-400",
    };
  } else if (isAvailable === false) {
    return {
      border: "border-red-200 dark:border-red-800",
      bg: "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20",
      indicator: "bg-red-500",
      icon: "❌",
      iconColor: "text-red-600 dark:text-red-400",
    };
  } else {
    return {
      border: "border-zinc-200 dark:border-zinc-700",
      bg: "bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-700",
      indicator: "bg-zinc-400",
      icon: "❓",
      iconColor: "text-zinc-600 dark:text-zinc-400",
    };
  }
};
