import { create } from "zustand";
import type React from "react";
import type { RegistrationPhase, UserMetadata } from "../../types/supabase";

export interface UseOnboardingStore {
  // RegistrationPhase
  registrationPhase?: RegistrationPhase;

  // UserMetadata
  userMetadata?: UserMetadata;

  // UI
  title: string;
  subtitle: string;
  render: React.ReactNode;

  // Setter
  setter: (n: Partial<Omit<UseOnboardingStore, "setter">>) => void;
}

export const useOnboardingStore = create<UseOnboardingStore>((set) => ({
  registrationPhase: "name",
  userMetadata: undefined,
  title: "",
  subtitle: "",
  render: <></>,

  // Setter
  setter: (n) => set(() => ({ ...n })),
}));
