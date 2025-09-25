import { Oswald, Plus_Jakarta_Sans } from "next/font/google";

export const oswaldFont = Oswald({
  variable: "--oswald-font",
  weight: ["200", "300", "400", "500", "600", "700"],
  display: "swap",
  subsets: ["latin"],
});

export const plusJakartaSansFont = Plus_Jakarta_Sans({
  variable: "--plus-jakarta-sans-font",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
  subsets: ["latin"],
});
