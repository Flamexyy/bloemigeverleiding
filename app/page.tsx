'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from './components/ProductCard';
import { getProducts } from './utils/shopify';
import Image from 'next/image';
import { RiArrowRightUpLine } from "react-icons/ri";
import Claims from './components/Claims';
import Faq from './components/Faq';
import SocialSection from './components/SocialSection';
import { ProductCardSkeleton } from './components/SkeletonLoader';
import Testimonials from './components/Testimonials';
import { IoFlowerOutline, IoStar } from 'react-icons/io5';

interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  price: string;
  imageUrl: string;
  availableForSale: boolean;
  variantId: string;
  quantityAvailable?: number;
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
        const formattedProducts = data.map((product: ShopifyProduct) => ({
          ...product,
          quantityAvailable: product.quantityAvailable || 1
        }));
        setProducts(formattedProducts);
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
      <div className="w-full pt-[80px]">
        {/* Hero Section */}
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-10 md:py-16">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-16">
            {/* Text Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6 order-2 lg:order-1">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text">
                Bloemen die emoties overbrengen
              </h1>
              
              <p className="text-lg md:text-xl text-text/70 max-w-2xl mx-auto lg:mx-0">
                Handgemaakte boeketten voor elke gelegenheid, bezorgd met liefde en zorg
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center lg:justify-start pt-4">
                <Link href="/shop">
                  <button className="flex items-center justify-center px-8 py-3 bg-accent text-text hover:bg-accent/70 rounded-[100px] transition-all duration-300 font-medium group">
                    Shop nu
                    <RiArrowRightUpLine className="ml-2 text-xl group-hover:translate-x-[3px] group-hover:translate-y-[-3px] transition-transform duration-300" />
                  </button>
                </Link>
                
                <Link href="/contact">
                  <button className="flex items-center justify-center px-8 py-3 border-2 border-accent bg-transparent text-text hover:bg-accent/10 rounded-[100px] transition-all duration-300 font-medium">
                    Neem contact op
                  </button>
                </Link>
              </div>
            </div>
            
            {/* Image Section - Simplified */}
            <div className="w-full lg:w-1/2 relative order-1 lg:order-2">
              <div className="relative aspect-square max-w-[500px] mx-auto">
                {/* Main image with decorative shape */}
                <div className="absolute inset-0 rounded-tl-[100px] rounded-br-[100px] rounded-tr-[25px] rounded-bl-[25px] overflow-hidden shadow-lg">
                  <Image
                    src="/top-view-beautiful-roses-bouquet-with-pink-ribbon.jpg"
                    alt="Prachtige boeketten"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                
                {/* Simple accent element */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent rounded-full flex items-center justify-center text-text font-bold shadow-lg z-10">
                  <div className="text-center">
                    <div className="text-lg md:text-xl">NIEUW</div>
                    <div className="text-xs">COLLECTIE</div>
                  </div>
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
          <div className="flex flex-col gap-6 items-start mb-10 text-text">
            <div className='w-full flex flex-col-reverse md:flex-row justify-between items-start gap-5 md:gap-10'>
              <div className='max-w-[800px]'>
                <h2 className="text-3xl font-bold">Boeketten</h2>
              </div>
              <Link 
                href="/shop"
                className="w-full justify-end min-w-fit flex items-center gap-2 transition-opacity mt-2 group"
              >
                Bekijk alles
                <RiArrowRightUpLine className="text-xl group-hover:translate-x-[3px] group-hover:translate-y-[-3px] transition-transform duration-300" />
              </Link>
            </div>
            <p className='max-w-[800px]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo odio quas vitae aspernatur optio quae quidem cumque natus necessitatibus. Natus nisi ipsam commodi libero, obcaecati eligendi iste consequatur eos totam?</p>
          </div>

          {loading && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-10 text-red-400">
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
                    className='flex items-center justify-center px-10 p-3 bg-transparent text-text border-2 border-accent hover:bg-accent rounded-[100px] transition-all duration-300'
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
        <SocialSection />
        <Faq />
        <Testimonials />
      </div>
    </div>
  );
}
