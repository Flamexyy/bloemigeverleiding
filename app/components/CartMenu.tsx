'use client';
import { MdOutlineShoppingBag } from "react-icons/md";
import { useCart } from '../context/CartContext';
import { IoClose } from "react-icons/io5";
import { useState } from 'react';

interface CartMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartMenu({ isOpen, onClose }: CartMenuProps) {
  const { items, removeFromCart, updateQuantity, total, createCheckout } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (isLoading || items.length === 0) return;
    setIsLoading(true);
    try {
      const checkoutUrl = await createCheckout();
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 z-50' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Cart Panel */}
      <div 
        className={`fixed inset-y-0 right-0 w-full md:w-[400px] bg-white transition-transform duration-300 transform z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center gap-2">
              <MdOutlineShoppingBag className="text-2xl" />
              <h2 className="text-xl font-bold">Cart ({items.length})</h2>
            </div>
            <button 
              onClick={onClose}
              className="hover:bg-gray-100 rounded-full transition-colors"
            >
              <IoClose className="text-4xl p-2" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <p className="text-center text-gray-500">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b">
                    <div className="w-20 h-20 bg-gray-100 rounded-xl shrink-0">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">{item.title}</h3>
                      {item.size && (
                        <p className="text-sm opacity-50">Size: {item.size}</p>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-6 h-6 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-bold">€{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 text-sm hover:underline mt-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg">Total</span>
                <span className="text-xl font-bold">€{total.toFixed(2)}</span>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={isLoading}
                className={`w-full bg-zinc-900 text-white rounded-xl p-4 hover:bg-zinc-800 transition-colors ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Processing...' : 'Checkout'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 