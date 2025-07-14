"use client";

import { useState } from "react";
import { AIGenerator } from "./AIGenerator";

interface UploadHelpSectionProps {
  aiTopic: string;
  onTopicChange: (topic: string) => void;
  selectedTab?: string;
  setSelectedTab?: (tab: string) => void;
  applicationId?: string;
  onSelectVariationsPrompt?: () => void;
  selectedPromptCategory?: string;
  onPromptCategoryChange?: (category: string) => void;
}

const TABS = [
  { key: "prompt", label: "Prompt Generator" },
  { key: "help", label: "Help & Documentation" },
];

export function UploadHelpSection({
  aiTopic,
  onTopicChange,
  selectedTab: controlledTab,
  setSelectedTab: setControlledTab,
  applicationId,
  onSelectVariationsPrompt,
  selectedPromptCategory,
  onPromptCategoryChange,
}: UploadHelpSectionProps) {
  const [internalTab, setInternalTab] = useState<string>(TABS[0].key);
  const selectedTab = controlledTab ?? internalTab;
  const setSelectedTab = setControlledTab ?? setInternalTab;

  return (
    <section id="help-section" className="space-y-0">
      {/* Tabs styled like application details categories, no extra margin or padding */}
      <div className="border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`flex !cursor-pointer items-center gap-2 border-b-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                selectedTab === tab.key
                  ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                  : "border-transparent text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              } `}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content, padded */}
      <div className="px-6 py-6">
        {selectedTab === "prompt" && (
          <AIGenerator
            aiTopic={aiTopic}
            onTopicChange={onTopicChange}
            applicationId={applicationId}
            onSelectVariationsPrompt={onSelectVariationsPrompt}
            selectedCategory={selectedPromptCategory}
            onCategoryChange={onPromptCategoryChange}
          />
        )}
        {selectedTab === "help" && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                How to Upload Domains
              </h3>
              <ul className="list-disc space-y-1 pl-6 text-sm text-zinc-700 dark:text-zinc-300">
                <li>
                  Upload one or more JSON files containing your domain
                  categories and domain ideas. Multiple files will be processed
                  sequentially.
                </li>
                <li>
                  Each category should have a unique{" "}
                  <code className="rounded bg-zinc-100 px-1 font-mono">id</code>
                  ,{" "}
                  <code className="rounded bg-zinc-100 px-1 font-mono">
                    name
                  </code>
                  , and{" "}
                  <code className="rounded bg-zinc-100 px-1 font-mono">
                    description
                  </code>
                  .
                </li>
                <li>
                  Each category contains a{" "}
                  <code className="rounded bg-zinc-100 px-1 font-mono">
                    domains
                  </code>{" "}
                  array with your domain name ideas (no TLDs, lowercase, no
                  spaces).
                </li>
                <li>See the sample format below for details.</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-1 font-medium text-zinc-900 dark:text-zinc-100">
                Sample JSON Format
              </h4>
              <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
                <pre className="font-mono text-xs whitespace-pre-wrap text-zinc-700 dark:text-zinc-200">
                  {`{
  "categories": [
    {
      "id": "category-slug",
      "name": "Category Name",
      "description": "Brief description of this category",
      "domains": [
        "domain1",
        "domain2",
        "domain3"
      ]
    }
  ]
}`}
                </pre>
              </div>
            </div>
            <div>
              <h4 className="mb-1 font-medium text-zinc-900 dark:text-zinc-100">
                Requirements & Tips
              </h4>
              <ul className="list-disc space-y-1 pl-6 text-sm text-zinc-700 dark:text-zinc-300">
                <li>5-10 categories recommended</li>
                <li>15-25 domain ideas per category</li>
                <li>No TLD extensions (no .com, .org, etc.)</li>
                <li>
                  Use only lowercase letters, no spaces or special characters
                </li>
                <li>Prefer shorter, brandable names</li>
                <li>Categories should cover different aspects or sub-niches</li>
                <li>Avoid trademarked or generic names</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
