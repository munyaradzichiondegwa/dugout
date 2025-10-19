// src/app/api/seed/data.ts

// Seed data for DugOut vendors, aligned with the project document.
// Vendor types: 'food' (Restaurants & Food Vendors), 'beverage' (Bars & Beverage Providers), 'grocery' (Grocery Shops & Supermarkets).
// Locations: GeoJSON Points around Harare, Zimbabwe (with slight variations for diversity).
// Payout methods: EcoCash or Bank Transfer (as per Zimbabwe context).
// Items: Vendor-specific MenuItems with category (e.g., 'Main Course', 'Beer', 'Fresh Produce') and itemType ('food' | 'beverage' | 'grocery').
// Prices: In USD (multi-currency support; use cents in DB for precision).
// This data is designed for seeding into MongoDB via Mongoose models (see schema notes below).

function randomOffset(base: number, spread = 0.01) {
  return base + (Math.random() - 0.5) * spread;
}

const foodItems = [
  'Sadza & Beef', 'Grilled Chicken', 'Vegan Burger', 'Sadza & Chicken', 'Beef Stew',
  'Rice & Beans', 'Grilled Fish', 'Vegetable Stir Fry', 'Pasta Alfredo', 'Chapati & Curry'
];

const beverageItems = [
  'Cappuccino', 'Latte', 'Espresso', 'Orange Juice', 'Mango Smoothie', 'Coconut Water',
  'Local Beer', 'Craft Lager', 'Soft Drink', 'Pineapple Smoothie'
];

const groceryItems = [
  'Rice (1kg)', 'Maize Meal (5kg)', 'Tomatoes (per kg)', 'Potatoes (per kg)',
  'Milk (1L)', 'Eggs (Dozen)', 'Cooking Oil (500ml)', 'Sugar (1kg)', 'Bread Loaf', 'Apples (per kg)'
];

function randomPrice() {
  return Math.floor(Math.random() * 500) + 50; // 50 – 550 cents ($0.50–$5.50)
}

const randomVendors = Array.from({ length: 30 }, (_, i) => {
  const types = ['food', 'beverage', 'grocery'] as const;
  const vendorType = types[Math.floor(Math.random() * types.length)];

  const itemPool = vendorType === 'food' ? foodItems
    : vendorType === 'beverage' ? beverageItems
    : groceryItems;

  const numItems = Math.floor(Math.random() * 3) + 2; // 2–4 items per vendor
  const items = Array.from({ length: numItems }, () => ({
    name: itemPool[Math.floor(Math.random() * itemPool.length)],
    category: vendorType === 'food' ? 'Main Course' : vendorType === 'beverage' ? 'Beverage' : 'Groceries',
    itemType: vendorType,
    price: randomPrice(),
    currency: 'USD'
  }));

  return {
    phone: `2637${Math.floor(100000000 + Math.random() * 900000000)}`, // Random Zimbabwean mobile number
    name: `${vendorType.charAt(0).toUpperCase() + vendorType.slice(1)} Vendor ${i + 1}`,
    vendorType,
    location: { type: 'Point', coordinates: [randomOffset(31.05), randomOffset(-17.83)] },
    payoutMethod: Math.random() > 0.5 ? 'EcoCash' : 'Bank Transfer',
    items
  };
});

