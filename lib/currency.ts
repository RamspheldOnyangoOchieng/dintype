/**
 * Currency Formatting Utilities
 * 
 * Provides consistent currency formatting across the application
 * following USD/EUR/English conventions.
 */

/**
 * Format a price
 */
export function formatCurrency(
  amount: number,
  options: {
    includeDecimals?: boolean;
    compact?: boolean;
    currency?: string;
    locale?: string;
  } = {}
): string {
  const {
    includeDecimals = true,
    compact = false,
    currency = 'USD',
    locale = 'en-US'
  } = options;

  // For EUR, we might want a different locale
  const activeLocale = currency === 'EUR' ? 'de-DE' : locale;

  const formatted = new Intl.NumberFormat(activeLocale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(amount);

  // Add space after symbol and ensure symbol is at the front for USD/EUR in this app's style
  return formatted.replace(/([$€£]|kr)/g, '$1 ').trim();
}

/**
 * Convenience formatters
 */
export const formatUSD = (amount: number, includeDecimals = true) =>
  formatCurrency(amount, { currency: 'USD', locale: 'en-US', includeDecimals });

export const formatEUR = (amount: number, includeDecimals = true) =>
  formatCurrency(amount, { currency: 'EUR', locale: 'de-DE', includeDecimals });

/**
 * Format in both USD and EUR
 */
export const formatDual = (amountUSD: number, amountEUR: number) => {
  return `${formatUSD(amountUSD)} / ${formatEUR(amountEUR)}`;
};

/**
 * Alias for backward compatibility - now returns USD
 */
export const formatSEK = (amount: number) => formatUSD(amount);

/**
 * Format token package price with equivalent images
 */
export function formatTokenPackagePrice(tokens: number, price: number, currency: string = 'USD'): {
  price: string;
  tokens: string;
  images: string;
  full: string;
} {
  const images = Math.floor(tokens / 5); // Assuming 5 tokens per image
  const formattedPrice = formatCurrency(price, { currency });

  return {
    price: formattedPrice,
    tokens: `${tokens} tokens`,
    images: `~${images} images`,
    full: `${formattedPrice} (${tokens} tokens, ~${images} images)`
  };
}

/**
 * Format subscription price
 */
export function formatSubscriptionPrice(
  price: number,
  currency: string = 'USD',
  period: 'month' | 'year' = 'month'
): string {
  const periodText = period === 'month' ? '/month' : '/year';
  return `${formatCurrency(price, { currency })}${periodText}`;
}

/**
 * Parse price from database
 */
export function parsePrice(price: any): number {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') return parseFloat(price);
  return 0;
}

/**
 * Global Defaults
 */
export const CURRENCY_SYMBOL = '$';
export const CURRENCY_CODE = 'USD';
export const CURRENCY_NAME = 'US Dollars';

/**
 * Premium subscription pricing constants
 */
export const PRICING = {
  PREMIUM_MONTHLY_USD: 11.99,
  PREMIUM_MONTHLY_EUR: 11.99,
  PREMIUM_MONTHLY_FORMATTED: '$ 11.99 / 11,99 €',

  TOKEN_PACKAGES: {
    SMALL: { tokens: 200, price_usd: 9.99, price_eur: 9.99, images: 40 },
    MEDIUM: { tokens: 550, price_usd: 24.99, price_eur: 24.99, images: 110 },
    LARGE: { tokens: 1550, price_usd: 49.99, price_eur: 49.99, images: 310 },
    MEGA: { tokens: 5800, price_usd: 149.99, price_eur: 149.99, images: 1160 },
  },
} as const;

/**
 * Format price for Stripe (convert to cents)
 */
export function toStripeAmount(amountInCurrency: number): number {
  return Math.round(amountInCurrency * 100);
}

/**
 * Format price from Stripe
 */
export function fromStripeAmount(amountInCents: number): number {
  return amountInCents / 100;
}
