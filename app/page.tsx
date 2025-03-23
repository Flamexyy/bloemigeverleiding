'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from './components/ProductCard';
import { getProducts } from './utils/shopify';
import Image from 'next/image';
import { IoMdPricetags } from "react-icons/io";
import { RiArrowRightUpLine } from "react-icons/ri";
import Claims from './components/Claims';

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
          src="/view-beautiful-blooming-roses.jpg"
          alt="Hero Image"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
          {/* Constrained Content Width */}
          <div className="max-w-[1600px] h-full mx-auto relative px-4 lg:px-8">
            <div className="h-full items-center flex justify-center text-center">
              <div className="text-white space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                  Bloemigeverleiding
                </h1>
                <p className="text-lg md:text-xl opacity-90 max-w-2xl ml-auto">
                  Discover our collection of premium products
                </p>
               
               <div className='w-full flex justify-center items-center'>
                <Link className='w-fit'
                  href="/shop"><button className="custom font-bold flex items-center gap-2 justify-center">Shop nu<IoMdPricetags /></button>
                </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of Content - Constrained Width */}
      <div className="max-w-[1600px] mx-auto">
        {/* Featured Products */}
        <div className="p-4 lg:p-8 py-14 lg:py-20">
          <div className="flex flex-col gap-6 items-start mb-10">
            <div className='w-full flex justify-between items-center gap-10'>
              <div className='max-w-[800px]'>
                <h2 className="text-3xl font-bold">Nieuwste producten</h2>
              </div>
              <Link 
                href="/shop"
                className="min-w-fit flex items-center gap-2 hover:opacity-70 transition-opacity"
              >
                Bekijk alles
                <RiArrowRightUpLine className="text-xl" />
              </Link>
            </div>
            <p className='max-w-[800px]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius cum natus illum iste aut nemo earum quae minima ad officiis, ipsum autem similique praesentium distinctio laborum quo. Nulla, cupiditate! Dolore.</p>
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
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {products.slice(0, 4).map((product) => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
              <div className="flex justify-center mt-6">
                <Link 
                  href="/shop"
                    className='flex items-center justify-center px-5 p-3 bg-transparent text-text border-2 border-accent hover:bg-accent rounded-[100px] transition-all duration-300'
                >
                  Bekijk alle producten
                </Link>
              </div>
            </>
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
        <Claims />
      </div>
    </div>
  );
}
