// src/lib/cartContext.tsx
'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';

interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  vendorId: string;
}

interface CartState {
  vendorId: string | null;
  items: CartItem[];
  totalAmount: number;
}

type CartAction =
  | { type: 'SET_VENDOR'; payload: string }
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'vendorId'> }
  | { type: 'UPDATE_QUANTITY'; payload: { menuItemId: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = {
  vendorId: null,
  items: [],
  totalAmount: 0,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_VENDOR':
      return { vendorId: action.payload, items: [], totalAmount: 0 };

    case 'ADD_ITEM': {
      if (!state.vendorId) return state; // Cannot add without vendor

      const existingItem = state.items.find(i => i.menuItemId === action.payload.menuItemId);
      let updatedItems: CartItem[];

      if (existingItem) {
        updatedItems = state.items.map(i =>
          i.menuItemId === action.payload.menuItemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        updatedItems = [...state.items, { ...action.payload, quantity: 1, vendorId: state.vendorId }];
      }

      const totalAmount = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      return { ...state, items: updatedItems, totalAmount };
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items
        .map(i =>
          i.menuItemId === action.payload.menuItemId
            ? { ...i, quantity: action.payload.quantity }
            : i
        )
        .filter(i => i.quantity > 0); // remove items with 0 quantity

      const totalAmount = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      return { ...state, items: updatedItems, totalAmount };
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(i => i.menuItemId !== action.payload);
      const totalAmount = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      return { ...state, items: updatedItems, totalAmount };
    }

    case 'CLEAR_CART':
      return { ...state, items: [], totalAmount: 0 };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
