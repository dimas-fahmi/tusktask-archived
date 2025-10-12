import type { Metadata } from "next";
import {
  APP_KEYWORDS,
  APP_NAME,
  APP_URL,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  OG_IMAGE,
  TWITTER_HANDLER,
  TWITTER_IMAGE,
} from "../configs";

/**
 * Generates a fully populated Next.js `Metadata` object for SEO and social sharing.
 *
 * This helper merges provided overrides with global defaults using consistent
 * title handling and deep merging for nested objects like OpenGraph and Twitter.
 *
 * @param revision - Optional metadata overrides for customizing per-page metadata
 *   - Use this to customize title, description, Open Graph, or Twitter data
 *   - Supports partial overrides for nested objects (OpenGraph, Twitter)
 *   - Any missing fields will fall back to sensible defaults
 *
 * @returns Complete `Metadata` object ready for Next.js to inject into `<head>`
 *
 * @example
 * ```ts
 * // Default metadata - homepage
 * export const metadata = generateMetadata();
 *
 * // Task page with custom title
 * export const metadata = generateMetadata({
 *   title: "My Tasks",
 *   description: "View and manage all your tasks in TuskTask",
 * });
 *
 * // Feature page with custom OpenGraph
 * export const metadata = generateMetadata({
 *   title: "Pomodoro Timer",
 *   description: "Stay focused with TuskTask's built-in Pomodoro timer",
 *   openGraph: {
 *     url: `${APP_URL}/features/pomodoro`,
 *     images: [{ url: "/pomodoro-screenshot.jpg", width: 1200, height: 630 }],
 *   },
 * });
 *
 * ```
 */
export function generateMetadata(revision?: Partial<Metadata>): Metadata {
  // Construct Values
  const title = `${revision?.title ?? DEFAULT_TITLE} | ${APP_NAME}`;
  const description = revision?.description ?? DEFAULT_DESCRIPTION;

  const metadata: Metadata = {
    title: title,
    description: description,
    keywords: revision?.keywords ?? APP_KEYWORDS,
    authors: revision?.authors ?? [
      {
        name: APP_NAME,
        url: APP_URL,
      },
    ],
    openGraph: {
      title: title,
      description: description,
      url: APP_URL,
      siteName: APP_NAME,
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: DEFAULT_TITLE,
        },
      ],
      locale: "en_US",
      type: "website",
      ...revision?.openGraph,
    },
    twitter: {
      title: title,
      description: description,
      images: [TWITTER_IMAGE],
      site: TWITTER_HANDLER,
      creator: TWITTER_HANDLER,
      card: "summary_large_image",
      ...revision?.twitter,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
  return metadata;
}
