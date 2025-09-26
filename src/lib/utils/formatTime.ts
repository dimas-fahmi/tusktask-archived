export function formatTime(ms: number) {
  const totalSeconds = Math.ceil(ms / 1000); // round up to nearest second
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
