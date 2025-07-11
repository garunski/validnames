export interface EmailVerificationData {
  email: string;
  userName: string;
  token: string;
}

export interface PasswordResetData {
  email: string;
  userName: string;
  token: string;
}

export interface WelcomeEmailData {
  email: string;
  userName: string;
}

export interface EmailTemplateProps {
  userName: string;
  verificationLink?: string;
  resetLink?: string;
  loginLink?: string;
}
