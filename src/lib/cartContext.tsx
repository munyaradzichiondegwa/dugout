'use client';
import { createContext, useContext, useReducer, ReactNode } from 'react';

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number; // in cents
  quantity: number;
  vendorId: string;
}

export interface CartState {
  vendorId: string | null;
  items: CartItem[];
  totalAmount: number; // in cents
}

type CartAction =
  | { type: 'SET_VENDOR'; payload: string }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_QUANTITY'; payload: { menuItemId: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{ state: CartState; dispatch: React.Dispatch<CartAction> } | undefined>(undefined);

const initialState: CartState = {
  vendorId: null,
  items: [],
  totalAmount: 0,
};

// Utility to calculate total
const calculateTotal = (items: CartItem[]) => items.reduce((sum, item) => sum + item.price * item.quantity, 0);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_VENDOR':
      return { vendorId: action.payload, items: [], totalAmount: 0 };

    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.menuItemId === action.payload.menuItemId);
      let updatedItems: CartItem[];

      if (existingItem) {
        updatedItems = state.items.map(item =>
          item.menuItemId === action.payload.menuItemId
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        updatedItems = [...state.items, action.payload];
      }

      return {
        ...state,
        items: updatedItems,
        totalAmount: calculateTotal(updatedItems),
      };
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items
        .map(item =>
          item.menuItemId === action.payload.menuItemId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
        .filter(item => item.quantity > 0); // Remove if quantity becomes 0

      return {
        ...state,
        items: updatedItems,
        totalAmount: calculateTotal(updatedItems),
      };
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.menuItemId !== action.payload);
      return {
        ...state,
        items: updatedItems,
        totalAmount: calculateTotal(updatedItems),
      };
    }

    case 'CLEAR_CART':
      return { ...state, items: [], totalAmount: 0, vendorId: null };

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
