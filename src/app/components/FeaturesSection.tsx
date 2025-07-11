import { Heading } from "@/primitives/heading";
import {
  ChartBarIcon,
  CheckCircleIcon,
  CloudArrowUpIcon,
  CogIcon,
  GlobeAltIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export function FeaturesSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <Heading
            level={2}
            className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white"
          >
            Everything you need for domain research
          </Heading>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Powerful tools to help you find and manage the perfect domain names
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Batch Checking */}
          <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <CheckCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <Heading
              level={3}
              className="mt-6 text-lg font-semibold text-zinc-900 dark:text-white"
            >
              Batch Domain Checking
            </Heading>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Check hundreds of domains across multiple TLDs simultaneously.
              Save time with efficient batch processing and real-time results.
            </p>
          </div>

          {/* AI Generation */}
          <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
              <SparklesIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <Heading
              level={3}
              className="mt-6 text-lg font-semibold text-zinc-900 dark:text-white"
            >
              AI Prompt Generation
            </Heading>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Generate intelligent prompts for domain research using AI. Create
              targeted domain lists based on your business needs and industry.
            </p>
          </div>

          {/* Bulk Upload */}
          <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
              <CloudArrowUpIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <Heading
              level={3}
              className="mt-6 text-lg font-semibold text-zinc-900 dark:text-white"
            >
              Bulk Domain Upload
            </Heading>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Upload large lists of domains via JSON files. Organize domains
              into categories and applications for better management.
            </p>
          </div>

          {/* Progress Tracking */}
          <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
              <ChartBarIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <Heading
              level={3}
              className="mt-6 text-lg font-semibold text-zinc-900 dark:text-white"
            >
              Progress Tracking
            </Heading>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Monitor domain checking progress in real-time. Track batch job
              status and get notified when checks are complete.
            </p>
          </div>

          {/* TLD Selection */}
          <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900">
              <CogIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <Heading
              level={3}
              className="mt-6 text-lg font-semibold text-zinc-900 dark:text-white"
            >
              TLD Selection
            </Heading>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Choose from hundreds of top-level domains for checking. Filter by
              category, popularity, or industry relevance for targeted results.
            </p>
          </div>

          {/* Organization */}
          <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900">
              <GlobeAltIcon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <Heading
              level={3}
              className="mt-6 text-lg font-semibold text-zinc-900 dark:text-white"
            >
              Smart Organization
            </Heading>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Organize domains by applications and categories. Keep your
              research organized and easily accessible.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
