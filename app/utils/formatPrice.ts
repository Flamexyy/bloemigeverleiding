/**
 * Formats a price value to a currency string with the Euro symbol
 * @param price - The price to format (can be a string or number)
 * @returns Formatted price string with Euro symbol
 */
export function formatPrice(price: string | number | null | undefined): string {
  if (price === null || price === undefined) {
    return '€0,00';
  }
  
  // Convert to number if it's a string
  const priceAsNumber = typeof price === 'string' ? parseFloat(price) : price;
  
  // Format the price with Euro symbol and proper decimal separator
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(priceAsNumber);
} 