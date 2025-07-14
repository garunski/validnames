// Re-export functions from split files for backward compatibility
export {
  passwordSchema,
  validatePassword,
  type PasswordValidationResult,
} from "./passwordPolicyEnforcer";
export {
  PASSWORD_POLICY,
  PasswordStrength,
  calculatePasswordScore,
  getPasswordStrength,
  isCommonPassword,
} from "./passwordStrengthCalculator";
