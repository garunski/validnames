"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { AppNavbar } from "./components/AppNavbar";
import { Link } from "@/primitives/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading, handleSignOut } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <div className="mt-4 text-zinc-500 dark:text-zinc-400">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-900">
      <AppNavbar user={user} pathname={pathname} onSignOut={handleSignOut} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="w-full py-3 text-center text-xs text-zinc-400 select-none dark:text-zinc-600">
        © <a href="https://garunski.com">Garunski</a> · <Link href="/privacy" className="hover:text-zinc-500 dark:hover:text-zinc-300">Privacy</Link> · <Link href="/terms" className="hover:text-zinc-500 dark:hover:text-zinc-300">Terms</Link> {new Date().getFullYear()}
      </footer>
    </div>
  );
}
