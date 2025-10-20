// src/types.ts

export interface Vendor {
  _id: string;
  name: string;
  vendorType: string;
  payoutMethod: string;
  items?: MenuItem[]; // optional: menu items for the vendor
}

export interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description?: string;
}
