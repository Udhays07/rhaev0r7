import { useEffect, useState } from 'react';

/** Reads a CSS custom property and re-reads it whenever the theme changes. */
export function useCssColor(name: string) {
  const read = () => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#ffffff';
  const [value, setValue] = useState(read);

  useEffect(() => {
    const observer = new MutationObserver(() => setValue(read()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, [name]);

  return value;
}
