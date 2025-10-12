export function formatFileSize(bytes?: number): string {
  if (!bytes) return "N/A";

  const KB = 1024;
  const MB = KB * 1024;

  if (bytes >= MB) {
    return `${(bytes / MB).toFixed(1)}MB`;
  } else {
    return `${Math.round(bytes / KB)}KB`;
  }
}
