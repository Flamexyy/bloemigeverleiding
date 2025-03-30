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
  compareAtPrice: string | number | null | undefined;
  quantityAvailable: number;
  availableForSale: boolean;
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
  getCartItemQuantity: (variantId: string) => number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  total: 0,
  itemCount: 0,
  createCheckout: async () => '',
  getCartItemQuantity: () => 0,
  isOpen: false,
  setIsOpen: () => {},
});

const CART_COOKIE_NAME = 'shopCart';
const COOKIE_EXPIRY = 30; // days

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

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
      // Check if item already exists in cart
      const existingItemIndex = currentItems.findIndex(item => item.id === newItem.id);
      
      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        const updatedItems = [...currentItems];
        const existingItem = updatedItems[existingItemIndex];
        
        // Calculate new quantity (respecting available quantity)
        const newQuantity = Math.min(
          existingItem.quantity + newItem.quantity,
          existingItem.quantityAvailable
        );
        
        // Remove the existing item
        updatedItems.splice(existingItemIndex, 1);
        
        // Add the updated item at the beginning of the array
        return [
          { ...existingItem, quantity: newQuantity },
          ...updatedItems
        ];
      } else {
        // For new items, ensure quantity doesn't exceed available
        const safeQuantity = Math.min(newItem.quantity, newItem.quantityAvailable);
        
        // Add new item at the beginning of the array
        return [{ ...newItem, quantity: safeQuantity }, ...currentItems];
      }
    });
    
    // Open the cart when adding items
    setIsOpen(true);
  };

  const removeFromCart = (id: string) => {
    setItems(currentItems => {
      const updatedItems = currentItems.filter(item => item.id !== id);
      
      // Auto-close cart if it's now empty
      if (updatedItems.length === 0) {
        setIsOpen(false);
      }
      
      return updatedItems;
    });
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
    if (items.length === 0) {
      throw new Error('No items in cart');
    }

    try {
      const response = await fetch('/api/checkout', {
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error creating checkout');
      }

      if (!data.checkoutUrl) {
        throw new Error('No checkout URL received');
      }

      return data.checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      throw error;
    }
  };

  const getCartItemQuantity = (variantId: string) => {
    return items.reduce((total, item) => {
      if (item.variantId === variantId) {
        return total + item.quantity;
      }
      return total;
    }, 0);
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
      createCheckout,
      getCartItemQuantity,
      isOpen,
      setIsOpen
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