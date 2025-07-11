import { Link } from "@/primitives/link";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <GlobeAltIcon className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-zinc-900 dark:text-white">
                  Valid Names
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-white">
            Privacy Policy
          </h1>

          <div className="mb-8 text-sm text-zinc-600 dark:text-zinc-400">
            <p>
              <strong>Effective Date:</strong> July 11, 2025
            </p>
            <p>
              <strong>Last Updated:</strong> July 11, 2025
            </p>
          </div>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
              1. Information We Collect
            </h2>

            <h3 className="mb-2 text-lg font-medium text-zinc-900 dark:text-white">
              Personal Information:
            </h3>
            <ul className="mb-4 list-disc pl-6 text-zinc-700 dark:text-zinc-300">
              <li>
                Name and email address (collected during account registration)
              </li>
              <li>Email is used as your username for account access</li>
            </ul>

            <h3 className="mb-2 text-lg font-medium text-zinc-900 dark:text-white">
              Technical Information:
            </h3>
            <ul className="mb-4 list-disc pl-6 text-zinc-700 dark:text-zinc-300">
              <li>Website usage data through Vercel Analytics</li>
              <li>Performance metrics through Vercel Speed Insights</li>
              <li>
                Standard web server logs (IP addresses, browser information,
                access times)
              </li>
            </ul>

            <h3 className="mb-2 text-lg font-medium text-zinc-900 dark:text-white">
              Domain-Related Information:
            </h3>
            <ul className="mb-4 list-disc pl-6 text-zinc-700 dark:text-zinc-300">
              <li>Domain names you search or check</li>
              <li>WHOIS data retrieved from public domain registries</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
              2. How We Use Your Information
            </h2>
            <p className="mb-4 text-zinc-700 dark:text-zinc-300">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300">
              <li>Provide and maintain our domain checking services</li>
              <li>Authenticate your account access</li>
              <li>Send password reset emails when requested</li>
              <li>Monitor and improve website performance</li>
              <li>Analyze usage patterns to enhance user experience</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
              3. Information Sharing and Disclosure
            </h2>
            <p className="mb-4 text-zinc-700 dark:text-zinc-300">
              <strong>
                We do not sell, trade, or disclose your personal information to
                third parties.
              </strong>{" "}
              Your information remains private and is only used for the purposes
              outlined in this policy.
            </p>

            <h3 className="mb-2 text-lg font-medium text-zinc-900 dark:text-white">
              Third-Party Services:
            </h3>
            <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300">
              <li>
                <strong>Vercel Analytics & Speed Insights:</strong> Used for
                performance monitoring and analytics
              </li>
              <li>
                <strong>WHOIS Services:</strong> Domain availability is checked
                against public WHOIS databases
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
              4. Data Security
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              We implement appropriate security measures to protect your
              personal information against unauthorized access, alteration,
              disclosure, or destruction. However, no method of transmission
              over the internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
              5. Data Retention
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              We retain your personal information only as long as necessary to
              provide our services or as required by law. You may request
              deletion of your account and associated data by contacting us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
              6. Your Rights
            </h2>
            <p className="mb-4 text-zinc-700 dark:text-zinc-300">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for data processing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
              7. Cookies and Tracking
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              We use essential cookies for website functionality and may use
              analytics cookies to improve our services. You can control cookie
              preferences through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
              8. Changes to This Policy
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              We may update this Privacy Policy from time to time. We will
              notify users of any material changes by posting the new policy on
              this page with an updated &ldquo;Last Updated&rdquo; date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
              9. Contact Information
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              For questions about this Privacy Policy, please contact:
            </p>
            <ul className="list-none pl-0 text-zinc-700 dark:text-zinc-300">
              <li>
                <strong>Owner:</strong> Garun Vagidov
              </li>
              <li>
                <strong>Email:</strong> info@garunski.com
              </li>
            </ul>
          </section>
        </div>
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
