'use client';
import { MdOutlineShoppingBag } from "react-icons/md";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
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
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [liked, setLiked] = useState(false);

  if (!product) {
    return null;
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.availableForSale) return;

    try {
      const cartItem = {
        id: product.id,
        title: product.title,
        price: parseFloat(product.price),
        quantity: 1,
        imageUrl: product.imageUrl,
        variantId: product.variantId,
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
        <div className="relative w-full aspect-square rounded-[30px] overflow-hidden bg-[#F5F5F5]">
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
          <button 
            onClick={(e) => {
              e.preventDefault();
              setLiked(!liked);
            }}
            className="absolute top-3 right-3 text-2xl text-text bg-accent p-2 rounded-full shadow-lg hover:bg-white"
          >
            {liked ? <AiFillHeart /> : <AiOutlineHeart />}
          </button>
          {product.availableForSale ? null : (
            <div className='absolute bottom-3 right-3 px-4 py-2 bg-white/90 text-[#666666] rounded-[100px] text-sm shadow-lg'>
              Out of Stock
            </div>
          )}
        </div>
        <div className='flex justify-between flex-col text-center items-center mt-3'>
          <div className='flex flex-col sm:flex-wrap sm:gap-4 items-center mb-4'>
            <h2 className='font-medium text-[#333333] truncate'>{product.title}</h2>
            <p className='text-text font-bold'>€{parseFloat(product.price).toFixed(2)}</p>
          </div>
          {product.availableForSale && (
            <button 
              onClick={handleAddToCart}
              className='flex items-center justify-center px-5 p-3 bg-accent text-text hover:bg-gray-100 rounded-[100px] transition-all duration-300'
            >
              <MdOutlineShoppingBag className="text-xl mr-2" />Toevoegen
            </button>
          )}
        </div>
      </Link>
      <CartMenu 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}