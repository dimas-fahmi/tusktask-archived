export type RegistrationPhase =
  | "name"
  | "username"
  | "avatar"
  | "confirmation"
  | "completed";

export interface UserMetadata {
  registration_phase?: RegistrationPhase;
}

export interface EmailStatus {
  email_confirmed_at: string;
  confirmation_sent_at: string;
  recovery_sent_at: string;
}
