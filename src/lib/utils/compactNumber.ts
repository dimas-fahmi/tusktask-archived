export function compactNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "00";
  }

  if (value < 100) {
    return value.toString().padStart(2, "0");
  }

  if (value < 1000) {
    return value.toString();
  }

  if (value < 1_000_000) {
    const truncated = Math.floor(value / 100) / 10; // e.g., 1259 => 12.5 => 1.2
    return `${truncated.toFixed(1).replace(/\.0$/, "")}k`;
  }

  const truncated = Math.floor(value / 100_000) / 10;
  return `${truncated.toFixed(1).replace(/\.0$/, "")}M`;
}
