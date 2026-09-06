export const BATTLE_MESSAGES = {
  missingUsernames: "username1 and username2 are required.",
  sameUsername: "Choose two different players.",
  requiredField: (label: string) => `The ${label} field is required.`,
} as const;

export function isSameUsername(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase();
}
