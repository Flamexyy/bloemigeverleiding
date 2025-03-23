'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BiChevronRight } from "react-icons/bi";
import ProductCard from './components/ProductCard';
import { getProducts } from './utils/shopify';
import Image from 'next/image';

interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  price: string;
  imageUrl: string;
  availableForSale: boolean;
  variantId: string;
}

export default function Home() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Section - Full Width */}
      <div className='relative w-full h-[300px] md:h-[400px] lg:h-[500px]'>
        <Image
          src="/thumb-1920-641461.jpg"
          alt="Hero Image"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
          {/* Constrained Content Width */}
          <div className="max-w-[1600px] h-full mx-auto relative px-4 lg:px-8">
            <div className="absolute bottom-8 right-8 text-right">
              <div className="text-white space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                  Welcome to Our Store
                </h1>
                <p className="text-lg md:text-xl opacity-90 max-w-2xl ml-auto">
                  Discover our collection of premium products
                </p>
                <Link 
                  href="/shop"
                  className="inline-block bg-white text-black px-6 py-3 rounded-full hover:bg-white/90 transition-colors text-lg font-medium"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of Content - Constrained Width */}
      <div className="max-w-[1600px] mx-auto">
        {/* Featured Products */}
        <div className="p-4 lg:p-8 space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link 
              href="/shop"
              className="flex items-center gap-2 hover:opacity-70 transition-opacity"
            >
              View All
              <BiChevronRight className="text-xl" />
            </Link>
          </div>

          {loading && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-3xl mb-4" />
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded-lg w-3/4" />
                    <div className="h-6 bg-gray-200 rounded-lg w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-10 text-red-500">
              <p>Error loading products: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {products.slice(0, 4).map((product) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="text-center py-10">
              <p>No products found</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Refresh
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
