/**
 * Currency Formatting Utilities
 * 
 * Provides consistent currency formatting across the application
 * following Swedish Kr conventions.
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
    currency = 'SEK',
    locale = 'sv-SE'
  } = options;

  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(amount);

  return formatted.trim();
}

/**
 * Convenience formatters
 */
export const formatSEK = (amount: number, includeDecimals = true) =>
  formatCurrency(amount, { currency: 'SEK', locale: 'sv-SE', includeDecimals });

export const formatUSD = (amount: number, includeDecimals = true) =>
  formatCurrency(amount, { currency: 'USD', locale: 'en-US', includeDecimals });

export const formatEUR = (amount: number, includeDecimals = true) =>
  formatCurrency(amount, { currency: 'EUR', locale: 'de-DE', includeDecimals });

/**
 * Format in both USD and EUR - or now SEK and USD
 */
export const formatDual = (amountSEK: number, amountUSD: number) => {
  return `${formatSEK(amountSEK)} / ${formatUSD(amountUSD)}`;
};

/**
 * Format token package price with equivalent images
 */
export function formatTokenPackagePrice(tokens: number, price: number, currency: string = 'SEK'): {
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
    images: `~${images} bilder`,
    full: `${formattedPrice} (${tokens} tokens, ~${images} bilder)`
  };
}

/**
 * Format subscription price
 */
export function formatSubscriptionPrice(
  price: number,
  currency: string = 'SEK',
  period: 'month' | 'year' = 'month'
): string {
  const periodText = period === 'month' ? '/månad' : '/år';
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
export const CURRENCY_SYMBOL = 'kr';
export const CURRENCY_CODE = 'SEK';
export const CURRENCY_NAME = 'Svenska kronor';

/**
 * Premium subscription pricing constants (SEK)
 */
export const PRICING = {
  PREMIUM_MONTHLY_SEK: 129,
  PREMIUM_MONTHLY_FORMATTED: '129 kr',

  TOKEN_PACKAGES: {
    SMALL: { tokens: 200, price_sek: 99, images: 40 },
    MEDIUM: { tokens: 550, price_sek: 249, images: 110 },
    LARGE: { tokens: 1550, price_sek: 499, images: 310 },
    MEGA: { tokens: 5800, price_sek: 1499, images: 1160 },
  },
} as const;


/**
 * Format price for Stripe (convert to cents/öre)
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