export const vendorsData = [
  // --- Existing vendors (Food, Beverage, Grocery) ---
  // Food Vendors (Restaurants & Food Vendors)
  {
    phone: '263123456789',
    name: 'Sample Restaurant',
    vendorType: 'food',
    location: { type: 'Point', coordinates: [31.0461, -17.8252] }, // Central Harare
    payoutMethod: 'EcoCash',
    items: [
      { name: 'Sample Burger', category: 'Main Course', itemType: 'food', price: 500, currency: 'USD' }, // $5.00
      { name: 'Fries', category: 'Sides', itemType: 'food', price: 200, currency: 'USD' }, // $2.00
      { name: 'Salad', category: 'Appetizer', itemType: 'food', price: 150, currency: 'USD' }, // $1.50
    ],
  },
  {
    phone: '263712345678',
    name: 'Harare Street Eats',
    vendorType: 'food',
    location: { type: 'Point', coordinates: [31.0495, -17.8275] }, // Central Harare
    payoutMethod: 'Bank Transfer',
    items: [
      { name: 'Sadza with Beef', category: 'Main Course', itemType: 'food', price: 400, currency: 'USD' }, // $4.00 (Local Zimbabwean dish)
      { name: 'Vegetable Stew', category: 'Main Course', itemType: 'food', price: 250, currency: 'USD' }, // $2.50
      { name: 'Fresh Bread', category: 'Sides', itemType: 'food', price: 100, currency: 'USD' }, // $1.00
    ],
  },
  {
    phone: '263734567890',
    name: 'Urban Grill House',
    vendorType: 'food',
    location: { type: 'Point', coordinates: [31.0550, -17.8200] }, // East Harare
    payoutMethod: 'EcoCash',
    items: [
      { name: 'Grilled Chicken', category: 'Main Course', itemType: 'food', price: 600, currency: 'USD' }, // $6.00
      { name: 'Rice Pilaf', category: 'Sides', itemType: 'food', price: 150, currency: 'USD' }, // $1.50
      { name: 'Coleslaw', category: 'Appetizer', itemType: 'food', price: 120, currency: 'USD' }, // $1.20
    ],
  },

  // Beverage Vendors (Bars & Beverage Providers)
  {
    phone: '263777123456',
    name: 'Coffee Corner',
    vendorType: 'beverage',
    location: { type: 'Point', coordinates: [31.0522, -17.8290] }, // Central Harare
    payoutMethod: 'EcoCash',
    items: [
      { name: 'Cappuccino', category: 'Beverage', itemType: 'beverage', price: 300, currency: 'USD' }, // $3.00
      { name: 'Latte', category: 'Beverage', itemType: 'beverage', price: 350, currency: 'USD' }, // $3.50
      { name: 'Espresso', category: 'Beverage', itemType: 'beverage', price: 200, currency: 'USD' }, // $2.00
    ],
  },
  {
    phone: '263788912345',
    name: 'Fresh Juice Hub',
    vendorType: 'beverage',
    location: { type: 'Point', coordinates: [31.0430, -17.8300] }, // Near Avondale
    payoutMethod: 'EcoCash',
    items: [
      { name: 'Orange Juice', category: 'Beverage', itemType: 'beverage', price: 200, currency: 'USD' }, // $2.00
      { name: 'Mango Smoothie', category: 'Beverage', itemType: 'beverage', price: 250, currency: 'USD' }, // $2.50
      { name: 'Water Bottle', category: 'Beverage', itemType: 'beverage', price: 50, currency: 'USD' }, // $0.50
    ],
  },
  {
    phone: '263765432109',
    name: 'Local Brew Bar',
    vendorType: 'beverage',
    location: { type: 'Point', coordinates: [31.0400, -17.8350] }, // West Harare
    payoutMethod: 'Bank Transfer',
    items: [
      { name: 'Local Beer', category: 'Beer', itemType: 'beverage', price: 250, currency: 'USD' }, // $2.50
      { name: 'Craft Lager', category: 'Beer', itemType: 'beverage', price: 300, currency: 'USD' }, // $3.00
      { name: 'Soft Drink', category: 'Beverage', itemType: 'beverage', price: 100, currency: 'USD' }, // $1.00
    ],
  },

  // Grocery Vendors (Grocery Shops & Supermarkets)
  {
    phone: '263773456789',
    name: 'Local Grocery Mart',
    vendorType: 'grocery',
    location: { type: 'Point', coordinates: [31.0550, -17.8200] }, // East Harare
    payoutMethod: 'EcoCash',
    items: [
      { name: 'Rice (1kg)', category: 'Fresh Produce', itemType: 'grocery', price: 150, currency: 'USD' }, // $1.50
      { name: 'Tomatoes (Pack)', category: 'Fresh Produce', itemType: 'grocery', price: 80, currency: 'USD' }, // $0.80
      { name: 'Cooking Oil (500ml)', category: 'Groceries', itemType: 'grocery', price: 120, currency: 'USD' }, // $1.20
    ],
  },
  {
    phone: '263799876543',
    name: 'Buka Supermarket',
    vendorType: 'grocery',
    location: { type: 'Point', coordinates: [31.0400, -17.8350] }, // West Harare
    payoutMethod: 'Bank Transfer',
    items: [
      { name: 'Maize Meal (5kg)', category: 'Groceries', itemType: 'grocery', price: 300, currency: 'USD' }, // $3.00 (Local staple)
      { name: 'Apples (per kg)', category: 'Fresh Produce', itemType: 'grocery', price: 200, currency: 'USD' }, // $2.00
      { name: 'Milk (1L)', category: 'Dairy', itemType: 'grocery', price: 150, currency: 'USD' }, // $1.50
    ],
  },
  {
    phone: '263784567890',
    name: 'Avondale Fresh Market',
    vendorType: 'grocery',
    location: { type: 'Point', coordinates: [31.0430, -17.8300] }, // Near Avondale
    payoutMethod: 'EcoCash',
    items: [
      { name: 'Potatoes (per kg)', category: 'Fresh Produce', itemType: 'grocery', price: 100, currency: 'USD' }, // $1.00
      { name: 'Eggs (Dozen)', category: 'Dairy', itemType: 'grocery', price: 250, currency: 'USD' }, // $2.50
      { name: 'Bread Loaf', category: 'Bakery', itemType: 'grocery', price: 120, currency: 'USD' }, // $1.20
    ],
  },

  // --- New Food Vendors ---
  {
    phone: '263712398765',
    name: 'Mbare BBQ Hub',
    vendorType: 'food',
    location: { type: 'Point', coordinates: [31.0410, -17.8305] }, // Mbare
    payoutMethod: 'EcoCash',
    items: [
      { name: 'Beef BBQ Skewers', category: 'Main Course', itemType: 'food', price: 450, currency: 'USD' },
      { name: 'Sadza & Beans', category: 'Main Course', itemType: 'food', price: 350, currency: 'USD' },
      { name: 'Grilled Veggies', category: 'Sides', itemType: 'food', price: 200, currency: 'USD' },
    ],
  },
  {
    phone: '263711223344',
    name: 'Avondale Vegan Eats',
    vendorType: 'food',
    location: { type: 'Point', coordinates: [31.0435, -17.8280] }, // Avondale
    payoutMethod: 'Bank Transfer',
    items: [
      { name: 'Vegan Burger', category: 'Main Course', itemType: 'food', price: 550, currency: 'USD' },
      { name: 'Quinoa Salad', category: 'Appetizer', itemType: 'food', price: 250, currency: 'USD' },
      { name: 'Smoothie Bowl', category: 'Dessert', itemType: 'food', price: 300, currency: 'USD' },
    ],
  },

  // --- New Beverage Vendors ---
  {
    phone: '263722334455',
    name: 'Highlands Coffee Co.',
    vendorType: 'beverage',
    location: { type: 'Point', coordinates: [31.0600, -17.8350] }, // Highlands
    payoutMethod: 'EcoCash',
    items: [
      { name: 'Mocha', category: 'Beverage', itemType: 'beverage', price: 350, currency: 'USD' },
      { name: 'Flat White', category: 'Beverage', itemType: 'beverage', price: 300, currency: 'USD' },
      { name: 'Iced Latte', category: 'Beverage', itemType: 'beverage', price: 400, currency: 'USD' },
    ],
  },
  {
    phone: '263733445566',
    name: 'Eastgate Smoothies',
    vendorType: 'beverage',
    location: { type: 'Point', coordinates: [31.0700, -17.8200] }, // Eastgate
    payoutMethod: 'Bank Transfer',
    items: [
      { name: 'Pineapple Smoothie', category: 'Beverage', itemType: 'beverage', price: 300, currency: 'USD' },
      { name: 'Mango Shake', category: 'Beverage', itemType: 'beverage', price: 350, currency: 'USD' },
      { name: 'Coconut Water', category: 'Beverage', itemType: 'beverage', price: 200, currency: 'USD' },
    ],
  },

  // --- New Grocery Vendors ---
  {
    phone: '263744556677',
    name: 'Northview Market',
    vendorType: 'grocery',
    location: { type: 'Point', coordinates: [31.0650, -17.8150] }, // Northview
    payoutMethod: 'EcoCash',
    items: [
      { name: 'Carrots (per kg)', category: 'Fresh Produce', itemType: 'grocery', price: 100, currency: 'USD' },
      { name: 'Potatoes (per kg)', category: 'Fresh Produce', itemType: 'grocery', price: 120, currency: 'USD' },
      { name: 'Milk (1L)', category: 'Dairy', itemType: 'grocery', price: 150, currency: 'USD' },
    ],
  },
  {
    phone: '263755667788',
    name: 'Eastgate Supermarket',
    vendorType: 'grocery',
    location: { type: 'Point', coordinates: [31.0705, -17.8185] }, // Eastgate
    payoutMethod: 'Bank Transfer',
    items: [
      { name: 'Sugar (1kg)', category: 'Groceries', itemType: 'grocery', price: 150, currency: 'USD' },
      { name: 'Bread Loaf', category: 'Bakery', itemType: 'grocery', price: 120, currency: 'USD' },
      { name: 'Eggs (Dozen)', category: 'Dairy', itemType: 'grocery', price: 250, currency: 'USD' },
    ],
  },

  // --- Rural/Suburban vendors for variety ---
  {
    phone: '263766778899',
    name: 'Chitungwiza Local Eats',
    vendorType: 'food',
    location: { type: 'Point', coordinates: [31.1200, -18.0000] }, // Chitungwiza
    payoutMethod: 'EcoCash',
    items: [
      { name: 'Sadza & Chicken', category: 'Main Course', itemType: 'food', price: 400, currency: 'USD' },
      { name: 'Vegetable Soup', category: 'Appetizer', itemType: 'food', price: 200, currency: 'USD' },
    ],
  },
  {
    phone: '263777889900',
    name: 'Epworth Fresh Market',
    vendorType: 'grocery',
    location: { type: 'Point', coordinates: [31.1500, -17.9500] }, // Epworth
    payoutMethod: 'EcoCash',
    items: [
      { name: 'Maize Meal (5kg)', category: 'Groceries', itemType: 'grocery', price: 300, currency: 'USD' },
      { name: 'Tomatoes (per kg)', category: 'Fresh Produce', itemType: 'grocery', price: 100, currency: 'USD' },
      { name: 'Cooking Oil (500ml)', category: 'Groceries', itemType: 'grocery', price: 120, currency: 'USD' },
    ],
  },
  // Add more vendors here as needed for seeding (e.g., more rural locations or mixed types)

  // New randomized vendors
  ...randomVendors
];