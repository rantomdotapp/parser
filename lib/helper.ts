import dayjs from 'dayjs';

export async function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

// standard timestamp UTC
export function getTimestamp(): number {
  return Math.floor(new Date().getTime() / 1000);
}

export function getTodayUTCTimestamp() {
  const today = new Date().toISOString().split('T')[0];
  return Math.floor(new Date(today).getTime() / 1000);
}

// get start day timestamp of a timestamp
export function getStartDayTimestamp(timestamp: number) {
  const theDay = new Date(timestamp * 1000).toISOString().split('T')[0];
  return Math.floor(new Date(theDay).getTime() / 1000);
}

export function stringReplaceAll(str: string, search: string, replacement: string) {
  return str.replace(new RegExp(search, 'g'), replacement);
}

export function normalizeAddress(address: string | undefined): string {
  return address ? address.toLowerCase() : '';
}

export function compareAddress(address1: string, address2: string): boolean {
  return normalizeAddress(address1) === normalizeAddress(address2);
}

export function formatTime(unix: number): string {
  const now = dayjs();
  const timestamp = dayjs.unix(unix);

  const inSeconds = now.diff(timestamp, 'second');
  const inMinutes = now.diff(timestamp, 'minute');
  const inHours = now.diff(timestamp, 'hour');
  const inDays = now.diff(timestamp, 'day');

  if (inHours >= 24) {
    return `${inDays} ${inDays === 1 ? 'day' : 'days'} ago`;
  } else if (inMinutes >= 60) {
    return `${inHours} ${inHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (inSeconds >= 60) {
    return `${inMinutes} ${inMinutes === 1 ? 'min' : 'mins'} ago`;
  } else {
    return `${inSeconds} ${inSeconds === 1 ? 'sec' : 'secs'} ago`;
  }
}
