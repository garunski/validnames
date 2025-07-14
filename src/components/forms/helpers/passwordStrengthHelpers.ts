import { PasswordStrength } from "../../../validators/passwordPolicyValidator";

export const getStrengthColor = (strength: PasswordStrength) => {
  switch (strength) {
    case PasswordStrength.VERY_WEAK:
      return "bg-red-500";
    case PasswordStrength.WEAK:
      return "bg-orange-500";
    case PasswordStrength.MEDIUM:
      return "bg-yellow-500";
    case PasswordStrength.STRONG:
      return "bg-blue-500";
    case PasswordStrength.VERY_STRONG:
      return "bg-green-500";
    default:
      return "bg-gray-300";
  }
};

export const getStrengthText = (strength: PasswordStrength) => {
  switch (strength) {
    case PasswordStrength.VERY_WEAK:
      return "Very Weak";
    case PasswordStrength.WEAK:
      return "Weak";
    case PasswordStrength.MEDIUM:
      return "Medium";
    case PasswordStrength.STRONG:
      return "Strong";
    case PasswordStrength.VERY_STRONG:
      return "Very Strong";
    default:
      return "Unknown";
  }
};

export const getProgressWidth = (score: number) => {
  return Math.min(100, Math.max(0, score));
};
