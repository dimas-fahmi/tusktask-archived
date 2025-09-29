// APP CONFIGS
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "TuskTask";
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://tusktask.dimasfahmi.pro";
export const APP_LOGO_SYMBOLIC =
  process.env.NEXT_PUBLIC_LOGO_SYMBOLIC ||
  "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/logo/tusktask.png";
export const APP_LOGO_WORDMARK =
  process.env.NEXT_PUBLIC_LOGO_WORDMARK ||
  "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/logo/tusktask-wordmark.png";
export const OG_IMAGE =
  process.env.NEXT_PUBLIC_OG_IMAGE ||
  "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/landing/You%20Just%20Killed%20Your%20Plant%20Again%2C%20Didn%E2%80%99t%20You.png";
export const TWITTER_IMAGE =
  process.env.NEXT_PUBLIC_TWITTER_IMAGE ||
  "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/landing/You%20Just%20Killed%20Your%20Plant%20Again%2C%20Didn%E2%80%99t%20You.png";
export const TWITTER_HANDLER =
  process.env.NEXT_PUBLIC_TWITTER_HANDLER || "@tusktask";
export const DEFAULT_TITLE = "We'll Remember It For You";
export const DEFAULT_DESCRIPTION =
  "TuskTask is a handy productivity app that helps you manage your tasks, sends reminders for events and deadlines, and includes a Pomodoro feature to help you stay focused by breaking tasks into intervals.";
export const APP_KEYWORDS = [
  "TuskTask",
  "Productivity",
  "Reminder",
  "ADHD Coping Platform",
];

// IDs
export const VERCEL_BLOB_ID = "zvgpixcwdvbogm3e";

// HOSTs
export const VERCEL_BLOB_HOST = `https://${VERCEL_BLOB_ID}.public.blob.vercel-storage.com/tusktask`;
export const SUPABASE_AUTH_HOST = "https://xyjrsrcveoqyerxaaanp.supabase.co";

// NAVIGATIONS
export const NAVIGATIONS = [
  {
    title: "About Us",
    href: "/",
    external: false,
  },
  {
    title: "Use Cases",
    href: "#UseCases",
    external: false,
  },
  {
    title: "Policy",
    href: "/policy",
    external: false,
  },
  {
    title: "Repo",
    href: "https://github.com/dimas-fahmi/tusktask",
    external: true,
  },
  {
    title: "Contact",
    href: "#contact",
    external: true,
  },
];

// REGEXs
export const USERNAME_REGEX =
  /^(?!.*[_-]{2})(?!.*[_-].*[_-])^[a-z](?:[a-z0-9]*[_-]?[a-z0-9]+)*$/;

export const NAME_REGEX = /^[a-zA-Z ]*$/;

// DEFAULTS
export const DEFAULT_AVATARS = [
  "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/defaults/sam-the-siam.png",
  "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/defaults/penny-the-persian.png",
  "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/defaults/gerrard-the-ginger.png",
  "https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/defaults/bernard-the-boxer.png",
];
export const DEFAULT_EMAIL_COOLDOWN = 1000 * 60 * 5;
export const DEFAULT_NO_IMAGE_SQUARE = "/no-image-square.jpg";
export const DEFAULT_NO_IMAGE_WIDE = "/no-image-wide.jpg";

// IMAGES CONFIGURATIONS
export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];
export const ALLOWED_IMAGE_MAX_MIME_SIZE = 1024 * 1024 * 5;

// OAuths Providers
export const OAUTH_PROVIDERS = ["google", "discord", "github"] as const;
export type AuthProvider = (typeof OAUTH_PROVIDERS)[number];

// ROUTES
export const PROTECTED_ROUTES = ["/dashboard", "/auth/registration"];

// ONBOARDING STEPS
export const ONBOARDING_STEPS = [
  "name",
  "username",
  "avatar",
  "confirmation",
  "completed",
] as const;
