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
  createdAt: Date;
  updatedAt: Date;
};
