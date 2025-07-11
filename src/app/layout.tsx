import "@/styles/tailwind.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import React from "react";
import ReactQueryProvider from "./reactQueryProvider";
import { validateStartupEnvironment } from "./startupValidation";

// Validate environment variables on startup
if (typeof window === "undefined") {
  // Only run on server side
  try {
    validateStartupEnvironment();
  } catch (error) {
    console.error(
      "Critical: Application startup failed due to environment validation errors:",
      error,
    );
    // In production, you might want to exit the process here
    if (process.env.NODE_ENV === "production") {
      console.error("Exiting due to critical environment validation failure");
      process.exit(1);
    }
  }
}

export const metadata: Metadata = {
  title: {
    template: "%s - Valid Names",
    default: "Valid Names",
  },
  description:
    "Check domain availability across multiple TLDs with batch processing capabilities.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="text-zinc-950 antialiased lg:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:lg:bg-zinc-950"
    >
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
