export function formatHtml(text: string): string {
  // Split into lines for processing
  const lines = text.split("\n");
  const result: string[] = [];
  let inCodeBlock = false;
  let inList = false;
  let listItems: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Handle code blocks
    if (trimmedLine.startsWith("```")) {
      if (!inCodeBlock) {
        // Start of code block
        inCodeBlock = true;
        const language = trimmedLine.slice(3).trim();
        result.push(
          `<pre class="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg overflow-x-auto text-sm font-mono my-2"><code class="language-${language}">`,
        );
      } else {
        // End of code block
        inCodeBlock = false;
        result.push("</code></pre>");
      }
      continue;
    }

    if (inCodeBlock) {
      result.push(line);
      continue;
    }

    // Handle headers
    if (trimmedLine.startsWith("# ")) {
      result.push(
        `<h1 class="text-2xl font-bold mb-2">${trimmedLine.slice(2)}</h1>`,
      );
      continue;
    }
    if (trimmedLine.startsWith("## ")) {
      result.push(
        `<h2 class="text-xl font-semibold mb-2">${trimmedLine.slice(3)}</h2>`,
      );
      continue;
    }
    if (trimmedLine.startsWith("### ")) {
      result.push(
        `<h3 class="text-lg font-medium mb-2">${trimmedLine.slice(4)}</h3>`,
      );
      continue;
    }

    // Handle list items
    if (trimmedLine.startsWith("- ")) {
      if (!inList) {
        inList = true;
        listItems = [];
      }
      const listContent = trimmedLine.slice(2);
      listItems.push(
        `<li class="mb-0.5">${formatInlineMarkdown(listContent)}</li>`,
      );
      continue;
    }

    // End list if we were in one and hit a non-list item
    if (inList && trimmedLine !== "") {
      result.push(
        `<ul class="list-disc space-y-0.5 mb-2 ml-4">${listItems.join("")}</ul>`,
      );
      inList = false;
      listItems = [];
    }

    // Handle empty lines
    if (trimmedLine === "") {
      if (inList) {
        result.push(
          `<ul class="list-disc space-y-0.5 mb-2 ml-4">${listItems.join("")}</ul>`,
        );
        inList = false;
        listItems = [];
      }
      result.push("<br>");
      continue;
    }

    // Handle regular paragraphs
    result.push(`<p class="mb-2">${formatInlineMarkdown(trimmedLine)}</p>`);
  }

  // Close any remaining list
  if (inList) {
    result.push(
      `<ul class="list-disc space-y-0.5 mb-2 ml-4">${listItems.join("")}</ul>`,
    );
  }

  return result.join("\n");
}

function formatInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    .replace(
      /`(.+?)`/g,
      '<code class="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>',
    );
}
