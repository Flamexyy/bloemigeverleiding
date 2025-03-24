'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface CartItem {
  id: string;
  variantId: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  size?: string;
  handle: string;
  compareAtPrice: string | null;
  quantityAvailable: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  createCheckout: () => Promise<string>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_COOKIE_NAME = 'shopCart';
const COOKIE_EXPIRY = 30; // days

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from cookies on mount
  useEffect(() => {
    const savedCart = Cookies.get(CART_COOKIE_NAME);
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart cookie:', error);
        Cookies.remove(CART_COOKIE_NAME);
      }
    }
  }, []);

  // Save cart to cookies whenever it changes
  useEffect(() => {
    if (items.length > 0) {
      Cookies.set(CART_COOKIE_NAME, JSON.stringify(items), {
        expires: COOKIE_EXPIRY,
        sameSite: 'lax'
      });
    } else {
      Cookies.remove(CART_COOKIE_NAME);
    }
  }, [items]);

  const addToCart = (newItem: CartItem) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === newItem.id);
      if (existingItem) {
        // Calculate new quantity and check against limit
        const newQuantity = existingItem.quantity + newItem.quantity;
        if (newQuantity > existingItem.quantityAvailable) {
          // If would exceed limit, set to max available
          return currentItems.map(item =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantityAvailable }
              : item
          );
        }
        // If within limit, update normally
        return currentItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      // For new items, ensure quantity doesn't exceed available
      const safeQuantity = Math.min(newItem.quantity, newItem.quantityAvailable);
      return [...currentItems, { ...newItem, quantity: safeQuantity }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      removeFromCart(id);
      return;
    }
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    Cookies.remove(CART_COOKIE_NAME);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const createCheckout = async () => {
    try {
      const response = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          items: items.map(item => ({
            variantId: item.variantId,
            quantity: item.quantity
          }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create checkout');
      }

      const data = await response.json();
      
      if (!data.checkoutUrl) {
        throw new Error('Invalid checkout response');
      }

      // Clear cart after successful checkout creation
      clearCart();
      
      return data.checkoutUrl;
    } catch (error) {
      console.error('Error creating checkout:', error);
      throw new Error('Failed to create checkout. Please try again.');
    }
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total,
      itemCount,
      createCheckout
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 