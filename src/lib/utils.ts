// Utility for calculating cart total (in cents)
export function calculateCartTotal(items: any[], menuItems: any[]): number {
  return items.reduce((total, item) => {
    const menuItem = menuItems.find((mi: any) => mi._id.toString() === item.menuItemId.toString());
    return total + (menuItem?.price || 0) * item.quantity;
  }, 0);
}

// Mock OTP generator (for dev; replace with real SMS)
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Convert cents to dollars/ZWL (for display)
export function formatAmount(amount: number, currency: 'ZWL' | 'USD'): string {
  const dollars = (amount / 100).toFixed(2);
  return `${dollars} ${currency}`;
}