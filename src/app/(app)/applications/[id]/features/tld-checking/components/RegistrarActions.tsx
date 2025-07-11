import { Button } from "@/primitives/button";
import type { Check, TLD } from "@prisma/client";

type CheckWithTld = Check & {
  tld: TLD;
};

interface RegistrarActionsProps {
  check: CheckWithTld;
  links: {
    namecheap: string;
    godaddy: string;
    porkbun: string;
    cloudflare: string;
    whois: string;
    icann: string;
  };
}

export function RegistrarActions({ check, links }: RegistrarActionsProps) {
  if (check.isAvailable !== true) {
    return null;
  }

  const registrars = [
    { name: "namecheap", label: "Namecheap", icon: "🛒" },
    { name: "godaddy", label: "GoDaddy", icon: "🏪" },
    { name: "porkbun", label: "Porkbun", icon: "🐷" },
    { name: "cloudflare", label: "Cloudflare", icon: "🔐" },
  ];

  return (
    <div className="mb-3 space-y-2">
      <div className="grid grid-cols-2 gap-1">
        {registrars.map((registrar) => {
          const linkKey = registrar.name as keyof typeof links;

          return (
            <Button
              key={registrar.name}
              href={links[linkKey]}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-2 py-1 text-xs"
              outline
            >
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1">
                  <span>{registrar.icon}</span>
                  <span>{registrar.label}</span>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
