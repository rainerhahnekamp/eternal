export function isValidAddress(query: string): boolean {
  const shortPattern = /^([\w\s]+)\s(\d+)$/;
  const longPattern = /^([\w\s]+)\s(\d+),\s(\d+)\s([\w]+)$/;
  let match: string[] | null = query.match(shortPattern);

  if (match) {
    return true;
  } else {
    match = query.match(longPattern);
    return Boolean(match);
  }
}
