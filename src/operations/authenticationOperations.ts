import { z } from "zod";

export const turnstileTokenSchema = z.object({
  turnstileToken: z.string().min(1, "Please complete the security check"),
});

export const emailWithTurnstileSchema = z.object({
  email: z.string().email(),
  turnstileToken: z.string().min(1, "Please complete the security check"),
});

export { validateEmailWithTurnstileToken } from "./turnstile/validateEmailWithTurnstileToken";
export { validateRequestTurnstileToken } from "./turnstile/validateRequestTurnstileToken";
export { validateStandardTurnstileToken } from "./turnstile/validateStandardTurnstileToken";
export { validateTurnstileTokenDirectly } from "./turnstile/validateTurnstileTokenDirectly";
