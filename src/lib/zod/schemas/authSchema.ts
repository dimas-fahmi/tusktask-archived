import { z } from "zod";
import { NAME_REGEX, USERNAME_REGEX } from "../../configs";

// Name Schema
export const nameSchema = z
  .string()
  .trim()
  .min(1, { message: "Last name is required" })
  .max(50, { message: "Last name is too long" })
  .regex(NAME_REGEX, {
    message: "Name can only contain letters and spaces",
  });

// Email Schema
export const emailSchema = z.email();

// Username Schema
export const usernameSchema = z
  .string()
  .min(4, "Username must be at least 4 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(/^[a-z]/, "Username must start with a lowercase letter")
  .regex(/[a-z0-9]$/, "Username must end with a lowercase letter or number")
  .regex(/^(?!.*[_-]{2})/, "Username cannot have consecutive symbols")
  .regex(
    /^(?!.*[_-].*[_-])/,
    "Username can only contain one symbol ('_' or '-')"
  )
  .regex(USERNAME_REGEX, "Username contains invalid characters or format");

// Password Schema
export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[a-z]/, {
    message: "Password must include at least one lowercase letter",
  })
  .regex(/[A-Z]/, {
    message: "Password must include at least one uppercase letter",
  })
  .regex(/[0-9]/, { message: "Password must include at least one number" })
  .regex(/[^a-zA-Z0-9]/, {
    message: "Password must include at least one special character",
  });

// Confirmation Schema
export const passwordConfirmationSchema = z
  .string()
  .min(1, { message: "Password confirmation is required" });

// Sign In Schema
export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

//  Registration Schema
export const registrationSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    passwordConfirmation: passwordConfirmationSchema,
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "Passwords do not match",
  });

// Password reset schema
export const passwordResetSchema = z
  .object({
    password: passwordSchema,
    passwordConfirmation: passwordConfirmationSchema,
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "Passwords do not match",
  });
