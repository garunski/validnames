export function PrivacyContentFirstHalf() {
  return (
    <>
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
            Standard web server logs (IP addresses, browser information, access
            times)
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
          We implement appropriate security measures to protect your personal
          information against unauthorized access, alteration, disclosure, or
          destruction. However, no method of transmission over the internet is
          100% secure.
        </p>
      </section>
    </>
  );
}
