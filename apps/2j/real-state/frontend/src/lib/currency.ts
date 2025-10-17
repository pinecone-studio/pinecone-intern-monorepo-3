/**
 * Format price in Mongolian Tugrik (₮)
 * @param price - The price to format
 * @returns Formatted price string with ₮ symbol
 */
export const formatPrice = (price: number): string => {
  return `₮ ${new Intl.NumberFormat('mn-MN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)}`;
};

/**
 * Format price with currency code for display
 * @param price - The price to format
 * @returns Formatted price string with MNT code
 */
export const formatPriceWithCode = (price: number): string => {
  return `${new Intl.NumberFormat('mn-MN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)} MNT`;
};
