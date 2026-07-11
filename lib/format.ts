export function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function priceTier(tier: 1 | 2 | 3): string {
  return "$".repeat(tier);
}
