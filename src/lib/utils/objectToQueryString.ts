export function objectToQueryString(
  obj: Record<string, string | null | undefined>,
): string {
  if (!obj) return "";
  return Object.entries(obj)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${
          // biome-ignore lint/style/noNonNullAssertion: IT'S ALWAYS EXIST
          encodeURIComponent(value!)
        }`,
    )
    .join("&");
}
