import { Chonburi, Plus_Jakarta_Sans } from "next/font/google";

export const chonburyFont = Chonburi({
  variable: "--chonburi-font",
  weight: ["400"],
  display: "swap",
  subsets: ["latin"],
});

export const plusJakartaSansFont = Plus_Jakarta_Sans({
  variable: "--plus-jakarta-sans-font",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
  subsets: ["latin"],
});
