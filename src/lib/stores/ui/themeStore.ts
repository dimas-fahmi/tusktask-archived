import { create } from "zustand";
import { APP_THEMES, AppTheme } from "../../configs";

export interface ThemeStore {
  // Theme State
  activeTheme: AppTheme;
  setActiveTheme: (n: AppTheme) => void;

  // Theme Modal Picker
  themePickerDialogOpen: boolean;
  setThemePickerDialogOpen: (n: boolean) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  activeTheme: APP_THEMES["default"],
  setActiveTheme: (n) => set({ activeTheme: n }),
  themePickerDialogOpen: false,
  setThemePickerDialogOpen: (n) => set({ themePickerDialogOpen: n }),
}));
