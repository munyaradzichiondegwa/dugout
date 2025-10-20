// src/types.ts

export interface MenuItem {
  _id: string;
  name: string;
  category: string;
  itemType: 'food' | 'beverage' | 'grocery';
  price: number; // Stored in cents
  currency?: 'USD' | 'ZWL';
}

export interface Vendor {
  _id: string;
  name: string;
  phone: string;
  vendorType: 'food' | 'beverage' | 'grocery';
  payoutMethod: 'EcoCash' | 'Bank Transfer';
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  items?: MenuItem[]; // Original items array from DB
  menu?: MenuItem[]; // Alias for UI usage, can map items -> menu
}
