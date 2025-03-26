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
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Text Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
              <div className="mb-2">
                <Image 
                  src="/logo.svg" 
                  alt="Bloemigeverleiding Logo" 
                  width={280} 
                  height={70} 
                  className="mx-auto lg:mx-0"
                />
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text">
                Prachtige boeketten voor elke gelegenheid
              </h1>
              
              <p className="text-lg md:text-xl text-text/70 max-w-2xl mx-auto lg:mx-0">
                "De liefde voor bloemen die altijd bloeien"
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Link href="/shop">
                  <button className="flex items-center justify-center px-8 py-3 bg-accent text-text hover:bg-accent/70 rounded-[100px] transition-all duration-300 font-medium">
                    Shop nu
                  </button>
                </Link>
                
                <Link href="/contact">
                  <button className="flex items-center justify-center px-8 py-3 border-2 border-accent bg-transparent text-text hover:bg-accent/10 rounded-[100px] transition-all duration-300 font-medium">
                    Neem contact op
                  </button>
                </Link>
              </div>
            </div>
            
            {/* Image Section */}
            <div className="w-full lg:w-1/2 relative">
              <div className="relative aspect-[4/5] max-w-[600px] mx-auto">
                <Image
                  src="/top-view-beautiful-roses-bouquet-with-pink-ribbon.jpg"
                  alt="Prachtige boeketten"
                  fill
                  className="object-cover rounded-tl-[100px] rounded-br-[100px] rounded-[30px] shadow-lg"
                  priority
                />
                
                {/* Decorative elements */}
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-accent rounded-full flex items-center justify-center text-text font-bold">
                  <div className="text-center">
                    <div className="text-xl">20%</div>
                    <div className="text-sm">KORTING</div>
                  </div>
                </div>
                
                <div className="absolute -top-4 -right-4 bg-white p-4 rounded-[20px] shadow-md">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-text font-medium text-sm">4.9/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Trust Badges */}
        <div className="bg-accent/10 py-8 mt-10">
          <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-text">
                  <div className="font-bold">Verse bloemen</div>
                  <div className="text-sm text-text/70">Dagelijks vers</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-text">
                  <div className="font-bold">Snelle levering</div>
                  <div className="text-sm text-text/70">Binnen 24 uur</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div className="text-text">
                  <div className="font-bold">Veilig betalen</div>
                  <div className="text-sm text-text/70">Meerdere opties</div>
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
