import { PROMPT_CATEGORIES } from "./AIPromptGenerator";

type PromptCategoryKey = (typeof PROMPT_CATEGORIES)[number]["key"];

interface PromptStyleSelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: PromptCategoryKey) => void;
}

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

export function PromptStyleSelector({
  selectedCategory,
  onCategoryChange,
}: PromptStyleSelectorProps) {
  return (
    <>
      <div className="-mx-6 my-4 border-t border-zinc-200 dark:border-zinc-700" />
      <div className="mb-4">
        <div className="mb-2 font-semibold">Prompt Style</div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {PROMPT_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => onCategoryChange(cat.key)}
              className={`flex min-h-[120px] w-full cursor-pointer flex-col items-center justify-between rounded-lg border p-3 transition-all duration-200 ease-out ${
                selectedCategory === cat.key
                  ? "animate-glow border-blue-600 bg-blue-50 shadow-sm"
                  : "border-zinc-200 bg-white hover:bg-zinc-50"
              } focus:ring-2 focus:ring-blue-400 focus:outline-none`}
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
    </>
  );
}
