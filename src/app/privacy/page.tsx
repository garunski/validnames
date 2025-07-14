import { PrivacyContentFirstHalf } from "./components/PrivacyContentFirstHalf";
import { PrivacyContentSecondHalf } from "./components/PrivacyContentSecondHalf";
import { PrivacyFooter } from "./components/PrivacyFooter";
import { PrivacyHeader } from "./components/PrivacyHeader";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      <PrivacyHeader />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <PrivacyContentFirstHalf />
          <PrivacyContentSecondHalf />
        </div>
      </main>
      <PrivacyFooter />
    </div>
  );
}
