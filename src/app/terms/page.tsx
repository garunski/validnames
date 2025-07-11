import { Link } from "@/primitives/link";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

export default function TermsPage() {
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
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-zinc max-w-none dark:prose-invert">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">
            Terms of Service
          </h1>
          
          <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-8">
            <p><strong>Effective Date:</strong> July 11, 2025</p>
            <p><strong>Last Updated:</strong> July 11, 2025</p>
          </div>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              By accessing and using ValidNames.com, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
              2. Service Description
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              ValidNames.com provides domain name availability checking services. We query public WHOIS databases to provide information about domain name availability and registration status.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
              3. User Accounts
            </h2>
            <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300">
              <li>You must provide accurate information when creating an account</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>Your email address serves as your username</li>
              <li>You may receive password reset emails when requested</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
              4. Acceptable Use
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              You agree to use our service only for lawful purposes and in accordance with these Terms. You shall not:
            </p>
            <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300">
              <li>Use the service for any illegal or unauthorized purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service</li>
              <li>Use automated tools to excessively query our service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
              5. Disclaimers and Limitations
            </h2>
            
            <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">
              NO WARRANTIES:
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">
              The service is provided &ldquo;as is&rdquo; without warranties of any kind, either express or implied.
            </p>

            <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">
              NO GUARANTEES:
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300 mb-4">We make no guarantees about:</p>
            <ul className="list-disc pl-6 mb-4 text-zinc-700 dark:text-zinc-300">
              <li>The accuracy of domain availability information</li>
              <li>The completeness of WHOIS data</li>
              <li>Service availability or uptime</li>
              <li>The suitability of our service for any particular purpose</li>
            </ul>

            <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">
              LIMITATION OF LIABILITY:
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300">
              To the maximum extent permitted by law, ValidNames.com and its owner shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
              6. WHOIS Data
            </h2>
            <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300">
              <li>Domain checking is performed against public WHOIS databases</li>
              <li>WHOIS information is provided by third-party registries</li>
              <li>We are not responsible for the accuracy of WHOIS data</li>
              <li>WHOIS data may be subject to registry policies and restrictions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
              7. Intellectual Property
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              The ValidNames.com website and service are owned by Garun Vagidov. All rights reserved. Users are granted a limited license to use the service for its intended purpose.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
              8. Termination
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              We reserve the right to suspend or terminate your access to the service at any time, with or without cause, and with or without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
              9. Privacy
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              Your privacy is important to us. Please review our <Link href="/privacy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Privacy Policy</Link>, which governs the collection and use of your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
              10. Hosting and Infrastructure
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              This service is hosted on Vercel. Performance monitoring is conducted using Vercel Analytics and Speed Insights to ensure optimal service delivery.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
              11. Modifications
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting. Your continued use of the service constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
              12. Governing Law
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              These Terms shall be governed by and construed in accordance with applicable laws. Any disputes shall be resolved through appropriate legal channels.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
              13. Severability
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              If any provision of these Terms is found to be unenforceable, the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
              14. Contact Information
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              For questions about these Terms of Service, please contact:
            </p>
            <ul className="list-none pl-0 text-zinc-700 dark:text-zinc-300">
              <li><strong>Owner:</strong> Garun Vagidov</li>
              <li><strong>Email:</strong> info@garunski.com</li>
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
              © {new Date().getFullYear()} <a href="https://garunski.com">Garunski</a> · <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-white">Privacy</Link> · <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-white">Terms</Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 