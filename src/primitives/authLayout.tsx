import { Link } from "@/primitives/link";
import type React from "react";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="relative w-full max-w-md">{children}</div>
      </main>
      {/* Ultra subtle footer */}
      <footer className="pointer-events-none fixed bottom-2 left-0 z-20 w-full text-center select-none">
        <p className="text-xs tracking-wide text-zinc-400">
          © {new Date().getFullYear()} Garunski &middot;{" "}
          <Link
            href="/privacy"
            className="pointer-events-auto select-auto hover:text-zinc-500"
          >
            Privacy
          </Link>{" "}
          &middot;{" "}
          <Link
            href="/terms"
            className="pointer-events-auto select-auto hover:text-zinc-500"
          >
            Terms
          </Link>
        </p>
      </footer>
    </div>
  );
}
