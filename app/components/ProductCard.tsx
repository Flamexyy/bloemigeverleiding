'use client';
import { MdOutlineShoppingBag } from "react-icons/md";
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import CartMenu from './CartMenu';

interface ProductCardProps {
  product: {
    id: string;
    handle: string;
    title: string;
    price: string;
    imageUrl: string;
    availableForSale: boolean;
    variantId: string;
    variants?: {
      edges: Array<{
        node: {
          id: string;
          availableForSale: boolean;
        }
      }>
    };
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  if (!product) {
    return null;
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product page
    if (!product.availableForSale) return;

    try {
      const cartItem = {
        id: product.id,
        title: product.title,
        price: parseFloat(product.price),
        quantity: 1,
        imageUrl: product.imageUrl,
        variantId: product.variantId
      };

      addToCart(cartItem);
      setIsCartOpen(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <>
      <Link href={`/product/${product.handle}`} className='group block mb-4'>
        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-[#F5F5F5]">
          {product.imageUrl ? (
            <Image 
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-[#666666]">No image</span>
            </div>
          )}
          {product.availableForSale ? (
            <button 
              onClick={handleAddToCart}
              className='absolute bottom-3 right-3 flex items-center justify-center w-10 h-10 bg-white/90 hover:bg-white text-[#333333] rounded-xl shadow-lg md:opacity-0 md:group-hover:opacity-100 md:transform md:translate-y-2 md:group-hover:translate-y-0 transition-all duration-300'
            >
              <MdOutlineShoppingBag className="text-xl" />
            </button>
          ) : (
            <div className='absolute bottom-3 right-3 px-4 py-2 bg-white/90 text-[#666666] rounded-xl text-sm shadow-lg'>
              Out of Stock
            </div>
          )}
        </div>
        <div className='flex flex-col mt-3'>
          <h2 className='font-medium text-[#333333] truncate'>{product.title}</h2>
          <p className='text-[#666666]'>€{parseFloat(product.price).toFixed(2)}</p>
        </div>
      </Link>
      <CartMenu 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
} 