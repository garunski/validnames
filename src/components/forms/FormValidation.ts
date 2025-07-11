import { FormField } from "./FormField";

export function validateField(field: FormField, value: string) {
  if (field.validate) {
    return field.validate(value);
  }
  return undefined;
}

export function validateAllFields(
  fields: FormField[],
  formData: Record<string, string>,
) {
  const errors: Record<string, string | undefined> = {};
  fields.forEach((field) => {
    const value = formData[field.name] || "";
    const error = validateField(field, value);
    if (error) {
      errors[field.name] = error;
    }
  });
  return errors;
}

export function hasValidationErrors(
  errors: Record<string, string | undefined>,
) {
  return Object.values(errors).some(Boolean);
}
