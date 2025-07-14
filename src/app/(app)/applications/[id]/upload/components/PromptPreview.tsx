import { generateAiPrompt } from "./AIPromptGenerator";

interface PromptPreviewProps {
  aiTopic: string;
  selectedCategory: string;
  previewFormat: "markdown" | "html";
  onPreviewFormatChange: (format: "markdown" | "html") => void;
}

export function PromptPreview({
  aiTopic,
  selectedCategory,
  previewFormat,
  onPreviewFormatChange,
}: PromptPreviewProps) {
  return (
    <>
      {/* Preview Format Toggle */}
      <div className="flex items-center justify-between">
        <div className="font-semibold">Prompt Preview</div>
        <div className="flex overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
          <button
            onClick={() => onPreviewFormatChange("html")}
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
            onClick={() => onPreviewFormatChange("markdown")}
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
    </>
  );
}
