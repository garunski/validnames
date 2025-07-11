import { Link } from "@/primitives/link";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

export function PrivacyFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <GlobeAltIcon className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-semibold text-zinc-900 dark:text-white">
              Valid Names
            </span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            © {new Date().getFullYear()}{" "}
            <a href="https://garunski.com">Garunski</a> ·{" "}
            <Link
              href="/privacy"
              className="hover:text-zinc-900 dark:hover:text-white"
            >
              Privacy
            </Link>{" "}
            ·{" "}
            <Link
              href="/terms"
              className="hover:text-zinc-900 dark:hover:text-white"
            >
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
