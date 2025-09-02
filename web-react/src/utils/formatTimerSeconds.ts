/**
 * Format seconds into "HH:MM:SS" (if hours>0) or "MM:SS" (if hours===0).
 * Minutes and seconds are always zero-padded to two digits.
 */
export function formatTimerSeconds(totalSeconds: number): string {
  const secs = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(secs / 3600);
  const minutes = Math.floor((secs % 3600) / 60);
  const seconds = secs % 60;

  const pad2 = (n: number) => String(n).padStart(2, "0");

  if (totalSeconds === 3600) {
    return `60:00`;
  } else if (hours > 0) {
    return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
  } else {
    return `${pad2(minutes)}:${pad2(seconds)}`;
  }
}
