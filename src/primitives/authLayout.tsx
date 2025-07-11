import type React from "react";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-2 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background pattern */}
      <div className="bg-grid-slate-100 dark:bg-grid-slate-700/25 absolute inset-0 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>

      <div className="relative flex grow items-center justify-center p-6 lg:rounded-lg lg:bg-white/10 lg:p-10 lg:shadow-2xl lg:ring-1 lg:ring-white/20 lg:backdrop-blur-sm dark:lg:bg-slate-900/10 dark:lg:ring-slate-800/50">
        {children}
      </div>
    </main>
  );
}
