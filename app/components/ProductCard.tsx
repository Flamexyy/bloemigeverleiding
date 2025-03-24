'use client';
import { MdOutlineShoppingBag } from "react-icons/md";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import CartMenu from './CartMenu';
import { useLiked } from '../context/LikedContext';

interface ProductCardProps {
  product: {
    id: string;
    handle: string;
    title: string;
    price: string;
    compareAtPrice?: string;
    imageUrl: string;
    availableForSale: boolean;
    variantId: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isLiked, addToLiked, removeFromLiked } = useLiked();
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLiked(product.id)) {
      removeFromLiked(product.id);
    } else {
      addToLiked(product);
    }
  };

  const isOnSale = product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price);

  return (
    <>
      <Link href={`/product/${product.handle}`} className='group block mb-10'>
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
            onClick={handleLikeClick}
            className="absolute top-3 right-3 text-2xl text-text bg-cream p-2 rounded-full hover:bg-white"
          >
            {isLiked(product.id) ? <AiFillHeart /> : <AiOutlineHeart />}
          </button>
          {!product.availableForSale ? (
            <div className='absolute bottom-3 right-3 px-4 py-2 bg-cream text-text rounded-[100px] text-sm'>
              Uitverkocht
            </div>
          ) : isOnSale && (
            <div className='absolute bottom-3 right-3 px-4 py-2 bg-text text-cream rounded-[100px] text-sm'>
              Aanbieding
            </div>
          )}
        </div>
        <div className='flex justify-between flex-col text-center items-center mt-3'>
          <div className='flex flex-col sm:flex-wrap items-center mb-4'>
            <h2 className='font-medium text-[#333333] truncate'>{product.title}</h2>
            <div className="flex items-center gap-2">
              {isOnSale ? (
                <>
                  <span className="text-red-400 font-bold text-lg">€{parseFloat(product.price).toFixed(2)}</span>
                  <span className="text-text line-through text-sm">
                    €{parseFloat(product.compareAtPrice!).toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-text font-bold text-lg">€{parseFloat(product.price).toFixed(2)}</span>
              )}
            </div>
          </div>
          {product.availableForSale && (
            <button 
              onClick={handleAddToCart}
              className='w-full sm:w-fit flex items-center justify-center px-5 p-3 bg-accent text-text hover:bg-gray-100 rounded-[100px] transition-all duration-300'
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