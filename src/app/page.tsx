import { Button } from "@/primitives/button";
import { Link } from "@/primitives/link";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { CTASection } from "./components/CTASection";
import { FeaturesSection } from "./components/FeaturesSection";
import { HeroSection } from "./components/HeroSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <GlobeAltIcon className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-zinc-900 dark:text-white">
                Valid Names
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                Sign in
              </Link>
              <Button href="/register">Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>

      {/* Footer */}
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
    </div>
  );
}
