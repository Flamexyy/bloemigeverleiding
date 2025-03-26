'use client';
import { useLiked } from '../context/LikedContext';
import ProductCard from '../components/ProductCard';
import Link from 'next/link';
import { IoArrowBack } from "react-icons/io5";
import { LikedProductSkeleton } from '../components/SkeletonLoader';
import { useState, useEffect } from 'react';

export default function LikedPage() {
  const { items } = useLiked();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for a short time to show the skeleton
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-text">Favorieten</h1>
          <p className="text-text/50 text-sm">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <LikedProductSkeleton key={index} />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-text/70 mb-4">Je hebt nog geen favorieten</p>
          <Link 
            href="/shop" 
            className="inline-block bg-accent text-text rounded-[50px] px-8 py-4 hover:bg-accent/70"
          >
            Bekijk onze producten
          </Link>
        </div>
      )}
    </div>
  );
} 