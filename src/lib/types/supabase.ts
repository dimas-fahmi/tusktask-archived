import type { ONBOARDING_STEPS } from "../configs";

export type RegistrationPhase = (typeof ONBOARDING_STEPS)[number];

export interface UserMetadata {
  registration_phase?: RegistrationPhase;
  avatar_url?: string;
  email?: string;
  email_verified?: string;
  full_name?: string;
  iss?: string;
  name?: string;
  phone_verified?: boolean;
  preferred_username?: string;
  provider_id?: string;
  sub?: string;
  user_name?: string;
}

export interface EmailStatus {
  email_confirmed_at: string;
  confirmation_sent_at: string;
  recovery_sent_at: string;
}
