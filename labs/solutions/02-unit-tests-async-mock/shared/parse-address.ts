import { Address } from './address';

export function parseAddress(query: string): Address | null {
  const shortPattern = /^([\w\s]+)\s(\d+)$/;
  const longPattern = /^([\w\s]+)\s(\d+),\s(\d+)\s([\w\s]+)$/;
  let match: string[] | null = query.match(shortPattern);

  if (match) {
    return { street: match[1], streetNumber: match[2] };
  } else {
    match = query.match(longPattern);
    if (match) {
      return {
        street: match[1],
        streetNumber: match[2],
        zip: match[3],
        city: match[4]
      };
    }
  }

  return null;
}
