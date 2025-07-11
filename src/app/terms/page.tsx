import { TermsContentFirstHalf } from "./components/TermsContentFirstHalf";
import { TermsContentSecondHalf } from "./components/TermsContentSecondHalf";
import { TermsFooter } from "./components/TermsFooter";
import { TermsHeader } from "./components/TermsHeader";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      <TermsHeader />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <TermsContentFirstHalf />
          <TermsContentSecondHalf />
        </div>
      </main>
      <TermsFooter />
    </div>
  );
}
