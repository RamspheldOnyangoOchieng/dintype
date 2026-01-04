/**
 * Currency Formatting Utilities
 * 
 * Provides consistent currency formatting across the application
 * following USD/English conventions by default.
 */

/**
 * Format a price
 * 
 * Default conventions (USD):
 * - Comma as thousands separator: $1,499.00
 * - Currency symbol before amount: $99.00
 * 
 * @param amount - The amount
 * @param options - Formatting options
 * @returns Formatted price string
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

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(amount);
}

/**
 * Alias for backward compatibility during transition
 */
export const formatSEK = (amount: number, options: any = {}) => {
  return formatCurrency(amount, { ...options, currency: 'USD', locale: 'en-US' });
};

/**
 * Format token package price with equivalent images
 */
export function formatTokenPackagePrice(tokens: number, price: number): {
  price: string;
  tokens: string;
  images: string;
  full: string;
} {
  const images = Math.floor(tokens / 5); // Assuming 5 tokens per image
  const formattedPrice = formatCurrency(price);

  return {
    price: formattedPrice,
    tokens: `${tokens} tokens`,
    images: `~${images} images`,
    full: `${formattedPrice} (${tokens} tokens, ~${images} images)`
  };
}

/**
 * Format subscription price
 * 
 * @example
 * formatSubscriptionPrice(11.99) // "$11.99/month"
 */
export function formatSubscriptionPrice(
  price: number,
  period: 'month' | 'year' = 'month'
): string {
  const periodText = period === 'month' ? '/month' : '/year';
  return `${formatCurrency(price)}${periodText}`;
}

/**
 * Parse price from database (handles both number and string)
 */
export function parsePrice(price: any): number {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') return parseFloat(price);
  return 0;
}

/**
 * Get currency symbol
 */
export const CURRENCY_SYMBOL = '$';
export const CURRENCY_CODE = 'USD';
export const CURRENCY_NAME = 'US Dollars';

/**
 * Premium subscription pricing constants (USD)
 */
export const PRICING = {
  PREMIUM_MONTHLY_USD: 11.99,
  PREMIUM_MONTHLY_FORMATTED: '$11.99/month',

  TOKEN_PACKAGES: {
    SMALL: { tokens: 200, price: 9.99, images: 40 },
    MEDIUM: { tokens: 550, price: 24.99, images: 110 },
    LARGE: { tokens: 1550, price: 49.99, images: 310 },
    MEGA: { tokens: 5800, price: 149.99, images: 1160 },
  },
} as const;

/**
 * Format price for Stripe (convert to cents)
 * Stripe expects amounts in the smallest currency unit (cents for USD)
 * 1 USD = 100 cents
 */
export function toStripeAmount(amountInCurrency: number): number {
  return Math.round(amountInCurrency * 100);
}

/**
 * Format price from Stripe (convert from cents to currency)
 */
export function fromStripeAmount(amountInCents: number): number {
  return amountInCents / 100;
}

/**
 * Format price range
 */
export function formatPriceRange(min: number, max: number): string {
  return `${formatCurrency(min, { includeDecimals: false })}-${formatCurrency(max)}`;
}
