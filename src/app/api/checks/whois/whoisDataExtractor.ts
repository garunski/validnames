import { ExtractedData } from "./whoisTypes";

export function extractWhoisData(
  whoisData: Record<string, unknown>,
): ExtractedData {
  let createdDate: Date | null = null;
  let expiryDate: Date | null = null;
  let updatedDate: Date | null = null;
  let registrar: string | null = null;
  const securityFeatures: string[] = [];
  let dnssec: string | null = null;

  // Extract data from WHOIS response
  for (const serverData of Object.values(whoisData)) {
    if (serverData && typeof serverData === "object") {
      const data = serverData as Record<string, unknown>;

      // Extract registrar
      if (!registrar && (data["Registrar"] || data["registrar"])) {
        registrar = (data["Registrar"] || data["registrar"]) as string;
      }

      // Extract dates
      if (!createdDate) {
        const createdFields = [
          "Created Date",
          "Creation Date",
          "created",
          "creation date",
        ];
        for (const field of createdFields) {
          if (data[field]) {
            createdDate = new Date(data[field] as string | number | Date);
            break;
          }
        }
      }

      if (!expiryDate) {
        const expiryFields = [
          "Expiry Date",
          "Expiration Date",
          "Registry Expiry Date",
          "expiry date",
        ];
        for (const field of expiryFields) {
          if (data[field]) {
            expiryDate = new Date(data[field] as string | number | Date);
            break;
          }
        }
      }

      if (!updatedDate) {
        const updatedFields = ["Updated Date", "Last Updated", "updated date"];
        for (const field of updatedFields) {
          if (data[field]) {
            updatedDate = new Date(data[field] as string | number | Date);
            break;
          }
        }
      }

      // Extract security features
      const domainStatus = data["Domain Status"] || data["status"] || [];
      if (Array.isArray(domainStatus)) {
        if (
          domainStatus.some((status) =>
            status.includes("clientDeleteProhibited"),
          )
        ) {
          securityFeatures.push("Delete Protection");
        }
        if (
          domainStatus.some((status) =>
            status.includes("clientTransferProhibited"),
          )
        ) {
          securityFeatures.push("Transfer Protection");
        }
        if (
          domainStatus.some((status) =>
            status.includes("clientUpdateProhibited"),
          )
        ) {
          securityFeatures.push("Update Protection");
        }
      }

      // Extract DNSSEC
      if (!dnssec && (data["DNSSEC"] || data["dnssec"])) {
        dnssec = (data["DNSSEC"] || data["dnssec"]) as string;
      }
    }
  }

  return {
    createdDate,
    expiryDate,
    updatedDate,
    registrar,
    securityFeatures,
    dnssec,
  };
}
