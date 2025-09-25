import { Oswald, Space_Grotesk } from "next/font/google";

export const oswaldFont = Oswald({
  variable: "--font-oswald",
  weight: ["200", "300", "400", "500", "600", "700"],
  display: "swap",
  subsets: ["latin"],
});

export const spaceGroteskFont = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
