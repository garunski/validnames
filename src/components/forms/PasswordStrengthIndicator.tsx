import { validatePassword } from "../../validators/passwordPolicyValidator";
import { RequirementItem } from "./components/RequirementItem";
import {
  getProgressWidth,
  getStrengthColor,
  getStrengthText,
} from "./helpers/passwordStrengthHelpers";

interface PasswordStrengthIndicatorProps {
  password: string;
  userInfo?: { email?: string; name?: string };
  showSuggestions?: boolean;
}

/**
 * Password strength indicator component
 * Shows real-time password strength feedback with visual indicators
 */
export function PasswordStrengthIndicator({
  password,
  userInfo,
  showSuggestions = true,
}: PasswordStrengthIndicatorProps) {
  const validation = validatePassword(password, userInfo);

  if (!password) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Password Strength</span>
          <span className="font-medium">
            {getStrengthText(validation.strength)}
          </span>
        </div>

        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(
              validation.strength,
            )}`}
            style={{ width: `${getProgressWidth(validation.score)}%` }}
          />
        </div>

        <div className="text-xs text-gray-500">
          Score: {validation.score}/100
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-1">
        <div className="text-sm font-medium text-gray-700">Requirements:</div>
        <div className="space-y-1 text-sm">
          <RequirementItem
            met={password.length >= 12}
            text="At least 12 characters"
          />
          <RequirementItem
            met={/[A-Z]/.test(password)}
            text="One uppercase letter"
          />
          <RequirementItem
            met={/[a-z]/.test(password)}
            text="One lowercase letter"
          />
          <RequirementItem met={/\d/.test(password)} text="One number" />
          <RequirementItem
            met={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)}
            text="One special character"
          />
        </div>
      </div>

      {/* Errors */}
      {validation.errors.length > 0 && (
        <div className="space-y-1">
          <div className="text-sm font-medium text-red-600">Issues:</div>
          <div className="space-y-1">
            {validation.errors.map((error, index) => (
              <div
                key={index}
                className="flex items-center text-sm text-red-600"
              >
                <span className="mr-2">•</span>
                {error}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {validation.warnings.length > 0 && (
        <div className="space-y-1">
          <div className="text-sm font-medium text-orange-600">Warnings:</div>
          <div className="space-y-1">
            {validation.warnings.map((warning, index) => (
              <div
                key={index}
                className="flex items-center text-sm text-orange-600"
              >
                <span className="mr-2">•</span>
                {warning}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {showSuggestions && validation.suggestions.length > 0 && (
        <div className="space-y-1">
          <div className="text-sm font-medium text-blue-600">Suggestions:</div>
          <div className="space-y-1">
            {validation.suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-center text-sm text-blue-600"
              >
                <span className="mr-2">•</span>
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
