'use client';
import { MdOutlineShoppingBag } from "react-icons/md";
import { useCart } from '../context/CartContext';
import { IoClose } from "react-icons/io5";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface CartMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartMenu({ isOpen, onClose }: CartMenuProps) {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, total, createCheckout } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (isLoading || items.length === 0) return;
    setIsLoading(true);
    try {
      console.log('Sending items to checkout:', items); // Debug log

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
      console.log('Checkout response:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.message || 'Error creating checkout');
      }

      if (!data.checkoutUrl) {
        throw new Error('No checkout URL received');
      }

      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      // Show error to user
      alert(error instanceof Error ? error.message : 'Error creating checkout');
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
          <div className="flex justify-between items-center p-4 border-b border-text/20 text-text">
            <div className="flex items-center gap-2">
              <MdOutlineShoppingBag className="text-2xl" />
              <h2 className="text-xl font-bold">Winkelwagen ({items.length})</h2>
            </div>
            <button 
              onClick={onClose}
              className="hover:bg-accent rounded-full transition-colors"
            >
              <IoClose className="text-4xl p-2" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <p className="text-center text-text">Uw winkelwagen is leeg</p>
            ) : (
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b">
                    <Link 
                      href={`/product/${item.handle}`}
                      onClick={onClose}
                      className="w-20 h-20 bg-accent rounded-xl shrink-0 relative overflow-hidden hover:opacity-80 transition-opacity"
                    >
                      <Image 
                        src={item.imageUrl} 
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex-1 text-text">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link 
                            href={`/product/${item.handle}`}
                            onClick={onClose}
                            className="hover:text-text/70 transition-colors"
                          >
                            <h3 className="font-bold">{item.title}</h3>
                          </Link>
                          {item.size && (
                            <p className="text-sm opacity-50">Maat: {item.size}</p>
                          )}
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <div className="flex items-center gap-2">
                            {item.compareAtPrice ? (
                              <>
                                <p className="text-sm text-text line-through">
                                  €{parseFloat(item.compareAtPrice).toFixed(2)}
                                </p>
                                <p className="text-red-400 font-bold">
                                  €{item.price.toFixed(2)}
                                </p>
                              </>
                            ) : (
                              <p className="font-bold">
                                €{item.price.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center border rounded-full w-fit">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-accent/10 rounded-l-full"
                          >
                            -
                          </button>
                          <span className="px-3">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-accent/10 rounded-r-full"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-sm text-red-500 hover:text-red-600 mt-2"
                        >
                          Verwijderen
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-text/20 p-4 space-y-4 text-text">
              {/* First Section - Original Price and Discount */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Subtotaal:</span>
                  <span className="font-medium">
                    €{items.reduce((sum, item) => {
                      const originalPrice = item.compareAtPrice ? parseFloat(item.compareAtPrice) : item.price;
                      return sum + (originalPrice * item.quantity);
                    }, 0).toFixed(2)}
                  </span>
                </div>

                {items.some(item => item.compareAtPrice) && (
                  <div className="flex justify-between items-center text-red-500">
                    <span>Korting:</span>
                    <span className="font-medium">
                      -€{items.reduce((sum, item) => {
                        if (item.compareAtPrice) {
                          return sum + (parseFloat(item.compareAtPrice) - item.price) * item.quantity;
                        }
                        return sum;
                      }, 0).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Second Section - Final Total */}
              <div className="pt-3 border-t border-text/20">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Totaal:</span>
                  <span className="text-xl font-bold">€{total.toFixed(2)}</span>
                </div>
                <p className="text-sm text-text/70 text-right mt-1">Inclusief BTW</p>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={handleCheckout}
                disabled={isLoading}
                className={`w-full bg-accent text-text rounded-[50px] p-4 hover:bg-accent/70 transition-colors ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Afrekenen...' : 'Afrekenen'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 