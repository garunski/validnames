// Import Prisma types for local use
import type { Application, Category, Check, Domain, TLD } from "@prisma/client";

// Re-export Prisma types for convenience
export type {
  Application,
  Category,
  Check,
  Domain,
  UserSettings as PrismaUserSettings,
  TLD,
} from "@prisma/client";

// Enhanced types for components
export type ApplicationWithCategories = Application & {
  categories: Category[];
};

export type CategoryWithRelations = Category & {
  domains: DomainWithRelations[];
  application: Application;
};

export type ApplicationWithCategoriesAndTlds = ApplicationWithCategories & {
  selectedTldExtensions: string[];
};

export type DomainWithRelations = Domain & {
  checks: (Check & { tld: TLD })[];
  category: Category;
};
