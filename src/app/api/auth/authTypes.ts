// Authentication and user related types
export type AppUser = {
  id: string;
  name?: string;
  email?: string;
};

// Enhanced user settings type
export type UserSettings = {
  id: string;
  userId: string;
  selectedTldExtensions: string[]; // Parsed from JSON string - contains TLD extensions like [".com", ".org"]
  preferences: Record<string, unknown>; // Parsed from JSON string for other preferences
  createdAt: Date;
  updatedAt: Date;
};
