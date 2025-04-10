const shortPattern = /^([\w\säöüßÄÖÜ]+)\s(\d+\/?\d*\/?\d*)$/;
const longPattern =
  /^([\w\säöüßÄÖÜ]+)\s(\d+\/?\d*\/?\d*),\s(\d+)\s([\w\säöüßÄÖÜ]+)$/;

export function isValidAddress(query: string): boolean {
  const match: string[] | null = query.match(shortPattern);
  return match ? true : Boolean(query.match(longPattern));
}
