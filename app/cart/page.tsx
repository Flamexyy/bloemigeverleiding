'use client';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { CgShoppingBag } from "react-icons/cg";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total, createCheckout } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuantityChange = (id: string, newQuantity: number, maxQuantity: number) => {
    if (newQuantity < 1) return;
    if (maxQuantity && newQuantity > maxQuantity) return;
    updateQuantity(id, newQuantity);
  };

  const handleCheckout = async () => {
    if (isLoading || items.length === 0) return;
    setIsLoading(true);
    setError(null);
    
    try {
      const checkoutUrl = await createCheckout();
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden bij het afrekenen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-12 md:py-20">
      <h1 className="text-3xl md:text-4xl font-bold text-text mb-8">WINKELWAGEN</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-16 space-y-6">
          <div className="flex justify-center">
            <CgShoppingBag className="text-6xl text-text/30" />
          </div>
          <h2 className="text-xl font-medium text-text">Je winkelwagen is leeg</h2>
          <p className="text-text/70 max-w-md mx-auto">
            Het lijkt erop dat je nog geen items hebt toegevoegd aan je winkelwagen.
          </p>
          <Link 
            href="/shop" 
            className="inline-block bg-accent text-text rounded-[50px] px-8 py-3 mt-4 hover:bg-accent/70 transition-colors"
          >
            Bekijk onze producten
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - Left Side */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const isDiscounted = item.compareAtPrice && parseFloat(String(item.compareAtPrice)) > parseFloat(String(item.price));
              
              return (
                <div key={item.id} className="flex gap-4 p-4 bg-white rounded-[25px] border border-text/10">
                  {/* Product Image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 relative rounded-xl overflow-hidden">
                    <Link href={`/products/${item.handle}`}>
                      <Image 
                        src={item.imageUrl || '/placeholder.jpg'} 
                        alt={item.title} 
                        fill
                        className="object-cover"
                      />
                    </Link>
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <Link href={`/products/${item.handle}`} className="hover:underline">
                        <h3 className="font-medium text-text truncate">{item.title}</h3>
                      </Link>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-text/50 hover:text-text transition-colors ml-2"
                        aria-label="Remove item"
                      >
                        <IoClose />
                      </button>
                    </div>
                    
                    {item.size && (
                      <p className="text-sm text-text/70 mt-1">Variant: {item.size}</p>
                    )}
                    
                    {/* Price */}
                    <div className="mt-2 flex items-center">
                      <span className={`font-medium ${isDiscounted ? 'text-red-400' : 'text-text'}`}>
                        €{parseFloat(item.price.toString()).toFixed(2)}
                      </span>
                      {item.compareAtPrice && (
                        <span className="text-text/50 line-through ml-2 text-sm">
                          €{parseFloat(item.compareAtPrice.toString()).toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="mt-3 flex flex-col gap-2 w-fit text-text">
                      <div className="flex items-center border border-text/20 rounded-[50px] overflow-hidden">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.quantityAvailable)}
                          className="w-8 h-8 flex items-center justify-center text-text/70 hover:bg-accent/20 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <IoMdRemove />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.quantityAvailable)}
                          className="w-8 h-8 flex items-center justify-center text-text/70 hover:bg-accent/20 transition-colors"
                          aria-label="Increase quantity"
                          disabled={item.quantityAvailable !== undefined && item.quantity >= item.quantityAvailable}
                        >
                          <IoMdAdd />
                        </button>
                      </div>
                      
                      {item.quantityAvailable && (
                        <span className="text-xs text-text/50 ml-1">
                          {item.quantityAvailable} beschikbaar
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Order Summary - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[25px] p-6 border border-text/10 sticky top-[120px]">
              <h2 className="text-xl font-bold text-text mb-4">Besteloverzicht</h2>
              
              <div className="space-y-3 text-text">
                {/* Subtotal */}
                <div className="flex justify-between items-center">
                  <span className="text-text/70">Subtotaal:</span>
                  <span className="font-medium">
                    €{total.toFixed(2)}
                  </span>
                </div>
                
                {/* Discount */}
                {items.some(item => item.compareAtPrice) && (
                  <div className="flex justify-between items-center text-red-500">
                    <span>Korting:</span>
                    <span className="font-medium">
                      -€{items.reduce((sum, item) => {
                        if (item.compareAtPrice) {
                          return sum + (parseFloat(String(item.compareAtPrice)) - parseFloat(String(item.price))) * item.quantity;
                        }
                        return sum;
                      }, 0).toFixed(2)}
                    </span>
                  </div>
                )}
                
                {/* Total - No shipping section */}
                <div className="pt-4 border-t border-text/20">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-text">Totaal:</span>
                    <span className="text-xl font-bold text-text">
                      €{total.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-text/70 text-right mt-1">Inclusief BTW</p>
                </div>
              </div>
              
              {/* Error message */}
              {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              {/* Checkout Button */}
              <button 
                onClick={handleCheckout}
                disabled={isLoading || items.length === 0}
                className={`w-full bg-accent text-text rounded-[50px] p-4 mt-6 hover:bg-accent/70 transition-colors ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Afrekenen...' : 'Doorgaan naar afrekenen'}
              </button>
              
              {/* Payment Methods */}
              <div className="mt-6">
                <p className="text-sm text-text/70 text-center mb-3">Veilig betalen met</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Image src="/Ideal.svg" alt="iDEAL" width={40} height={24} className="h-6 w-auto opacity-80" />
                  <Image src="/Visa.svg" alt="Visa" width={40} height={24} className="h-6 w-auto opacity-80" />
                  <Image src="/Mastercard.svg" alt="Mastercard" width={40} height={24} className="h-6 w-auto opacity-80" />
                  <Image src="/PayPal.svg" alt="PayPal" width={40} height={24} className="h-6 w-auto opacity-80" />
                  <Image src="/Maestro.svg" alt="Maestro" width={40} height={24} className="h-6 w-auto opacity-80" />
                  <Image src="/GooglePay.svg" alt="Google Pay" width={40} height={24} className="h-6 w-auto opacity-80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 