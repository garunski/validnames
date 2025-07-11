"use client";

import { Button } from "@/primitives/button";
import { Input } from "@/primitives/input";
import { DocumentDuplicateIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { PROMPT_CATEGORIES, generateAiPrompt } from "./AIPromptGenerator";
import { FavoritesList } from "./FavoritesList";

interface AIGeneratorProps {
  aiTopic: string;
  onTopicChange: (topic: string) => void;
  applicationId?: string;
  onSelectVariationsPrompt?: () => void;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

type PromptCategoryKey = (typeof PROMPT_CATEGORIES)[number]["key"];

export function AIGenerator({
  aiTopic,
  onTopicChange,
  applicationId,
  onSelectVariationsPrompt,
  selectedCategory: externalSelectedCategory,
  onCategoryChange,
}: AIGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [internalSelectedCategory, setInternalSelectedCategory] =
    useState<PromptCategoryKey>(PROMPT_CATEGORIES[0].key);
  const [error, setError] = useState<string>("");
  const [previewFormat, setPreviewFormat] = useState<"markdown" | "html">(
    "html",
  );

  // Use external category if provided, otherwise use internal state
  const selectedCategory = externalSelectedCategory || internalSelectedCategory;
  const setSelectedCategory = onCategoryChange || setInternalSelectedCategory;

  const copyToClipboard = async () => {
    if (!aiTopic.trim()) {
      setError("Please enter a topic or niche before copying the prompt.");
      return;
    }
    try {
      await navigator.clipboard.writeText(
        generateAiPrompt(aiTopic, selectedCategory, "markdown"),
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy. Please try again.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTopicChange(e.target.value);
  };

  const PROMPT_STYLE_ICONS: Record<string, string> = {
    creative: "🎨",
    professional: "🏢",
    technical: "💻",
    playful: "🎲",
    minimalist: "⚡",
    variations: "🔀",
  };

  const PROMPT_STYLE_DESCRIPTIONS: Record<string, string> = {
    creative: "Imaginative, brandable names",
    professional: "Authoritative, credible names",
    technical: "Tech-forward, modern names",
    playful: "Fun, playful, lighthearted names",
    minimalist: "Short, simple, clean names",
    variations: "Generate variations for each input",
  };

  return (
    <section id="prompt-generator">
      <div className="flex gap-6">
        <div className="flex-1">
          {/* Info Header and Subtext */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                {selectedCategory === "variations"
                  ? "Enter a domain name to generate variations for AI tools like ChatGPT or Claude."
                  : "Enter a topic or niche to generate a prompt for AI tools like ChatGPT or Claude."}
              </span>
              <Button
                onClick={copyToClipboard}
                color="blue"
                title="Copy full prompt"
                type="button"
              >
                <DocumentDuplicateIcon
                  className="size-4 !text-white"
                  data-slot="icon"
                />
                {copied ? "Copied" : "Copy Prompt"}
              </Button>
            </div>
            <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {selectedCategory === "variations"
                ? "The prompt will help you create a JSON file with domain variations based on your input."
                : "The prompt will help you create a JSON file with categories and domain ideas tailored to your topic."}
            </div>
          </div>

          <Input
            value={aiTopic}
            onChange={handleInputChange}
            onInput={(e) => {
              if (error && e.isTrusted) setError("");
            }}
            placeholder={
              selectedCategory === "variations"
                ? "Enter a domain name (e.g., myapp)"
                : "Enter your topic or niche"
            }
            className="mb-6"
          />

          {/* Error/Success Messages */}
          {error && (
            <div className="animate-fade-in mb-4 flex w-fit items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 shadow-sm dark:border-red-800 dark:bg-red-900/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Prompt Category Tabs */}
          <div className="-mx-6 my-4 border-t border-zinc-200 dark:border-zinc-700" />
          <div className="mb-4">
            <div className="mb-2 font-semibold">Prompt Style</div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
              {PROMPT_CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`flex min-h-[120px] w-full cursor-pointer flex-col items-center justify-between rounded-lg border p-3 transition-all duration-200 ease-out ${selectedCategory === cat.key ? "animate-glow border-blue-600 bg-blue-50 shadow-sm" : "border-zinc-200 bg-white hover:bg-zinc-50"} focus:ring-2 focus:ring-blue-400 focus:outline-none`}
                  aria-pressed={selectedCategory === cat.key}
                  type="button"
                >
                  <span className="mb-1 text-2xl">
                    {PROMPT_STYLE_ICONS[cat.key]}
                  </span>
                  <span className="text-sm font-medium">{cat.label}</span>
                  <span className="mt-1 text-center text-xs text-zinc-500">
                    {PROMPT_STYLE_DESCRIPTIONS[cat.key]}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="-mx-6 my-4 border-t border-zinc-200 dark:border-zinc-700" />

          {/* Preview Format Toggle */}
          <div className="flex items-center justify-between">
            <div className="font-semibold">Prompt Preview</div>
            <div className="flex overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
              <button
                onClick={() => setPreviewFormat("html")}
                className={`cursor-pointer px-3 py-1.5 text-sm font-medium transition-colors ${
                  previewFormat === "html"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                }`}
                type="button"
              >
                HTML
              </button>
              <button
                onClick={() => setPreviewFormat("markdown")}
                className={`cursor-pointer px-3 py-1.5 text-sm font-medium transition-colors ${
                  previewFormat === "markdown"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                }`}
                type="button"
              >
                Markdown
              </button>
            </div>
          </div>

          {/* Prompt Preview */}
          <div className="pt-4">
            {previewFormat === "markdown" ? (
              <pre className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-4 font-mono text-xs whitespace-pre-wrap text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                {generateAiPrompt(aiTopic, selectedCategory, "markdown")}
              </pre>
            ) : (
              <div
                className="prose prose-sm dark:prose-invert max-w-none rounded-md border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                dangerouslySetInnerHTML={{
                  __html: generateAiPrompt(aiTopic, selectedCategory, "html"),
                }}
              />
            )}
          </div>
        </div>

        {/* Favorites List on the right */}
        {applicationId && (
          <div className="w-80">
            <FavoritesList
              applicationId={applicationId}
              onAddToInput={onTopicChange}
              onSelectVariationsPrompt={onSelectVariationsPrompt}
              currentInputValue={aiTopic}
            />
          </div>
        )}
      </div>
    </section>
  );
}
