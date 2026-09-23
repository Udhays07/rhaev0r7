import { useEffect, useState } from 'react';

const formatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Kolkata',
});

/** Current time in India, refreshed every 15s. */
export function useLocalTime() {
  const [time, setTime] = useState(() => formatter.format(new Date()));
  useEffect(() => {
    const id = window.setInterval(() => setTime(formatter.format(new Date())), 15_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}
