interface UseDomainSelectionProps {
  currentInputValue?: string;
  onAddToInput: (domainName: string) => void;
  onSelectVariationsPrompt?: () => void;
}

export function useDomainSelection({
  currentInputValue,
  onAddToInput,
  onSelectVariationsPrompt,
}: UseDomainSelectionProps) {
  const handleAddDomain = (domainName: string) => {
    const currentValue = currentInputValue || "";
    const domains = currentValue
      .split(",")
      .map((d) => d.trim())
      .filter((d) => d);

    if (domains.includes(domainName)) {
      // Domain already exists, remove it
      const newDomains = domains.filter((d) => d !== domainName);
      onAddToInput(newDomains.join(", "));
    } else {
      // Add new domain
      const newDomains = [...domains, domainName];
      onAddToInput(newDomains.join(", "));
    }

    onSelectVariationsPrompt?.();
  };

  const isDomainSelected = (domainName: string) => {
    const currentValue = currentInputValue || "";
    const domains = currentValue
      .split(",")
      .map((d) => d.trim())
      .filter((d) => d);
    return domains.includes(domainName);
  };

  return {
    handleAddDomain,
    isDomainSelected,
  };
}
