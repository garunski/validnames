"use client";

import { Button } from "@/primitives/button";
import { Input } from "@/primitives/input";
import { DocumentDuplicateIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { PROMPT_CATEGORIES, generateAiPrompt } from "./AIPromptGenerator";
import { ErrorDisplay } from "./ErrorDisplay";
import { FavoritesList } from "./FavoritesList";
import { PromptPreview } from "./PromptPreview";
import { PromptStyleSelector } from "./PromptStyleSelector";

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
          <ErrorDisplay error={error} />

          {/* Prompt Category Tabs */}
          <PromptStyleSelector
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Preview Format Toggle */}
          <PromptPreview
            aiTopic={aiTopic}
            selectedCategory={selectedCategory}
            previewFormat={previewFormat}
            onPreviewFormatChange={setPreviewFormat}
          />
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
