export function timeStringToDate(dateStr: string, timeStr: string): Date {
  const [hour, minute] = timeStr.split(":").map(Number);
  const date = new Date(dateStr);
  date.setHours(hour, minute, 0, 0);
  return date;
}
