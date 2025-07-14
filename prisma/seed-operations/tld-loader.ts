import * as fs from "fs";
import * as path from "path";

// Canonical category order for sortOrder
const TLD_CATEGORIES = [
  "Popular Generic",
  "Modern Generic",
  "Industry Specific",
  "Special",
  "Country Code",
  "Sponsored",
  "Infrastructure",
];

// Simple CSV parser function
function parseCSV(csvContent: string): any[] {
  const lines = csvContent.trim().split("\n");
  const headers = lines[0].split(",");

  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const obj: any = {};

    headers.forEach((header, index) => {
      const value = values[index]?.trim();

      // Convert boolean strings to actual booleans
      if (value === "true" || value === "false") {
        obj[header] = value === "true";
      } else {
        obj[header] = value;
      }
    });

    return obj;
  });
}

// Function to read and parse all TLD CSV files
export async function loadTLDsFromCSV(): Promise<any[]> {
  const dataDir = path.join(__dirname, "..", "data");
  const csvFiles = [
    "popular-generic-tlds.csv",
    "modern-generic-tlds.csv",
    "industry-specific-tlds.csv",
    "special-tlds.csv",
    "country-code-tlds.csv",
    "sponsored-tlds.csv",
    "infrastructure-tlds.csv",
  ];

  const allTLDs: any[] = [];

  for (const [catIdx, csvFile] of csvFiles.entries()) {
    const filePath = path.join(dataDir, csvFile);
    const category = TLD_CATEGORIES[catIdx];

    if (fs.existsSync(filePath)) {
      const csvContent = fs.readFileSync(filePath, "utf-8");
      const tlds = parseCSV(csvContent);
      tlds.forEach((tld, idx) => {
        tld.category = category;
        tld.sortOrder = catIdx * 1000 + idx; // Category order, then order within category
      });
      allTLDs.push(...tlds);
    } else {
      console.warn(`CSV file not found: ${filePath}`);
    }
  }

  return allTLDs;
}
