import {
  Bebas_Neue,
  Cormorant_Garamond,
  Fira_Code,
  Fira_Sans,
  Inter,
  JetBrains_Mono,
  Jost,
  Merriweather,
  Nunito_Sans,
  Orbitron,
  Oswald,
  Playfair_Display,
  Poppins,
  Roboto,
  Space_Grotesk,
  Space_Mono,
} from "next/font/google";

// Default theme
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

export const spaceMonoFont = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Inter (Modern Minimalist)
export const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Merriweather + Playfair Display (Editorial)
export const playfairFont = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});
export const merriweatherFont = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

// Orbitron + JetBrains Mono (Tech/Futuristic)
export const orbitronFont = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
export const jetbrainsFont = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

// Poppins + Nunito Sans (Friendly)
export const poppinsFont = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});
export const nunitoFont = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "700", "800", "900"],
});

// Bebas Neue + Roboto (Bold Personality)
export const bebasFont = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: ["400"], // Only one available
});
export const robotoFont = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

// Cormorant Garamond + Jost (Creative Studio)
export const cormorantFont = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
export const jostFont = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

// Fira Code + Fira Sans (Developer / Terminal)
export const firaCodeFont = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
export const firaSansFont = Fira_Sans({
  variable: "--font-fira-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const fontsVariables = `${oswaldFont.variable} ${spaceGroteskFont.variable} ${spaceMonoFont.variable} ${interFont.variable} ${playfairFont.variable} ${merriweatherFont.variable} ${orbitronFont.variable} ${jetbrainsFont.variable} ${poppinsFont.variable} ${nunitoFont.variable} ${bebasFont.variable} ${robotoFont.variable} ${cormorantFont.variable} ${jostFont.variable} ${firaCodeFont.variable} ${firaSansFont.variable}`;
