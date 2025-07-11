"use client";

import { Button } from "@/primitives/button";
import {
  ArrowDownTrayIcon,
  BookOpenIcon,
  SparklesIcon,
} from "@heroicons/react/20/solid";

interface QuickActionsSidebarProps {
  onResetAiTopic: () => void;
  setHelpTab?: (tab: string) => void;
  helpTab?: string;
}

export function QuickActionsSidebar({
  onResetAiTopic,
  setHelpTab,
}: QuickActionsSidebarProps) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Quick Actions
      </h3>

      <div className="space-y-3">
        <Button
          outline
          className="w-full justify-center"
          onClick={() => setHelpTab?.("help")}
        >
          <ArrowDownTrayIcon className="size-4 !text-blue-500" />
          Download Sample File
        </Button>

        <Button
          outline
          className="w-full justify-center"
          onClick={() => setHelpTab?.("help")}
        >
          <BookOpenIcon className="size-4 !text-purple-500" />
          View Documentation
        </Button>

        <Button
          outline
          className="w-full justify-center"
          onClick={() => {
            setHelpTab?.("prompt");
            onResetAiTopic();
          }}
        >
          <SparklesIcon className="size-4 !text-yellow-500" />
          AI Generator
        </Button>
      </div>
    </div>
  );
}
