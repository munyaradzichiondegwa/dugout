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

const CartContext = createContext<{ state: CartState; dispatch: React.Dispatch<CartAction> } | undefined>(undefined);

const initialState: CartState = {
  vendorId: null,
  items: [],
  totalAmount: 0,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_VENDOR':
      return { ...state, vendorId: action.payload, items: [], totalAmount: 0 };
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.menuItemId === action.payload.menuItemId);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.menuItemId === action.payload.menuItemId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          totalAmount: state.totalAmount + action.payload.price,
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1, vendorId: state.vendorId! }],
        totalAmount: state.totalAmount + action.payload.price,
      };
    // Add cases for UPDATE_QUANTITY, REMOVE_ITEM, CLEAR_CART similarly
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}