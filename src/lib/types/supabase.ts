export type RegistrationPhase =
  | "name"
  | "username"
  | "avatar"
  | "confirmation"
  | "completed";

export interface UserMetadata {
  registration_phase?: RegistrationPhase;
}
