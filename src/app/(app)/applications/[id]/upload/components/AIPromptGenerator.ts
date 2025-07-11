import { formatHtml } from "./promptHtmlFormatter";

export const PROMPT_CATEGORIES = [
  { key: "creative", label: "Creative" },
  { key: "professional", label: "Professional" },
  { key: "technical", label: "Technical" },
  { key: "playful", label: "Playful" },
  { key: "minimalist", label: "Minimalist" },
  { key: "variations", label: "Variations" },
] as const;

type PromptFormat = "markdown" | "html";

function getPromptStyleInstructions(category: string) {
  switch (category) {
    case "creative":
      return "Generate imaginative, memorable names using metaphors, invented words, and unexpected combinations. Prioritize uniqueness and emotional resonance over literal meaning. Think brands like Spotify, Airbnb, or Figma.";
    case "professional":
      return "Create authoritative, trustworthy names using industry terminology and formal language. Focus on credibility and expertise. Include descriptive compounds and avoid casual language. Think consulting firms and enterprise software.";
    case "technical":
      return "Emphasize modern, tech-forward names using programming concepts, digital terminology, and innovation-focused language. Include references to APIs, data, cloud, AI, and emerging technologies.";
    case "playful":
      return "Generate fun, approachable names using wordplay, puns, alliteration, and lighthearted language. Create names that make people smile and feel engaged. Think consumer apps and entertainment brands.";
    case "minimalist":
      return "Focus on short, clean names (preferably 4-8 characters) using simple words and clear concepts. Avoid complexity, compound words, and unnecessary elements. Prioritize memorability through simplicity.";
    case "variations":
      return "Create multiple variations and alternatives for each input domain name (comma-separated). For each domain, generate synonyms, related terms, word combinations, and creative alternatives. Focus on maintaining the core concept while exploring different linguistic approaches, word orders, and combinations. Think of this as creating a family of related domain names for each input.";
    default:
      return "";
  }
}

function formatMarkdown(text: string): string {
  return text;
}

export function generateAiPrompt(
  aiTopic: string,
  selectedCategory: string,
  format: PromptFormat = "markdown",
) {
  const isVariations = selectedCategory === "variations";
  const topicText =
    aiTopic.trim() || (isVariations ? "[DOMAIN(S)]" : "[TOPIC]");
  const styleInstructions = getPromptStyleInstructions(selectedCategory);

  // Differences for variations mode
  const inputDescription = isVariations
    ? `based on the input domain(s): ${topicText}`
    : `for ${topicText}`;

  const requirements = isVariations
    ? `- The input may contain one or more domain names, separated by commas (e.g. "myapp, bestsite, coolbrand")
- For **each input domain**, create 3-5 categories of variations
- For **each input domain**, generate 15-25 domain variations per category`
    : `- Create 5-10 categories
- 15-25 domain variations per category`;

  const baseRequirements = `- Focus on brandable, memorable names
- No TLD extensions (no .com, .org, etc.)
- Use lowercase, no spaces or special characters
- ${isVariations ? "Base all variations on the input domain(s)" : "Make domains relevant to the topic/niche"}: ${topicText}
- Include variations like: action words, descriptive terms, compound words${isVariations ? ", creative alternatives" : ""}
- Prefer shorter domains when possible
- Avoid numbers or hyphens for better brandability`;

  const categoryGuidelines = isVariations
    ? `## Variation Categories (for each input domain):
- **Synonyms**: Use different words with similar meaning
- **Related Terms**: Words that are conceptually related
- **Word Combinations**: Combine with action words, descriptive terms
- **Creative Alternatives**: Invented words, wordplay, alliteration
- **Industry Variations**: Domain-specific terminology and concepts`
    : `## Category Guidelines:
- Create categories that make sense for the given topic or industry
- Categories should be distinct and cover different aspects, approaches, or sub-niches
- For example, for "fitness" you might use categories like "workout-apps", "nutrition-tracking", "personal-training", etc.
- If the input topic is very broad, focus on the most commercial, brandable, or startup-relevant aspects
- If the topic is unclear, interpret it in a business or startup context`;

  const rawPrompt = `Generate a **downloadable JSON file** for domain checking with categories and domain variations ${inputDescription}.

**CRITICAL**: I need an actual downloadable JSON file, not just JSON text displayed in the response. Create the file so I can save it locally.

Use this EXACT format:
\`\`\`json
{
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
}
\`\`\`

## Requirements:
${requirements}
${baseRequirements}

${categoryGuidelines}

## Domain Filtering - IMPORTANT:
**Before including any domain name, consider if it might already be taken by major online properties:**
- Exclude names that are obviously similar to well-known brands (Google, Facebook, Amazon, etc.)
- Avoid common dictionary words that major companies would likely own
- Skip generic terms that Fortune 500 companies or major startups would claim
- Don't include names that sound like existing major websites, apps, or services
- Think: "Would a major tech company, bank, retailer, or popular startup already own this?"
- When in doubt, lean toward more creative/invented names rather than obvious ones

**Focus on names that are:**
- Unique and unlikely to be taken by major properties
- Memorable and brandable
- Not too similar to existing major brands
- Creative rather than generic

${styleInstructions ? `## Prompt Style: ${PROMPT_CATEGORIES.find((c) => c.key === selectedCategory)?.label}\n${styleInstructions}` : ""}

Generate domain variations ${isVariations ? "for each input domain" : "specifically for"}: ${topicText}`;

  return format === "html" ? formatHtml(rawPrompt) : formatMarkdown(rawPrompt);
}
