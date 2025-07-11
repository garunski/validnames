import { Link } from "@/primitives/link";

export function TermsContentSecondHalf() {
  return (
    <>
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
          8. Termination
        </h2>
        <p className="text-zinc-700 dark:text-zinc-300">
          We reserve the right to suspend or terminate your access to the
          service at any time, with or without cause, and with or without
          notice.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
          9. Privacy
        </h2>
        <p className="text-zinc-700 dark:text-zinc-300">
          Your privacy is important to us. Please review our{" "}
          <Link
            href="/privacy"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Privacy Policy
          </Link>
          , which governs the collection and use of your information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
          10. Hosting and Infrastructure
        </h2>
        <p className="text-zinc-700 dark:text-zinc-300">
          This service is hosted on Vercel. Performance monitoring is conducted
          using Vercel Analytics and Speed Insights to ensure optimal service
          delivery.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
          11. Modifications
        </h2>
        <p className="text-zinc-700 dark:text-zinc-300">
          We reserve the right to modify these Terms of Service at any time.
          Changes will be effective immediately upon posting. Your continued use
          of the service constitutes acceptance of the modified terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
          12. Governing Law
        </h2>
        <p className="text-zinc-700 dark:text-zinc-300">
          These Terms shall be governed by and construed in accordance with
          applicable laws. Any disputes shall be resolved through appropriate
          legal channels.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
          13. Severability
        </h2>
        <p className="text-zinc-700 dark:text-zinc-300">
          If any provision of these Terms is found to be unenforceable, the
          remaining provisions shall remain in full force and effect.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-white">
          14. Contact Information
        </h2>
        <p className="text-zinc-700 dark:text-zinc-300">
          For questions about these Terms of Service, please contact:
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
    </>
  );
}
