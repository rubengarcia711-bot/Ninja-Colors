const PREMIUM_KEY = 'ninja-coloring-premium';

export function isPremium(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(PREMIUM_KEY) === 'true';
}

export function setPremium(value: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PREMIUM_KEY, value ? 'true' : 'false');
}

export function restorePurchase(): boolean {
  return isPremium();
}
