"use client";

interface StatCard {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface ApplicationStatsCardsProps {
  stats: StatCard[];
}

export function ApplicationStatsCards({ stats }: ApplicationStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <div
                className={`rounded-lg p-2 ${
                  stat.color === "blue"
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    : stat.color === "green"
                      ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                      : stat.color === "red"
                        ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                        : "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                }`}
              >
                <Icon className="size-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
