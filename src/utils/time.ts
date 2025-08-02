export function timeStringToDate(dateStr: string, timeStr: string): Date {
  return new Date(`${dateStr}T${timeStr}:00+07:00`);
}